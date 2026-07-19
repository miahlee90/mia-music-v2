-- ============================================================
-- Game Lab — 06: game_results table + RPCs
-- Paste into the Supabase SQL Editor AFTER 01–03 (any time; independent).
-- SAFETY DESIGN (owner request 2026-07-17: "안전하게 작동"):
--   * Touches NOTHING in the existing LMS: new table + new functions only.
--     Academic tables (learning_progress, *_attempts, …) are never read
--     or written here, so lesson records cannot be affected.
--   * Same security model as the LMS: students act ONLY through
--     SECURITY DEFINER RPCs validated by _session_student(); the table
--     has RLS enabled and NO client grants at all (not even teachers —
--     Game Lab is student-fun only; a teacher read policy can be added
--     later if ever wanted).
--   * Client-generated UUID primary key = safe offline retries (dedupe).
--   * All numbers are clamped server-side; text lengths capped.
-- Re-runnable: every statement is IF NOT EXISTS / OR REPLACE.
-- ============================================================

create table if not exists game_results(
  id uuid primary key,                       -- client-generated: offline dedupe
  student_id uuid not null references students(id),
  game text not null,                        -- e.g. 'Note Bird' (working title)
  mode text not null,                        -- 'level' | 'practice'
  condition text not null,                   -- human label, e.g. 'C2–C6 · Grand Staff'
  cond_key text not null,                    -- stable key, e.g. 'range:C2-C6@grand'
  level int not null default 0,
  success boolean not null default false,
  notes_read int not null default 0,
  accuracy int not null default 0,
  avg_ms int, fastest_ms int,
  best_streak int not null default 0,
  wrong int not null default 0,
  timeouts int not null default 0,
  hints int not null default 0,
  missed jsonb not null default '[]'::jsonb, -- note ids, e.g. ["G5@treble"]
  client_ts timestamptz,
  server_ts timestamptz not null default now()
);
create index if not exists idx_game_results_s on game_results(student_id, game, cond_key);

alter table game_results enable row level security;
-- no policies, no grants: RPC-only access (SECURITY DEFINER bypasses RLS)
revoke all on game_results from anon, authenticated;

-- ---------- student RPC: save one finished run ----------
create or replace function game_result_save(
  p_token text, p_id uuid, p_game text, p_mode text,
  p_condition text, p_cond_key text,
  p_level int, p_success boolean, p_notes int, p_accuracy int,
  p_avg_ms int, p_fastest_ms int, p_best_streak int,
  p_wrong int, p_timeouts int, p_hints int,
  p_missed jsonb, p_client_ts timestamptz)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare sid uuid; inserted boolean;
begin
  sid := _session_student(p_token);          -- raises 'invalid_session' if bad
  insert into game_results(id,student_id,game,mode,condition,cond_key,
      level,success,notes_read,accuracy,avg_ms,fastest_ms,best_streak,
      wrong,timeouts,hints,missed,client_ts)
    values (p_id, sid,
      left(coalesce(p_game,'?'),60),
      left(coalesce(p_mode,'?'),20),
      left(coalesce(p_condition,'?'),120),
      left(coalesce(p_cond_key,'?'),120),
      greatest(0,least(coalesce(p_level,0),99)),
      coalesce(p_success,false),
      greatest(0,least(coalesce(p_notes,0),10000)),
      greatest(0,least(coalesce(p_accuracy,0),100)),
      nullif(greatest(0,least(coalesce(p_avg_ms,0),600000)),0),
      nullif(greatest(0,least(coalesce(p_fastest_ms,0),600000)),0),
      greatest(0,least(coalesce(p_best_streak,0),10000)),
      greatest(0,least(coalesce(p_wrong,0),10000)),
      greatest(0,least(coalesce(p_timeouts,0),10000)),
      greatest(0,least(coalesce(p_hints,0),10000)),
      case when jsonb_typeof(coalesce(p_missed,'[]'::jsonb))='array'
           then p_missed else '[]'::jsonb end,
      p_client_ts)
    on conflict (id) do nothing;
  inserted := found;
  return jsonb_build_object('ok',true,'new',inserted);
end $$;

-- ---------- student RPC: my best level per condition (cross-device) ----------
create or replace function game_my_best(p_token text, p_game text)
returns jsonb language plpgsql stable security definer set search_path=public,extensions as $$
declare sid uuid;
begin
  sid := _session_student(p_token);
  return coalesce((
    select jsonb_object_agg(t.cond_key, jsonb_build_object(
      'level',t.best_level,'success',t.any_success,'runs',t.runs,'last',t.last_at))
    from (
      select cond_key,
             max(level) as best_level,
             bool_or(success) as any_success,
             count(*) as runs,
             max(coalesce(client_ts,server_ts)) as last_at
      from game_results
      where student_id=sid and game=left(coalesce(p_game,'?'),60)
      group by cond_key
    ) t), '{}'::jsonb);
end $$;

grant execute on function game_result_save(text,uuid,text,text,text,text,int,boolean,int,int,int,int,int,int,int,int,jsonb,timestamptz) to anon;
grant execute on function game_my_best(text,text) to anon;
