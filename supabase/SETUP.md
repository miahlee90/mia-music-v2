# 학생·교사 관리 시스템 설치 안내서 (비개발자용)

이 문서 하나로 처음부터 끝까지 설정할 수 있습니다. 순서대로 따라 하세요.
**꼭 지켜야 할 순서: ① Supabase 프로젝트 → ② SQL 실행 → ③ 소유자 계정 → ④ config.js → ⑤ 배포**

---

## 1. Supabase 프로젝트 만들기 (약 5분)

1. https://supabase.com 접속 → **Start your project** → GitHub 계정으로 가입/로그인
2. **New project** 클릭
   - Name: `mia-music-lms` (아무 이름이나 OK)
   - Database Password: **강력한 비밀번호를 만들고 안전한 곳에 보관** (다시 쓸 일은 거의 없지만 분실하면 곤란)
   - Region: `Northeast Asia (Seoul)` 권장
   - 무료 플랜(Free)이면 충분합니다
3. 1~2분 후 프로젝트가 생성됩니다

## 2. 키 확인하기

프로젝트 화면 → 왼쪽 **Project Settings(톱니바퀴) → API**:

| 항목 | 어디에 쓰나 | 공개 여부 |
|---|---|---|
| **Project URL** (`https://xxxx.supabase.co`) | js/config.js | 공개돼도 안전 |
| **anon / publishable key** (긴 문자열) | js/config.js | 공개돼도 안전 (RLS가 보호) |
| **service_role key** | ❌ 아무 데도 쓰지 마세요 | **절대 비공개** — 웹사이트/깃허브에 넣으면 안 됨 |
| Database password | ❌ 아무 데도 쓰지 마세요 | **절대 비공개** |

## 3. SQL 실행 (데이터베이스 만들기)

왼쪽 메뉴 **SQL Editor** → **New query** → 아래 파일 내용을 **순서대로** 하나씩 붙여넣고 **Run**:

1. `supabase/01-schema.sql` — 테이블 + 보안 규칙(RLS)
2. `supabase/02-curriculum-seed.sql` — 107개 레슨 커리큘럼
3. `supabase/03-functions.sql` — 서버 기능(로그인, 진도 기록 등)

각각 "Success. No rows returned"가 나오면 정상입니다.

## 4. 이메일 회원가입 잠그기 (중요!)

**Authentication → Sign In / Up → Email** 에서:
- **Allow new users to sign up** 를 **끄세요(OFF)**.
- 이렇게 하면 승인 없이 아무도 교사 계정을 만들 수 없습니다.

## 5. 소유자(선생님 본인) 계정 만들기

1. **Authentication → Users → Add user → Create new user**
   - 본인 이메일 입력, **Auto Confirm User 체크**, 비밀번호는 아무거나(안 씀)
2. 웹사이트의 **owner.html** 페이지 접속 (예: `https://miahlee90.github.io/mia-music-v2/owner.html`)
3. 본인 이메일 입력 → **Send link** → 이메일의 로그인 링크를 **같은 기기에서** 클릭
4. 돌아오면 "First-time setup" 화면이 보입니다 → 스튜디오 이름 입력 → **Claim ownership**
   - ⚠️ 가장 먼저 로그인한 사람이 소유자가 되므로, 이 단계를 미루지 마세요.

## 6. config.js 채우고 배포

1. `js/config.js` 파일을 열어 2번에서 확인한 두 값을 넣습니다:
   ```js
   SUPABASE_URL:"https://xxxx.supabase.co",
   SUPABASE_ANON_KEY:"eyJhbGciOi...(긴 문자열)"
   ```
2. `sw.js` 맨 위 `CACHE="mf-v2-..."` 의 날짜 부분을 오늘 날짜로 바꿉니다 (배포할 때마다)
3. PowerShell에서:
   ```
   cd "D:\1Claude\music fundamental lesson builder\music-fundamentals-v2"
   git add -A
   git commit -m "configure LMS"
   git push
   ```

## 7. (선택) 테스트와 데모 데이터

- SQL Editor에서 `supabase/05-tests.sql` 붙여넣고 Run → 그다음 `select run_lms_tests();` 실행
  → 모든 항목이 "PASS"인지 확인
- 데모 학생으로 미리 체험하려면 `supabase/04-demo-seed.sql` 붙여넣고 Run → `select seed_demo_data();`
  → 결과에 나오는 가짜 학생들의 class/access 코드로 student.html 로그인 체험
  → 끝나면 `select remove_demo_data();` 로 삭제

---

## 일상 사용법

### 다른 선생님 초대 (소유자만)
1. **owner.html** → 이메일 입력 → **Add / Invite** (허용 목록에 추가됨)
2. Supabase → **Authentication → Users → Invite user** → 같은 이메일 입력 (초대 메일 발송)
3. 그 선생님이 메일의 링크로 **teacher.html** 에서 로그인하면 자동으로 "accepted" 상태가 됩니다
- **차단**: owner.html에서 **Revoke** → 즉시 접근 불가 (숨기는 게 아니라 DB에서 차단)
- **재승인**: **Reactivate**

