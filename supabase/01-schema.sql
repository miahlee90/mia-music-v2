-- ============================================================
-- Music Fundamentals LMS — 01: schema, indexes, RLS
-- Paste into Supabase SQL Editor FIRST (before 02 and 03).
-- Multi-tenant: organizations -> teachers/classes/students.
-- Students never get direct table access; they act only through
-- SECURITY DEFINER RPCs in 03-functions.sql.
-- ============================================================
create extension if not exists pgcrypto;

-- ---------- private secrets (no RLS grants; definer functions only) ----------
create table if not exists app_secrets(
  k text primary key,
  v text not null
);
insert into app_secrets(k,v) values ('access_hmac_key', encode(gen_random_bytes(32),'hex'))
  on conflict (k) do nothing;
revoke all on app_secrets from anon, authenticated;

-- ---------- tenancy ----------
create table if not exists organizations(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
create table if not exists organization_members(
  org_id uuid not null references organizations(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','teacher')),
  created_at timestamptz not null default now(),
  primary key (org_id,user_id)
);
create table if not exists license_status(
  org_id uuid primary key references organizations(id),
  plan text not null default 'free',
  seats int,
  valid_until timestamptz
);

-- ---------- teacher approval (owner-managed allowlist) ----------
create table if not exists approved_teachers(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  email text not null,
  status text not null default 'pending' check (status in ('pending','accepted','revoked')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  acted_by text,             -- owner email who performed the last action
  unique (org_id,email)
);
create table if not exists teacher_profiles(
  user_id uuid primary key references auth.users(id),
  org_id uuid not null references organizations(id),
  display_name text,
  time_zone text default null,   -- null = use browser time zone
  created_at timestamptz not null default now()
);

-- ---------- courses & curriculum ----------
create table if not exists courses(
  id text primary key,           -- e.g. 'practical-music-theory'
  org_id uuid references organizations(id),  -- null = global/shared course
  title text not null,
  active boolean not null default true
);
create table if not exists curriculum_units(
  course_id text not null references courses(id),
  unit int not null,
  title text not null,
  primary key (course_id,unit)
);
create table if not exists curriculum_items(
  course_id text not null references courses(id),
  item_id int not null,          -- stable internal lesson number (never repurposed)
  unit int not null,
  label text not null,           -- visible Unit.Lesson number, e.g. '4.6'
  title text not null,
  route text not null,
  lbd_ids jsonb not null default '[]'::jsonb,  -- required Learn-by-Doing activity ids
  lbd_count int not null default 0,
  has_quiz boolean not null default true,
  status text not null default 'active' check (status in ('active','archived')),
  version int not null default 1,
  primary key (course_id,item_id)
);

-- ---------- classes & students ----------
create table if not exists classes(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  teacher_id uuid not null references auth.users(id),
  name text not null,
  class_code text not null unique,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists class_courses(
  class_id uuid not null references classes(id),
  course_id text not null references courses(id),
  primary key (class_id,course_id)
);
create table if not exists students(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  display_name text not null,    -- nickname / school id; NO personal data required
  access_lookup text not null,   -- hmac(access_code) for O(1) login lookup
  access_hash text not null,     -- bcrypt(access_code)
  archived boolean not null default false,
  code_reset_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_students_lookup on students(access_lookup);
create table if not exists class_enrollments(
  class_id uuid not null references classes(id),
  student_id uuid not null references students(id),
  enrolled_at timestamptz not null default now(),
  archived boolean not null default false,
  primary key (class_id,student_id)
);
create table if not exists course_enrollments(
  student_id uuid not null references students(id),
  course_id text not null references courses(id),
  enrolled_at timestamptz not null default now(),
  primary key (student_id,course_id)
);

-- ---------- student sessions & rate limiting ----------
create table if not exists student_sessions(
  token_hash text primary key,   -- sha256 of the bearer token
  student_id uuid not null references students(id),
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '180 days'
);
create index if not exists idx_sessions_student on student_sessions(student_id);
create table if not exists login_attempts(
  id bigint generated always as identity primary key,
  class_code text not null,
  ok boolean not null,
  at timestamptz not null default now()
);
create index if not exists idx_login_attempts on login_attempts(class_code,at);

-- ---------- academic progress ----------
create table if not exists learning_progress(
  student_id uuid not null references students(id),
  course_id text not null references courses(id),
  item_id int not null,
  lbd_done_ids jsonb not null default '[]'::jsonb, -- distinct completed activity ids
  lbd_attempts int not null default 0,
  lbd_last_at timestamptz,
  quiz_attempts int not null default 0,
  quiz_last_at timestamptz,
  quiz_recent_earned int, quiz_recent_possible int,
  quiz_best_earned int,   quiz_best_possible int,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  first_started_at timestamptz,
  last_active_at timestamptz,
  page_completed_at timestamptz,  -- first-completion date; never overwritten by retakes
  updated_at timestamptz not null default now(),
  primary key (student_id,course_id,item_id)
);
create index if not exists idx_progress_course on learning_progress(course_id,item_id);
create table if not exists lbd_attempts(
  id uuid primary key,            -- client-generated: natural dedupe for offline retries
  student_id uuid not null references students(id),
  course_id text not null, item_id int not null,
  activity_id text not null,
  client_ts timestamptz,          -- original timestamp from the device
  server_ts timestamptz not null default now()
);
create index if not exists idx_lbd_attempts_s on lbd_attempts(student_id,course_id,item_id);
create table if not exists quiz_attempts(
  id uuid primary key,
  student_id uuid not null references students(id),
  course_id text not null, item_id int not null,
  earned int not null, possible int not null,
  client_ts timestamptz,
  server_ts timestamptz not null default now()
);
create index if not exists idx_quiz_attempts_s on quiz_attempts(student_id,course_id,item_id);
create table if not exists unit_completions(
  student_id uuid not null references students(id),
  course_id text not null, unit int not null,
  completed_at timestamptz not null default now(),
  primary key (student_id,course_id,unit)
);
create table if not exists course_completions(
  student_id uuid not null references students(id),
  course_id text not null,
  completed_at timestamptz not null default now(),
  primary key (student_id,course_id)
);

-- ---------- adjustments & audit ----------
create table if not exists teacher_adjustments(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  actor_email text not null,
  student_id uuid not null,
  course_id text, item_id int,
  action text not null,           -- e.g. 'reset_page_completion'
  reason text not null,
  created_at timestamptz not null default now()
);
create table if not exists audit_logs(
  id bigint generated always as identity primary key,
  org_id uuid,
  actor_email text,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_org on audit_logs(org_id,created_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- Philosophy: students have NO table access at all (RPC-only).
-- Teachers (authenticated) may read rows scoped to their org/classes.
-- All writes go through RPCs in 03-functions.sql.
-- ============================================================
alter table organizations       enable row level security;
alter table organization_members enable row level security;
alter table license_status      enable row level security;
alter table approved_teachers   enable row level security;
alter table teacher_profiles    enable row level security;
alter table courses             enable row level security;
alter table curriculum_units    enable row level security;
alter table curriculum_items    enable row level security;
alter table classes             enable row level security;
alter table class_courses       enable row level security;
alter table students            enable row level security;
alter table class_enrollments   enable row level security;
alter table course_enrollments  enable row level security;
alter table student_sessions    enable row level security;
alter table login_attempts      enable row level security;
alter table learning_progress   enable row level security;
alter table lbd_attempts        enable row level security;
alter table quiz_attempts       enable row level security;
alter table unit_completions    enable row level security;
alter table course_completions  enable row level security;
alter table teacher_adjustments enable row level security;
alter table audit_logs          enable row level security;
alter table app_secrets         enable row level security;

-- helper: is the current auth user an ACCEPTED teacher (or owner)?
create or replace function is_active_teacher() returns boolean
language sql stable security definer set search_path=public,extensions as $$
  select exists(
    select 1 from approved_teachers a
    where lower(a.email)=lower(coalesce(auth.jwt()->>'email',''))
      and a.status='accepted')
  or exists(
    select 1 from organization_members m
    where m.user_id=auth.uid() and m.role='owner');
$$;
create or replace function is_owner() returns boolean
language sql stable security definer set search_path=public,extensions as $$
  select exists(select 1 from organization_members m
    where m.user_id=auth.uid() and m.role='owner');
$$;
create or replace function my_org_ids() returns setof uuid
language sql stable security definer set search_path=public,extensions as $$
  select org_id from organization_members where user_id=auth.uid()
  union
  select org_id from teacher_profiles where user_id=auth.uid();
$$;

-- curriculum & courses: readable by any signed-in ACTIVE teacher; global courses visible
create policy curriculum_read on curriculum_items for select to authenticated
  using (is_active_teacher());
create policy curriculum_units_read on curriculum_units for select to authenticated
  using (is_active_teacher());
create policy courses_read on courses for select to authenticated
  using (is_active_teacher() and (org_id is null or org_id in (select my_org_ids())));

-- org visibility
create policy org_read on organizations for select to authenticated
  using (id in (select my_org_ids()));
create policy org_members_read on organization_members for select to authenticated
  using (user_id=auth.uid() or is_owner());
create policy license_read on license_status for select to authenticated
  using (is_owner() and org_id in (select my_org_ids()));

-- approved_teachers: owner only
create policy approved_owner_all on approved_teachers for all to authenticated
  using (is_owner() and org_id in (select my_org_ids()))
  with check (is_owner() and org_id in (select my_org_ids()));

-- teacher_profiles: self + owner
create policy profile_self on teacher_profiles for select to authenticated
  using (user_id=auth.uid() or is_owner());
create policy profile_self_up on teacher_profiles for update to authenticated
  using (user_id=auth.uid()) with check (user_id=auth.uid());

-- classes: the assigned teacher (active) or owner, within org
create policy classes_teacher on classes for select to authenticated
  using (is_active_teacher() and (teacher_id=auth.uid() or is_owner()) and org_id in (select my_org_ids()));
create policy class_courses_read on class_courses for select to authenticated
  using (class_id in (select id from classes where (teacher_id=auth.uid() or is_owner()) and org_id in (select my_org_ids())));

-- students & enrollments: visible only to the teacher of a class the student is in (or owner)
create policy enroll_read on class_enrollments for select to authenticated
  using (class_id in (select id from classes where (teacher_id=auth.uid() or is_owner()) and org_id in (select my_org_ids())));
create policy students_teacher on students for select to authenticated
  using (is_active_teacher() and id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));
create policy course_enroll_read on course_enrollments for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));

-- progress data: same teacher scope (read-only; writes via RPC only)
create policy progress_teacher on learning_progress for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));
create policy lbd_teacher on lbd_attempts for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));
create policy quiz_teacher on quiz_attempts for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));
create policy unitc_teacher on unit_completions for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));
create policy coursec_teacher on course_completions for select to authenticated
  using (student_id in (
    select e.student_id from class_enrollments e
    join classes c on c.id=e.class_id
    where (c.teacher_id=auth.uid() or is_owner()) and c.org_id in (select my_org_ids())));

