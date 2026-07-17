# Tracking Coverage Report — Practical Music Theory (2026-07-17)

## Summary

| Metric | Value |
|---|---|
| Active instructional pages | **107 / 107 tracked** |
| Required Learn-by-Doing activities | **732** (every page has ≥ 1; min 2, max 12 per page) |
| Pages with a Final Quiz | **107 / 107** (harness enforces 8–25 questions each) |
| Pages needing a documented tracking exception | **0** |
| Games / welcome hooks / vocabulary / audio / practice | present on pages, **never tracked** (by design) |

Source of truth: `js/curriculum.js` (generated from `js/lessons-data.js` + `content/lesson-NN.js`).
Verified by `tests/lms-tests.js` (24 assertions, all passing) — including that `games.js`
and `quiz.js` contain no tracking calls and the welcome hook is excluded by the `fbN` id filter.

## How each area is tracked

- **Learn by Doing** — every lesson step whose `try` interaction reports a first
  correct answer through `template.js fb("fbN", true)` sends one
  `record_lbd(item, "sN")` event. The server accepts only activity ids listed in
  `curriculum_items.lbd_ids`, so nothing else can ever count.
- **Final Quiz** — `Quiz.mount onDone(score,total)` sends `record_quiz` on every
  submission (any score). Best score preserved server-side; recent score shown separately.
- **Completion** — server-side only (`_recompute`): Completed = all required LBD
  ids present AND ≥ 1 quiz submission. First page/unit/course completion dates
  are preserved forever (ON CONFLICT DO NOTHING / COALESCE guards).

## Known security limitation (interim, documented)

Grading happens in client-side JavaScript (the answer keys ship with the lesson
content — that is how the site has always worked, and it works offline). Consequences:

- The server validates *shape* (known activity ids, score clamped to 0..possible,
  UUID dedupe, session ownership) but cannot re-grade answers.
- A technically skilled student could call the RPC with a fabricated score from
  their own session. They can NOT touch any other student's data, roster, or dates.

**Migration plan if server-side grading is ever needed:**
1. Move quiz answer keys out of `content/lesson-NN.js` into a private
   `quiz_answers` table (item_id, question_hash, answer).
2. Change `record_quiz` to accept the student's raw answers and grade in SQL.
3. Generated questions (`gen:` items) would need seeded generation so the server
   can reproduce them — largest piece of work (~all 107 quizzes reviewed).
This is not required for the current classroom use case.

## Pages still using client-side validation

All 107 (see above — uniform by design; no per-page exceptions).