### 반 만들기 / 학생 추가 (teacher.html)
1. **+ New class** → 반 이름 입력 → **Class Code** 6자리가 생성됩니다
2. 반 열기 → **+ Add student** → 학생 별명 입력 (본명·이메일·전화번호 불필요)
3. **접속 카드 창이 딱 한 번 뜹니다 — 그 자리에서 인쇄(🖨)하거나 저장하세요.**
   코드는 암호화 저장되어 다시 볼 수 없습니다. 분실 시 ⋯ 메뉴 → **Reset access code**
4. 여러 명 한꺼번에: **Import names (CSV)** → 이름을 줄바꿈으로 붙여넣기

### 학생 로그인
- 학생은 `student.html` (홈 화면의 **My progress**)에서 **Class Code + Access Code** 입력
- 어떤 기기에서든 같은 코드로 로그인하면 진도가 이어집니다
- 레슨 화면 왼쪽 아래 초록 칩 = 저장 완료 / 주황 칩 = 아직 동기화 안 됨(자동 재시도)

### 진도 계산 규칙 (중요)
| 반영됨 ✅ | 반영 안 됨 ❌ |
|---|---|
| Learn by Doing (단계별 활동) 완료 | 게임 (전부) |
| Final Quiz 제출 (점수 무관) | Welcome 질문, 어휘 카드 |
| | 오디오 재생, 피아노 자유 연주 |
| | 연습(Practice) 문제, 페이지 방문/체류 시간 |

- 페이지 **Completed** = 필수 Learn by Doing 전부 제출 **그리고** Final Quiz 1회 이상 제출
- 점수가 낮아도 Completed가 됩니다 — 낮은 점수는 대시보드에서 보고 재학습 여부를 선생님이 판단
- **최고 점수는 절대 낮은 재시도로 덮이지 않습니다**; 최근 점수는 따로 표시
- 완료 날짜(페이지/유닛/코스)는 **처음 완료된 날짜가 영구 보존**됩니다 (재시험해도 안 바뀜)
- 완료를 공식적으로 리셋하려면: 학생 Report → reset… → **사유 필수 입력** (감사 기록에 남음)

### CSV 내보내기
- 반 전체: 반 화면 → **Export progress CSV**
- 학생 개인: Report → **Export this report (CSV)**

### 문제 해결
- **"This email is not authorized"**: owner.html 허용 목록에 이메일이 없거나 revoked 상태
- **학생 로그인 잠김**: 같은 반 코드로 15분 내 8회 이상 실패 시 15분 잠금 — 기다렸다 재시도
- **주황 "not yet synced" 칩이 계속 남음**: 인터넷 연결 확인; 온라인이 되면 자동 업로드.
  동기화 전에 로그아웃하면 경고가 뜹니다 (그 기기에 남아 다음 로그인 때 업로드됨)
- **사이트 수정 후 반영이 안 됨**: `sw.js`의 CACHE 날짜를 바꿨는지 확인

### 백업 / 복구
- Supabase 무료 플랜: **Database → Backups** 에서 일일 백업 자동 (7일 보관)
- 수동 백업: SQL Editor에서 `Database → Backups → Download` 또는 CSV 내보내기 활용
- 복구는 Backups 화면에서 Restore

---

## 구조 요약 (참고)

- **비밀값이 프런트엔드에 없습니다**: 웹사이트에는 URL + 공개 키만 있고, 모든 민감한 동작(로그인 검증, 점수 기록, 코드 해시)은 데이터베이스 안의 보안 함수(SECURITY DEFINER RPC)가 처리합니다. Edge Function 배포가 필요 없어 SQL 붙여넣기만으로 서버가 완성됩니다.
- **학생 코드는 평문 저장 안 함**: bcrypt 해시 + HMAC 조회키만 저장. 유출돼도 코드 복원 불가.
- **학생은 테이블 직접 접근 불가(RLS)**: 자기 진도도 RPC를 통해서만. 반 명단 열람 불가.
- **교사 격리**: 교사는 자기 반 학생만 조회 가능. 조직(스튜디오) 단위 분리 — 추후 여러 학원/코스 확장 대비 구조.
- **알려진 한계 (정직한 고지)**: 채점이 브라우저에서 이루어지므로, 기술에 밝은 학생이 브라우저 콘솔로 점수를 조작하는 것까지 막을 수는 없습니다(서버는 범위 검증·활동 ID 검증·중복 제거만 수행). 초중급 음악 이론 수업 용도로는 충분하며, 완전한 서버 채점이 필요해지면 콘텐츠의 정답 데이터를 서버로 옮기는 후속 작업이 필요합니다 — `COVERAGE.md` 참고.
