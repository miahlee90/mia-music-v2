-- 07-unified-classes.sql  (run AFTER 01-schema, 02-curriculum-seed, 03-functions,
-- and the piano/aural course seeds)
--
-- UNIFIED LOGIN (instructor 2026-07-20 "로그인하면 모든 랩을 쓰게"): make every new
-- class studio-wide — linked to ALL global lab courses — so a student signs in ONCE
-- (shared session key mms-lms-session, same origin) and their progress records in
-- every lab. add_student() already enrolls a new student in course_enrollments for
-- each course the class is linked to, so studio-wide classes "just work."
--
-- This only changes create_class(); everything else is unchanged. Safe to re-run.

create or replace function create_class(p_name text, p_course text)
returns jsonb language plpgsql volatile security definer set search_path=public,extensions as $$
declare oid uuid; cid uuid; code text; n int;
begin
  if not is_active_teacher() then raise exception 'not_teacher'; end if;
  select org_id into oid from teacher_profiles where user_id=auth.uid();
  loop
    code := _gen_code(6);
    exit when not exists(select 1 from classes where class_code=code);
  end loop;
  insert into classes(org_id,teacher_id,name,class_code) values (oid,auth.uid(),p_name,code)
    returning id into cid;

  -- link this class to EVERY global (shared) lab course, so one student login covers all labs
  insert into class_courses(class_id,course_id)
    select cid, c.id from courses c where c.org_id is null
    on conflict do nothing;
  get diagnostics n = row_count;
  -- fallback: if no global courses are seeded yet, keep the requested one so create never no-ops
  if n = 0 then
    insert into class_courses(class_id,course_id)
      values (cid, coalesce(p_course,'practical-music-theory'))
      on conflict do nothing;
  end if;

  perform _audit(oid,auth.jwt()->>'email','create_class',jsonb_build_object('class',p_name,'code',code));
  return jsonb_build_object('ok',true,'classId',cid,'classCode',code);
end $$;

grant execute on function create_class(text,text) to authenticated;
