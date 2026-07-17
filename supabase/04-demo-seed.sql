-- ============================================================
-- Music Fundamentals LMS — 04: OPTIONAL demo data (development only)
-- Paste AFTER 01-03 and after signing in once + running bootstrap_owner.
-- Then run:   select seed_demo_data();
-- Creates 3 classes and 12 fake students with mixed progress and
-- returns their class + access codes so you can try student login.
-- Remove with: select remove_demo_data();
-- ============================================================

create or replace function seed_demo_data()
returns jsonb language plpgsql volatile security definer set search_path=public as $$
declare oid uuid; uid uuid; cids uuid[]:=array[]::uuid[]; ccodes text[]:=array[]::text[];
        names text[]:=array['Ari','Bea','Cody','Dana','Eli','Fay','Gus','Hana','Ian','Jo','Kai','Lia'];
        sid uuid; code text; codes jsonb:='[]'::jsonb; i int; cidx int; cid uuid;
        it record; k int;
begin
  if not is_owner() then raise exception 'not_owner'; end if;
  select org_id,user_id into oid,uid from organization_members where role='owner' limit 1;

  for i in 1..3 loop
    loop code:=_gen_code(6); exit when not exists(select 1 from classes where class_code=code); end loop;
    insert into classes(org_id,teacher_id,name,class_code)
      values (oid,uid,'Demo Class '||i,code) returning id into cid;
    insert into class_courses(class_id,course_id) values (cid,'practical-music-theory');
    cids:=cids||cid; ccodes:=ccodes||code;
  end loop;
  -- archived class example
  loop code:=_gen_code(6); exit when not exists(select 1 from classes where class_code=code); end loop;
  insert into classes(org_id,teacher_id,name,class_code,archived)
    values (oid,uid,'Demo Archived Class',code,true);

  for i in 1..12 loop
    cidx:=1+((i-1)%3); cid:=cids[cidx];
    code:=_gen_code(4)||'-'||_gen_code(4);
    insert into students(org_id,display_name,access_lookup,access_hash,archived)
      values (oid,names[i],
        encode(hmac(replace(code,'-',''),_hmac_key(),'sha256'),'hex'),
        crypt(replace(code,'-',''),gen_salt('bf')),
        i=12)  -- student 12 = archived example
      returning id into sid;
    insert into class_enrollments(class_id,student_id) values (cid,sid);
    insert into course_enrollments(student_id,course_id) values (sid,'practical-music-theory');
    codes:=codes||jsonb_build_object('name',names[i],'class','Demo Class '||cidx,
      'classCode',ccodes[cidx],'accessCode',code,'archived',i=12);

    -- students 1-4: Not Started (nothing recorded)
    -- students 5-8: In Progress on lessons 1-3
    if i between 5 and 8 then
      for it in select * from curriculum_items where course_id='practical-music-theory'
                 and item_id<=i-4 order by item_id loop
        for k in 0..least(1,jsonb_array_length(it.lbd_ids)-1) loop
          insert into lbd_attempts(id,student_id,course_id,item_id,activity_id,client_ts)
            values (gen_random_uuid(),sid,'practical-music-theory',it.item_id,it.lbd_ids->>k,now()-interval '3 days');
          insert into learning_progress(student_id,course_id,item_id,lbd_done_ids,lbd_attempts,lbd_last_at,first_started_at,last_active_at)
            values (sid,'practical-music-theory',it.item_id,jsonb_build_array(it.lbd_ids->>k),1,now()-interval '3 days',now()-interval '3 days',now()-interval '3 days')
            on conflict (student_id,course_id,item_id) do update set
              lbd_done_ids=learning_progress.lbd_done_ids||to_jsonb(it.lbd_ids->>k),
              lbd_attempts=learning_progress.lbd_attempts+1, lbd_last_at=now();
        end loop;
        perform _recompute(sid,'practical-music-theory',it.item_id);
      end loop;
    end if;
    -- students 9-11: complete Unit 1 (all LBD + quiz, mixed scores incl. one low pass)
    if i between 9 and 11 then
      for it in select * from curriculum_items where course_id='practical-music-theory'
                 and unit=1 order by item_id loop
        insert into learning_progress(student_id,course_id,item_id,lbd_done_ids,lbd_attempts,lbd_last_at,
            quiz_attempts,quiz_last_at,quiz_recent_earned,quiz_recent_possible,quiz_best_earned,quiz_best_possible,
            first_started_at,last_active_at)
          values (sid,'practical-music-theory',it.item_id,it.lbd_ids,it.lbd_count,now()-interval '1 day',
            1,now()-interval '1 day',
            case i when 9 then 20 when 10 then 14 else 9 end, 20,
            case i when 9 then 20 when 10 then 14 else 9 end, 20,
            now()-interval '10 days',now()-interval '1 day');
        insert into quiz_attempts(id,student_id,course_id,item_id,earned,possible,client_ts)
          values (gen_random_uuid(),sid,'practical-music-theory',it.item_id,
            case i when 9 then 20 when 10 then 14 else 9 end,20,now()-interval '1 day');
        perform _recompute(sid,'practical-music-theory',it.item_id);
      end loop;
    end if;
  end loop;

  -- student 1 of Demo Class 1 -> upgrade to FULL course completion
  select e.student_id into sid from class_enrollments e
    join students s on s.id=e.student_id
    where e.class_id=cids[1] and s.display_name='Ari';
  for it in select * from curriculum_items where course_id='practical-music-theory' order by item_id loop
    insert into learning_progress(student_id,course_id,item_id,lbd_done_ids,lbd_attempts,lbd_last_at,
        quiz_attempts,quiz_last_at,quiz_recent_earned,quiz_recent_possible,quiz_best_earned,quiz_best_possible,
        first_started_at,last_active_at)
      values (sid,'practical-music-theory',it.item_id,it.lbd_ids,it.lbd_count,now()-interval '2 days',
        1,now()-interval '2 days',18,20,18,20,now()-interval '60 days',now()-interval '2 days')
      on conflict (student_id,course_id,item_id) do update set
        lbd_done_ids=excluded.lbd_done_ids, quiz_attempts=1,
        quiz_recent_earned=18,quiz_recent_possible=20,quiz_best_earned=18,quiz_best_possible=20;
    insert into quiz_attempts(id,student_id,course_id,item_id,earned,possible,client_ts)
      values (gen_random_uuid(),sid,'practical-music-theory',it.item_id,18,20,now()-interval '2 days');
    perform _recompute(sid,'practical-music-theory',it.item_id);
  end loop;

  perform _audit(oid,auth.jwt()->>'email','seed_demo_data',null);
  return jsonb_build_object('ok',true,'logins',codes);
end $$;

create or replace function remove_demo_data()
returns void language plpgsql volatile security definer set search_path=public as $$
declare sids uuid[];
begin
  if not is_owner() then raise exception 'not_owner'; end if;
  select coalesce(array_agg(e.student_id),array[]::uuid[]) into sids
    from class_enrollments e join classes c on c.id=e.class_id
    where c.name like 'Demo %';
  delete from lbd_attempts where student_id=any(sids);
  delete from quiz_attempts where student_id=any(sids);
  delete from learning_progress where student_id=any(sids);
  delete from unit_completions where student_id=any(sids);
  delete from course_completions where student_id=any(sids);
  delete from student_sessions where student_id=any(sids);
  delete from class_enrollments where student_id=any(sids);
  delete from course_enrollments where student_id=any(sids);
  delete from students where id=any(sids);
  delete from class_courses where class_id in (select id from classes where name like 'Demo %');
  delete from classes where name like 'Demo %';
end $$;

grant execute on function seed_demo_data() to authenticated;
grant execute on function remove_demo_data() to authenticated;
