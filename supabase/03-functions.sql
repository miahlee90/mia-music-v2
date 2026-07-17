-- ============================================================
-- Music Fundamentals LMS — 03: RPC functions (paste AFTER 01 and 02)
-- All student traffic and all writes flow through these
-- SECURITY DEFINER functions. The frontend only ever holds the
-- project URL + publishable (anon) key.
-- ============================================================

-- ---------- internals ----------
create or replace function _hmac_key() returns text
language sql stable security definer set search_path=public,extensions as
$$ select v from app_secrets where k='access_hmac_key' $$;

create or replace function _gen_code(len int) returns text
language plpgsql volatile security definer set search_path=public,extensions as $$
declare a text:='ABCDEFGHJKMNPQRSTUVWXYZ23456789'; r text:=''; i int;
begin
  for i in 1..len loop
    r:=r||substr(a, 1+floor(random()*length(a))::int, 1);
  end loop;
  return r;
end $$;

create or replace function _session_student(p_token text) returns uuid
language plpgsql volatile security definer set search_path=public,extensions as $$
declare sid uuid;
begin
  update student_sessions
     set last_seen=now(), expires_at=greatest(expires_at, now()+interval '180 days')
   where token_hash=encode(digest(p_token,'sha256'),'hex') and expires_at>now()
   returning student_id into sid;
  if sid is null then raise exception 'invalid_session'; end if;
  return sid;
end $$;

create or replace function _audit(p_org uuid, p_actor text, p_action text, p_details jsonb)
returns void language sql volatile security definer set search_path=public,extensions as
$$ insert into audit_logs(org_id,actor_email,action,details) values (p_org,p_actor,p_action,p_details) $$;

-- recompute one page's status/completions after any academic event
create or replace function _recompute(p_student uuid, p_course text, p_item int)
returns void language plpgsql volatile security definer set search_path=public,extensions as $$
declare req jsonb; has_q boolean; u int;
        done_ids jsonb; qa int; complete boolean; all_done boolean;
begin
  select lbd_ids, has_quiz, unit into req, has_q, u
    from curriculum_items where course_id=p_course and item_id=p_item and status='active';
  if req is null then return; end if;

  select lbd_done_ids, quiz_attempts into done_ids, qa
    from learning_progress where student_id=p_student and course_id=p_course and item_id=p_item;
  if done_ids is null then return; end if;

  complete := (select coalesce(bool_and(done_ids ? x),true) from jsonb_array_elements_text(req) t(x))
              and (not has_q or qa>=1);

  update learning_progress set
    status = case when complete then 'completed'
                  when jsonb_array_length(done_ids)>0 or qa>0 then 'in_progress'
                  else 'not_started' end,
    page_completed_at = case when complete then coalesce(page_completed_at, now()) else page_completed_at end,
    updated_at=now()
  where student_id=p_student and course_id=p_course and item_id=p_item;

  if complete then
    -- unit completion (original date preserved by ON CONFLICT DO NOTHING)
    select bool_and(lp.status='completed') into all_done
      from curriculum_items ci
      left join learning_progress lp
        on lp.student_id=p_student and lp.course_id=p_course and lp.item_id=ci.item_id
      where ci.course_id=p_course and ci.unit=u and ci.status='active';
    if all_done then
      insert into unit_completions(student_id,course_id,unit) values (p_student,p_course,u)
        on conflict do nothing;
    end if;
    -- course completion
    select bool_and(lp.status='completed') into all_done
      from curriculum_items ci
      left join learning_progress lp
        on lp.student_id=p_student and lp.course_id=p_course and lp.item_id=ci.item_id
      where ci.course_id=p_course and ci.status='active';
    if all_done then
      insert into course_completions(student_id,course_id) values (p_student,p_course)
        on conflict do nothing;
    end if;
  end if;
end $$;

-- ============================================================
-- STUDENT RPCs (called with the anon key)
-- ============================================================