-- adjustments & audit: org-scoped read for active teachers; owner sees all org audit
create policy adjustments_read on teacher_adjustments for select to authenticated
  using (is_active_teacher() and org_id in (select my_org_ids()));
create policy audit_read on audit_logs for select to authenticated
  using (is_active_teacher() and org_id in (select my_org_ids()));

-- student_sessions / login_attempts / app_secrets: NO policies -> no client access.
-- (SECURITY DEFINER functions bypass RLS internally.)

-- ============================================================
-- EXPLICIT GRANTS
-- Needed because the project is created with "Automatically expose
-- new tables" turned OFF (recommended). RLS above still filters rows;
-- these grants only allow the roles to run the queries at all.
-- Teachers (authenticated) read; ALL writes go through RPCs.
-- Students (anon) get no table access whatsoever.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on
  organizations, organization_members, license_status,
  approved_teachers, teacher_profiles,
  courses, curriculum_units, curriculum_items,
  classes, class_courses, students, class_enrollments, course_enrollments,
  learning_progress, lbd_attempts, quiz_attempts,
  unit_completions, course_completions,
  teacher_adjustments, audit_logs
to authenticated;
grant update on teacher_profiles to authenticated;  -- own row only (RLS policy)
revoke all on student_sessions, login_attempts, app_secrets from anon, authenticated;
