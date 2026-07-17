-- ============================================================
-- Music Fundamentals LMS — 05: server-side tests
-- Paste AFTER 01-03. Run:   select run_lms_tests();
-- Creates temporary fixtures inside a transaction-like flow and
-- cleans them up. Returns a jsonb list of PASS/FAIL lines.
-- Also includes RLS smoke checks that switch to the anon role.
-- ============================================================
create or replace function _chk(name text, cond boolean) returns jsonb
language sql immutable as
$$ select jsonb_build_object('test',name,'result',case when cond then 'PASS' else 'FAIL' end) $$;

create or replace function run_lms_tests()
returns jsonb language plpgsql volatile security definer set search_path=public as $$
declare out jsonb:='[]'::jsonb; oid uuid; cid uuid; sid uuid; tok text; r jsonb;
        code text; item1 int; act1 text; act2 text; nreq int; d1 timestamptz; d2 timestamptz;
        cnt int; uid uuid;
begin
  -- fixtures ---------------------------------------------------------------
  insert into organizations(name) values ('__test_org') returning id into oid;
  select coalesce(auth.uid(),'00000000-0000-0000-0000-000000000000'::uuid) into uid;
  insert into classes(org_id,teacher_id,name,class_code)
    values (oid,coalesce(auth.uid(),(select id from auth.users limit 1)),'__test_class','ZZTEST') returning id into cid;
  insert into class_courses(class_id,course_id) values (cid,'practical-music-theory');
  code:='TESTKODE';
  insert into students(org_id,display_name,access_lookup,access_hash)
    values (oid,'__test_student',encode(hmac(code,_hmac_key(),'sha256'),'hex'),crypt(code,gen_salt('bf')))
    returning id into sid;
  insert into class_enrollments(class_id,student_id) values (cid,sid);
  insert into course_enrollments(student_id,course_id) values (sid,'practical-music-theory');

  -- pick a real curriculum item with >=2 activities
  select item_id, lbd_ids->>0, lbd_ids->>1, lbd_count into item1, act1, act2, nreq
    from curriculum_items where course_id='practical-music-theory' and lbd_count>=2
    order by item_id limit 1;

  -- login ------------------------------------------------------------------
  r:=student_login('ZZTEST', code);
  out:=out||_chk('student_login succeeds with correct codes', (r->>'ok')::boolean);
  tok:=r->>'token';
  r:=student_login('ZZTEST','WRONGCODE');
  out:=out||_chk('student_login rejects a wrong code', not (r->>'ok')::boolean);
  out:=out||_chk('failed login does not reveal whether the student exists',
      r->>'message'='Class code or access code is incorrect.');

  -- rate limiting ----------------------------------------------------------
  for cnt in 1..8 loop perform student_login('ZZTEST','WRONGCODE'); end loop;
  r:=student_login('ZZTEST', code);
  out:=out||_chk('9+ failures lock the class code temporarily', r->>'error'='locked');
  delete from login_attempts where class_code='ZZTEST';

  -- LBD recording + dedupe ---------------------------------------------------
  r:=record_lbd(tok,'11111111-1111-4111-8111-111111111111','practical-music-theory',item1,act1,now());
  out:=out||_chk('record_lbd accepts a required activity', (r->>'ok')::boolean and (r->>'new')::boolean);
  r:=record_lbd(tok,'11111111-1111-4111-8111-111111111111','practical-music-theory',item1,act1,now());
  out:=out||_chk('same client UUID is deduplicated', (r->>'ok')::boolean and not (r->>'new')::boolean);
  select lbd_attempts into cnt from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('duplicate did not raise the attempt count', cnt=1);
  r:=record_lbd(tok,'11111111-1111-4111-8111-222222222222','practical-music-theory',item1,'not-a-real-activity',now());
  out:=out||_chk('unknown activity id is rejected (games cannot sneak in)', r->>'error'='unknown_activity');
  select status into code from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('one activity + no quiz => in_progress', code='in_progress');

  -- quiz + completion --------------------------------------------------------
  r:=record_quiz(tok,'11111111-1111-4111-8111-333333333333','practical-music-theory',item1,10,20,now());
  out:=out||_chk('record_quiz accepts a submission', (r->>'ok')::boolean);
  select status into code from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('quiz alone does not complete the page (LBD still missing)', code='in_progress');

  -- finish all required activities
  perform record_lbd(tok, gen_random_uuid(),'practical-music-theory',item1,x,now())
    from (select jsonb_array_elements_text(lbd_ids) x from curriculum_items
          where course_id='practical-music-theory' and item_id=item1) t;
  select status, page_completed_at into code, d1
    from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('all LBD + quiz submitted => completed (low score OK: 50%)', code='completed');
  out:=out||_chk('page_completed_at is set', d1 is not null);

  -- best score preservation ---------------------------------------------------
  perform record_quiz(tok, gen_random_uuid(),'practical-music-theory',item1,19,20,now());
  perform record_quiz(tok, gen_random_uuid(),'practical-music-theory',item1,5,20,now());
  select quiz_best_earned into cnt from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('best score survives a later lower score (19/20 kept)', cnt=19);
  select quiz_recent_earned into cnt from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('recent score reflects the last attempt (5/20)', cnt=5);
  select quiz_attempts into cnt from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('quiz attempt count = 3', cnt=3);
  select page_completed_at into d2 from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('page_completed_at unchanged after retakes', d1=d2);

  -- score clamping -------------------------------------------------------------
  perform record_quiz(tok, gen_random_uuid(),'practical-music-theory',item1,9999,20,now());
  select quiz_recent_earned into cnt from learning_progress where student_id=sid and item_id=item1;
  out:=out||_chk('earned is clamped to possible (no 9999/20)', cnt=20);

  -- teacher reset (audited, reason required) ------------------------------------
  begin
    perform reset_page_completion(sid,'practical-music-theory',item1,'');
    out:=out||_chk('reset without a reason is rejected', false);
  exception when others then
    out:=out||_chk('reset without a reason is rejected', true);
  end;

  -- session invalidation ---------------------------------------------------------
  perform student_logout(tok);
  begin
    perform student_progress(tok);
    out:=out||_chk('logged-out token is invalid', false);
  exception when others then
    out:=out||_chk('logged-out token is invalid', true);
  end;

  -- RLS smoke: anon has no direct table access -----------------------------------
  begin
    set local role anon;
    begin
      select count(*) into cnt from students;
      out:=out||_chk('anon cannot read students directly', cnt=0);  -- RLS filters everything
    exception when insufficient_privilege then
      out:=out||_chk('anon cannot read students directly', true);
    end;
    begin
      select count(*) into cnt from learning_progress;
      out:=out||_chk('anon cannot read progress directly', cnt=0);
    exception when insufficient_privilege then
      out:=out||_chk('anon cannot read progress directly', true);
    end;
    begin
      select count(*) into cnt from student_sessions;
      out:=out||_chk('anon cannot read sessions', false);
    exception when insufficient_privilege then
      out:=out||_chk('anon cannot read sessions', true);
    end;
    begin
      select count(*) into cnt from app_secrets;
      out:=out||_chk('anon cannot read app_secrets', false);
    exception when insufficient_privilege then
      out:=out||_chk('anon cannot read app_secrets', true);
    end;
    reset role;
  exception when others then
    reset role;
    out:=out||_chk('RLS role-switch block ran', false);
  end;

  -- cleanup -----------------------------------------------------------------
  delete from lbd_attempts where student_id=sid;
  delete from quiz_attempts where student_id=sid;
  delete from learning_progress where student_id=sid;
  delete from unit_completions where student_id=sid;
  delete from course_completions where student_id=sid;
  delete from student_sessions where student_id=sid;
  delete from login_attempts where class_code='ZZTEST';
  delete from class_enrollments where student_id=sid;
  delete from course_enrollments where student_id=sid;
  delete from students where id=sid;
  delete from class_courses where class_id=cid;
  delete from classes where id=cid;
  delete from license_status where org_id=oid;
  delete from audit_logs where org_id=oid;
  delete from organizations where id=oid;
  return out;
end $$;
grant execute on function run_lms_tests() to authenticated;