-- Login with Class Code + Access Code. Rate limited per class code.
create or replace function student_login(p_class_code text, p_access_code text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare fails int; s record; cls record; tok text; code text;
begin
  code := upper(regexp_replace(coalesce(p_access_code,''),'[^0-9A-Za-z]','','g'));
  select count(*) into fails from login_attempts
    where class_code=upper(p_class_code) and ok=false and at>now()-interval '15 minutes';
  if fails>=8 then
    return jsonb_build_object('ok',false,'error','locked',
      'message','Too many attempts. Please wait 15 minutes and try again.');
  end if;

  select c.* into cls from classes c
    where c.class_code=upper(p_class_code) and c.archived=false;
  if cls is null then
    insert into login_attempts(class_code,ok) values (upper(p_class_code),false);
    return jsonb_build_object('ok',false,'error','bad_login',
      'message','Class code or access code is incorrect.');
  end if;

  select st.* into s from students st
    join class_enrollments e on e.student_id=st.id and e.class_id=cls.id and e.archived=false
    where st.archived=false
      and st.access_lookup=encode(hmac(code,_hmac_key(),'sha256'),'hex')
      and st.access_hash=crypt(code, st.access_hash);
  if s is null then
    insert into login_attempts(class_code,ok) values (upper(p_class_code),false);
    return jsonb_build_object('ok',false,'error','bad_login',
      'message','Class code or access code is incorrect.');
  end if;

  insert into login_attempts(class_code,ok) values (upper(p_class_code),true);
  tok := encode(gen_random_bytes(24),'hex');
  insert into student_sessions(token_hash,student_id)
    values (encode(digest(tok,'sha256'),'hex'), s.id);
  return jsonb_build_object('ok',true,'token',tok,
    'student',jsonb_build_object('id',s.id,'name',s.display_name,
      'class',cls.name,'classCode',cls.class_code));
end $$;

create or replace function student_logout(p_token text) returns void
language sql volatile security definer set search_path=public,extensions as
$$ delete from student_sessions where token_hash=encode(digest(p_token,'sha256'),'hex') $$;

-- Full progress pull (dashboard + resume-on-new-device)
create or replace function student_progress(p_token text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare sid uuid;
begin
  sid := _session_student(p_token);
  return jsonb_build_object('ok',true,
    'student',(select jsonb_build_object('id',s.id,'name',s.display_name) from students s where s.id=sid),
    'classes',(select coalesce(jsonb_agg(jsonb_build_object('name',c.name,'code',c.class_code)),'[]'::jsonb)
       from class_enrollments e join classes c on c.id=e.class_id
       where e.student_id=sid and e.archived=false and c.archived=false),
    'courses',(select coalesce(jsonb_agg(ce.course_id),'[]'::jsonb) from course_enrollments ce where ce.student_id=sid),
    'progress',(select coalesce(jsonb_agg(jsonb_build_object(
        'course',lp.course_id,'item',lp.item_id,'status',lp.status,
        'lbdDone',lp.lbd_done_ids,'lbdAttempts',lp.lbd_attempts,'lbdLastAt',lp.lbd_last_at,
        'quizAttempts',lp.quiz_attempts,'quizLastAt',lp.quiz_last_at,
        'quizRecent',case when lp.quiz_recent_possible>0 then jsonb_build_object('earned',lp.quiz_recent_earned,'possible',lp.quiz_recent_possible) end,
        'quizBest',case when lp.quiz_best_possible>0 then jsonb_build_object('earned',lp.quiz_best_earned,'possible',lp.quiz_best_possible) end,
        'firstStartedAt',lp.first_started_at,'lastActiveAt',lp.last_active_at,
        'completedAt',lp.page_completed_at)),'[]'::jsonb)
      from learning_progress lp where lp.student_id=sid),
    'unitCompletions',(select coalesce(jsonb_agg(jsonb_build_object('course',uc.course_id,'unit',uc.unit,'at',uc.completed_at)),'[]'::jsonb)
      from unit_completions uc where uc.student_id=sid),
    'courseCompletions',(select coalesce(jsonb_agg(jsonb_build_object('course',cc.course_id,'at',cc.completed_at)),'[]'::jsonb)
      from course_completions cc where cc.student_id=sid));
end $$;

-- Learn-by-Doing activity completed (first correct answer of a required activity)
create or replace function record_lbd(p_token text, p_id uuid, p_course text, p_item int,
                                      p_activity text, p_client_ts timestamptz)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare sid uuid; inserted boolean;
begin
  sid := _session_student(p_token);
  if not exists(select 1 from course_enrollments where student_id=sid and course_id=p_course) then
    return jsonb_build_object('ok',false,'error','not_enrolled');
  end if;
  if not exists(select 1 from curriculum_items
      where course_id=p_course and item_id=p_item and status='active' and lbd_ids ? p_activity) then
    return jsonb_build_object('ok',false,'error','unknown_activity');
  end if;

  insert into lbd_attempts(id,student_id,course_id,item_id,activity_id,client_ts)
    values (p_id,sid,p_course,p_item,p_activity,p_client_ts)
    on conflict (id) do nothing;
  inserted := found;
  if inserted then
    insert into learning_progress(student_id,course_id,item_id,lbd_done_ids,lbd_attempts,
        lbd_last_at,first_started_at,last_active_at)
      values (sid,p_course,p_item,jsonb_build_array(p_activity),1,
        coalesce(p_client_ts,now()),coalesce(p_client_ts,now()),now())
      on conflict (student_id,course_id,item_id) do update set
        lbd_done_ids = case when learning_progress.lbd_done_ids ? p_activity
                            then learning_progress.lbd_done_ids
                            else learning_progress.lbd_done_ids || to_jsonb(p_activity) end,
        lbd_attempts = learning_progress.lbd_attempts+1,
        lbd_last_at  = greatest(coalesce(learning_progress.lbd_last_at,'-infinity'),coalesce(p_client_ts,now())),
        first_started_at = coalesce(learning_progress.first_started_at, coalesce(p_client_ts,now())),
        last_active_at = now(),
        updated_at = now();
    perform _recompute(sid,p_course,p_item);
  end if;
  return jsonb_build_object('ok',true,'new',inserted);
end $$;

-- Final Quiz submitted
create or replace function record_quiz(p_token text, p_id uuid, p_course text, p_item int,
                                       p_earned int, p_possible int, p_client_ts timestamptz)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare sid uuid; inserted boolean; e int; p int;
begin
  sid := _session_student(p_token);
  if not exists(select 1 from course_enrollments where student_id=sid and course_id=p_course) then
    return jsonb_build_object('ok',false,'error','not_enrolled');
  end if;
  if not exists(select 1 from curriculum_items
      where course_id=p_course and item_id=p_item and status='active' and has_quiz) then
    return jsonb_build_object('ok',false,'error','unknown_item');
  end if;
  p := greatest(1, least(coalesce(p_possible,0), 500));
  e := greatest(0, least(coalesce(p_earned,0), p));

  insert into quiz_attempts(id,student_id,course_id,item_id,earned,possible,client_ts)
    values (p_id,sid,p_course,p_item,e,p,p_client_ts)
    on conflict (id) do nothing;
  inserted := found;
  if inserted then
    insert into learning_progress(student_id,course_id,item_id,quiz_attempts,quiz_last_at,
        quiz_recent_earned,quiz_recent_possible,quiz_best_earned,quiz_best_possible,
        first_started_at,last_active_at)
      values (sid,p_course,p_item,1,coalesce(p_client_ts,now()),e,p,e,p,
        coalesce(p_client_ts,now()),now())
      on conflict (student_id,course_id,item_id) do update set
        quiz_attempts=learning_progress.quiz_attempts+1,
        quiz_last_at=greatest(coalesce(learning_progress.quiz_last_at,'-infinity'),coalesce(p_client_ts,now())),
        quiz_recent_earned=e, quiz_recent_possible=p,
        -- keep the BEST percentage; a later lower score never replaces it
        quiz_best_earned=case when learning_progress.quiz_best_possible is null
              or (e::numeric/p) > (learning_progress.quiz_best_earned::numeric/learning_progress.quiz_best_possible)
            then e else learning_progress.quiz_best_earned end,
        quiz_best_possible=case when learning_progress.quiz_best_possible is null
              or (e::numeric/p) > (learning_progress.quiz_best_earned::numeric/learning_progress.quiz_best_possible)
            then p else learning_progress.quiz_best_possible end,
        first_started_at=coalesce(learning_progress.first_started_at,coalesce(p_client_ts,now())),
        last_active_at=now(), updated_at=now();
    perform _recompute(sid,p_course,p_item);
  end if;
  return jsonb_build_object('ok',true,'new',inserted);
end $$;

grant execute on function student_login(text,text) to anon;
grant execute on function student_logout(text) to anon;
grant execute on function student_progress(text) to anon;
grant execute on function record_lbd(text,uuid,text,int,text,timestamptz) to anon;
grant execute on function record_quiz(text,uuid,text,int,int,int,timestamptz) to anon;

-- ============================================================
-- OWNER / TEACHER RPCs (require a signed-in auth user)
-- ============================================================

-- One-time bootstrap: the FIRST signed-in user claims ownership.
create or replace function bootstrap_owner(p_org_name text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare oid uuid;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if exists(select 1 from organization_members) then
    return jsonb_build_object('ok',false,'error','already_bootstrapped');
  end if;
  insert into organizations(name) values (coalesce(p_org_name,'My Studio')) returning id into oid;
  insert into organization_members(org_id,user_id,role) values (oid,auth.uid(),'owner');
  insert into license_status(org_id) values (oid);
  insert into approved_teachers(org_id,email,status,accepted_at,acted_by)
    values (oid,lower(auth.jwt()->>'email'),'accepted',now(),lower(auth.jwt()->>'email'));
  insert into teacher_profiles(user_id,org_id,display_name)
    values (auth.uid(),oid,split_part(auth.jwt()->>'email','@',1))
    on conflict (user_id) do nothing;
  perform _audit(oid,auth.jwt()->>'email','bootstrap_owner',jsonb_build_object('org',p_org_name));
  return jsonb_build_object('ok',true,'orgId',oid);
end $$;

-- Owner: manage the teacher allowlist
create or replace function owner_set_teacher(p_email text, p_status text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare oid uuid;
begin
  if not is_owner() then raise exception 'not_owner'; end if;
  select org_id into oid from organization_members where user_id=auth.uid() and role='owner' limit 1;
  if p_status not in ('pending','revoked','accepted') then raise exception 'bad_status'; end if;
  insert into approved_teachers(org_id,email,status,acted_by,
      accepted_at,revoked_at)
    values (oid,lower(p_email),p_status,lower(auth.jwt()->>'email'),
      case when p_status='accepted' then now() end,
      case when p_status='revoked' then now() end)
    on conflict (org_id,email) do update set
      status=excluded.status,
      acted_by=excluded.acted_by,
      invited_at=case when excluded.status='pending' then now() else approved_teachers.invited_at end,
      accepted_at=case when excluded.status='accepted' then coalesce(approved_teachers.accepted_at,now())
                       when excluded.status='pending' then null else approved_teachers.accepted_at end,
      revoked_at=case when excluded.status='revoked' then now() else null end;
  perform _audit(oid,auth.jwt()->>'email','teacher_'||p_status,jsonb_build_object('email',lower(p_email)));
  return jsonb_build_object('ok',true);
end $$;

-- Teacher first-login handshake: pending -> accepted, create profile
create or replace function teacher_hello()
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare a record;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into a from approved_teachers
    where lower(email)=lower(auth.jwt()->>'email') and status in ('pending','accepted')
    order by (status='accepted') desc limit 1;
  if a is null then
    return jsonb_build_object('ok',false,'error','not_approved',
      'message','This email is not authorized. Please contact the course administrator.');
  end if;
  if a.status='pending' then
    update approved_teachers set status='accepted', accepted_at=now() where id=a.id;
    perform _audit(a.org_id,auth.jwt()->>'email','teacher_accepted_invite',null);
  end if;
  insert into teacher_profiles(user_id,org_id,display_name)
    values (auth.uid(),a.org_id,split_part(auth.jwt()->>'email','@',1))
    on conflict (user_id) do nothing;
  return jsonb_build_object('ok',true,'orgId',a.org_id,'owner',is_owner());
end $$;

-- Teacher: create a class (auto-enrolls it in the given course)
create or replace function create_class(p_name text, p_course text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare oid uuid; cid uuid; code text;
begin
  if not is_active_teacher() then raise exception 'not_teacher'; end if;
  select org_id into oid from teacher_profiles where user_id=auth.uid();
  loop
    code := _gen_code(6);
    exit when not exists(select 1 from classes where class_code=code);
  end loop;
  insert into classes(org_id,teacher_id,name,class_code) values (oid,auth.uid(),p_name,code)
    returning id into cid;
  insert into class_courses(class_id,course_id) values (cid,coalesce(p_course,'practical-music-theory'));
  perform _audit(oid,auth.jwt()->>'email','create_class',jsonb_build_object('class',p_name,'code',code));
  return jsonb_build_object('ok',true,'classId',cid,'classCode',code);
end $$;

create or replace function set_class_archived(p_class uuid, p_archived boolean)
returns void language plpgsql volatile security definer set search_path=public,extensions as $$
begin
  if not exists(select 1 from classes where id=p_class and (teacher_id=auth.uid() or is_owner())) then
    raise exception 'not_your_class'; end if;
  update classes set archived=p_archived where id=p_class;
  perform _audit((select org_id from classes where id=p_class),auth.jwt()->>'email',
    case when p_archived then 'archive_class' else 'restore_class' end, jsonb_build_object('class',p_class));
end $$;

-- Teacher: add a student. Returns the RAW access code exactly once — print it now.
create or replace function add_student(p_class uuid, p_name text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare cls record; sid uuid; code text;
begin
  select * into cls from classes where id=p_class and (teacher_id=auth.uid() or is_owner());
  if cls is null then raise exception 'not_your_class'; end if;
  code := _gen_code(4)||'-'||_gen_code(4);
  insert into students(org_id,display_name,access_lookup,access_hash)
    values (cls.org_id, p_name,
      encode(hmac(replace(code,'-',''),_hmac_key(),'sha256'),'hex'),
      crypt(replace(code,'-',''), gen_salt('bf')))
    returning id into sid;
  insert into class_enrollments(class_id,student_id) values (p_class,sid);
  insert into course_enrollments(student_id,course_id)
    select sid, course_id from class_courses where class_id=p_class
    on conflict do nothing;
  perform _audit(cls.org_id,auth.jwt()->>'email','add_student',jsonb_build_object('student',sid,'name',p_name));
  return jsonb_build_object('ok',true,'studentId',sid,'accessCode',code,'classCode',cls.class_code);
end $$;

-- Teacher: reset a student's access code (returns the new RAW code once)
create or replace function reset_access_code(p_student uuid)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare ok boolean; code text; oid uuid;
begin
  select exists(select 1 from class_enrollments e join classes c on c.id=e.class_id
    where e.student_id=p_student and (c.teacher_id=auth.uid() or is_owner())) into ok;
  if not ok then raise exception 'not_your_student'; end if;
  code := _gen_code(4)||'-'||_gen_code(4);
  update students set
    access_lookup=encode(hmac(replace(code,'-',''),_hmac_key(),'sha256'),'hex'),
    access_hash=crypt(replace(code,'-',''), gen_salt('bf')),
    code_reset_at=now()
    where id=p_student returning org_id into oid;
  delete from student_sessions where student_id=p_student;
  perform _audit(oid,auth.jwt()->>'email','reset_access_code',jsonb_build_object('student',p_student));
  return jsonb_build_object('ok',true,'accessCode',code);
end $$;

create or replace function set_student_archived(p_student uuid, p_archived boolean)
returns void language plpgsql volatile security definer set search_path=public,extensions as $$
declare ok boolean;
begin
  select exists(select 1 from class_enrollments e join classes c on c.id=e.class_id
    where e.student_id=p_student and (c.teacher_id=auth.uid() or is_owner())) into ok;
  if not ok then raise exception 'not_your_student'; end if;
  update students set archived=p_archived where id=p_student;
  perform _audit((select org_id from students where id=p_student),auth.jwt()->>'email',
    case when p_archived then 'archive_student' else 'restore_student' end,
    jsonb_build_object('student',p_student));
end $$;

create or replace function move_student(p_student uuid, p_from uuid, p_to uuid)
returns void language plpgsql volatile security definer set search_path=public,extensions as $$
begin
  if not exists(select 1 from classes where id=p_from and (teacher_id=auth.uid() or is_owner()))
   or not exists(select 1 from classes where id=p_to   and (teacher_id=auth.uid() or is_owner())) then
    raise exception 'not_your_class'; end if;
  update class_enrollments set archived=true where class_id=p_from and student_id=p_student;
  insert into class_enrollments(class_id,student_id) values (p_to,p_student)
    on conflict (class_id,student_id) do update set archived=false;
  insert into course_enrollments(student_id,course_id)
    select p_student, course_id from class_courses where class_id=p_to on conflict do nothing;
  perform _audit((select org_id from classes where id=p_to),auth.jwt()->>'email','move_student',
    jsonb_build_object('student',p_student,'from',p_from,'to',p_to));
end $$;

create or replace function enroll_student_course(p_student uuid, p_course text)
returns void language plpgsql volatile security definer set search_path=public,extensions as $$
declare ok boolean;
begin
  select exists(select 1 from class_enrollments e join classes c on c.id=e.class_id
    where e.student_id=p_student and (c.teacher_id=auth.uid() or is_owner())) into ok;
  if not ok then raise exception 'not_your_student'; end if;
  insert into course_enrollments(student_id,course_id) values (p_student,p_course)
    on conflict do nothing;
end $$;

-- Teacher: formal completion reset (prior completion preserved in audit log)
create or replace function reset_page_completion(p_student uuid, p_course text, p_item int, p_reason text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare ok boolean; oid uuid; prev record; u int;
begin
  if coalesce(trim(p_reason),'')='' then raise exception 'reason_required'; end if;
  select exists(select 1 from class_enrollments e join classes c on c.id=e.class_id
    where e.student_id=p_student and (c.teacher_id=auth.uid() or is_owner())) into ok;
  if not ok then raise exception 'not_your_student'; end if;
  select org_id into oid from students where id=p_student;
  select * into prev from learning_progress
    where student_id=p_student and course_id=p_course and item_id=p_item;
  if prev is null then return jsonb_build_object('ok',false,'error','no_progress'); end if;

  insert into teacher_adjustments(org_id,actor_email,student_id,course_id,item_id,action,reason)
    values (oid,auth.jwt()->>'email',p_student,p_course,p_item,'reset_page_completion',p_reason);
  perform _audit(oid,auth.jwt()->>'email','reset_page_completion',
    jsonb_build_object('student',p_student,'item',p_item,'reason',p_reason,
      'previous',jsonb_build_object('status',prev.status,'completedAt',prev.page_completed_at,
        'lbdDone',prev.lbd_done_ids,'quizBest',prev.quiz_best_earned,'quizBestPossible',prev.quiz_best_possible)));

  update learning_progress set
    lbd_done_ids='[]'::jsonb, status='not_started', page_completed_at=null, updated_at=now()
    where student_id=p_student and course_id=p_course and item_id=p_item;

  select unit into u from curriculum_items where course_id=p_course and item_id=p_item;
  delete from unit_completions where student_id=p_student and course_id=p_course and unit=u;
  delete from course_completions where student_id=p_student and course_id=p_course;
  return jsonb_build_object('ok',true);
end $$;

-- Teacher dashboard: per-class matrix aggregated by unit
create or replace function class_matrix(p_class uuid)
returns jsonb language plpgsql stable security definer set search_path=public,extensions as $$
declare res jsonb;
begin
  if not exists(select 1 from classes where id=p_class and (teacher_id=auth.uid() or is_owner())) then
    raise exception 'not_your_class'; end if;
  select jsonb_build_object('ok',true,
    'class',(select jsonb_build_object('id',c.id,'name',c.name,'code',c.class_code) from classes c where c.id=p_class),
    'students',(select coalesce(jsonb_agg(t.r order by t.r->>'name'),'[]'::jsonb) from (
      select jsonb_build_object('id',s.id,'name',s.display_name,'archived',s.archived,
        'lastActive',(select max(lp.last_active_at) from learning_progress lp where lp.student_id=s.id),
        'completedPages',(select count(*) from learning_progress lp where lp.student_id=s.id and lp.status='completed'),
        'courseCompletedAt',(select min(cc.completed_at) from course_completions cc where cc.student_id=s.id),
        'units',(select coalesce(jsonb_object_agg(u.unit,u.obj),'{}'::jsonb) from (
            select ci.unit,
              jsonb_build_object(
                'done',count(*) filter (where lp.status='completed'),
                'total',count(*),
                'unitCompletedAt',min(uc.completed_at)) as obj
            from curriculum_items ci
            left join learning_progress lp on lp.student_id=s.id and lp.course_id=ci.course_id and lp.item_id=ci.item_id
            left join unit_completions uc on uc.student_id=s.id and uc.course_id=ci.course_id and uc.unit=ci.unit
            where ci.course_id='practical-music-theory' and ci.status='active'
            group by ci.unit) u)) as r
      from students s
      join class_enrollments e on e.student_id=s.id and e.class_id=p_class and e.archived=false
    ) t)) into res;
  return res;
end $$;

-- page-level drill-down for one student (teacher view)
create or replace function student_report(p_student uuid)
returns jsonb language plpgsql stable security definer set search_path=public,extensions as $$
declare ok boolean;
begin
  select exists(select 1 from class_enrollments e join classes c on c.id=e.class_id
    where e.student_id=p_student and (c.teacher_id=auth.uid() or is_owner())) into ok;
  if not ok then raise exception 'not_your_student'; end if;
  return jsonb_build_object('ok',true,
    'student',(select jsonb_build_object('id',s.id,'name',s.display_name,'archived',s.archived) from students s where s.id=p_student),
    'progress',(select coalesce(jsonb_agg(jsonb_build_object(
        'course',lp.course_id,'item',lp.item_id,'status',lp.status,
        'lbdDone',lp.lbd_done_ids,'lbdAttempts',lp.lbd_attempts,'lbdLastAt',lp.lbd_last_at,
        'quizAttempts',lp.quiz_attempts,'quizLastAt',lp.quiz_last_at,
        'quizRecent',case when lp.quiz_recent_possible>0 then jsonb_build_object('earned',lp.quiz_recent_earned,'possible',lp.quiz_recent_possible) end,
        'quizBest',case when lp.quiz_best_possible>0 then jsonb_build_object('earned',lp.quiz_best_earned,'possible',lp.quiz_best_possible) end,
        'firstStartedAt',lp.first_started_at,'lastActiveAt',lp.last_active_at,
        'completedAt',lp.page_completed_at) order by lp.item_id),'[]'::jsonb)
      from learning_progress lp where lp.student_id=p_student),
    'unitCompletions',(select coalesce(jsonb_agg(jsonb_build_object('unit',uc.unit,'at',uc.completed_at)),'[]'::jsonb)
      from unit_completions uc where uc.student_id=p_student),
    'courseCompletions',(select coalesce(jsonb_agg(jsonb_build_object('course',cc.course_id,'at',cc.completed_at)),'[]'::jsonb)
      from course_completions cc where cc.student_id=p_student));
end $$;

grant execute on function bootstrap_owner(text) to authenticated;
grant execute on function owner_set_teacher(text,text) to authenticated;
grant execute on function teacher_hello() to authenticated;
grant execute on function create_class(text,text) to authenticated;
grant execute on function set_class_archived(uuid,boolean) to authenticated;
grant execute on function add_student(uuid,text) to authenticated;
grant execute on function reset_access_code(uuid) to authenticated;
grant execute on function set_student_archived(uuid,boolean) to authenticated;
grant execute on function move_student(uuid,uuid,uuid) to authenticated;
grant execute on function enroll_student_course(uuid,text) to authenticated;
grant execute on function reset_page_completion(uuid,text,int,text) to authenticated;
grant execute on function class_matrix(uuid) to authenticated;
grant execute on function student_report(uuid) to authenticated;
