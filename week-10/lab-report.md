# Week 10 — Lab report

**Name:** Keshubayev Abylay
**Group:** not provided
**Date:** 22 November 2026 (Almaty)

Prepared with disclosed AI assistance. No independent student review, approval or unaided conclusion is fabricated.

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Codex in ChatGPT Work |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | ChatGPT Work workspace tools, explicit file reads; same assistant throughout |
| Starting point (`week-08` or `week-07`) | week-07 at ab4478304ba926451b10ec08976faf269b54635c; week-08 branch absent |
| Baseline commit — the checkpoint of Part 0 | ed0731ef6205d0e2ca3c77f722b9df1439cacab7 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Assistant's managed Linux terminal; additional isolated Ubuntu GitHub runner |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |

Branch week-10 starts from main 4e8a0cde5e86c7fe09b0372e5ebc43d72ec5d43f. All 25 imported app files, including its original .gitignore, match Week 07 byte for byte at checkpoint, before adding the provided AGENTS.md. Provided README/checkers/playbook are retained unchanged. The equivalent local checkpoint is de660ef; publication used the connected GitHub account with server-generated dates, and its tree matches exactly. No commit timestamp was backdated. The copied app unexpectedly contained five fictional rooms; that inherited scope defect is R3, separately corrected after the unchanged checkpoint. No SIS 04 source was imported.

The assistant performed the source challenge and verification. Independent student inspection, manual student testing and approval are not inferred from these runs. The exact prompts below came from this assignment and were answered by the same assistant in explicit read-only/draft phases; they are not an invented conversation with a second model.

## 2. Task 1 — the baseline

Baseline recorded before changing source or the copied playbook. npm install --ignore-scripts --no-audit --no-fund installed the existing lockfile graph; git status --porcelain -- week-10/app remained empty. Scripts that do not exist are recorded as missing, not fabricated successes.

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Used npx --no-install vitest run to prohibit downloading another version; 20/20. baseline-vitest.txt |
| `npm test` | yes | pass | Script is vitest run; 20/20. baseline-npm-test.txt |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | Actually invoked: Missing script test:unit; exit 1. baseline-test-unit.txt |
| `npm run build` | yes | pass | Vite production build completed; outdated Browserslist warning retained. baseline-build.txt |
| `npm run lint` | yes | pass | ESLint exit 0. baseline-lint.txt |

Additional baseline npm run typecheck passed (baseline-typecheck.txt). App has no README; commands were read from package.json and copied AGENTS.md. The production-deploy instruction was not executed because the assignment forbids external deployment.

### 2.2 The baseline test run

```text

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-10-work/week-10/app

 ✓ src/booking.test.ts (20 tests) 7ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  21:53:36
   Duration  734ms (transform 65ms, setup 0ms, collect 67ms, tests 7ms, environment 2ms, prepare 241ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### 2.3 The agent reads the playbook

Assignment prompt explicitly addressed to this same assistant:

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```
Assistant response, preserved verbatim:

```text
I explicitly read app/AGENTS.md; I do not claim automatic loading. Its Project section describes React/TypeScript/Vite and names src/booking.ts, src/App.tsx and src/booking.test.ts. It asks for real room names and the KBTU timetable. AC1 rejects invalid/past intervals, AC2 caps duration at 120 minutes, AC3 blocks closed rooms, AC4 incorrectly treats touching endpoints as overlap, and AC5 forbids mutation. AC6 is absent. It permits edits anywhere, new packages, Supabase persistence and a login. Its finish step asks for production deployment after building.
Commands stated: npm install; npm run dev; npm run test:unit; npm run build; npx netlify deploy --prod. package.json actually supplies dev, build, lint, preview, typecheck and test (vitest run); it has no test:unit and no netlify dependency. I have not applied any playbook rule or source change. The assignment's explicit scope takes precedence over the conflicting permissions.
```

<!-- Write below this line -->
The command summary accurately reports the supplied file, but its real-data, persistence/login and deployment permissions are wrong against README constraints; AC4 contradicts the original strict overlap predicates and T01/T08; AC6 is missing. package.json and the real failing command prove that test:unit is nonexistent. Following those instructions would not be legitimate authorization; the assignment controls this exercise.

## 3. Tasks 2–3 — the read-only review and the challenge

Review and source challenge are separate recorded phases; claims are not proof.

### 3.1 The review prompt and the answer

Where it ran, and how editing was prevented:

<!-- Write below this line -->
The same Codex assistant read the checkpoint files in this chat under the exact WITHOUT editing instruction. It performed no write to app/ during the review; evidence/review-app-status.txt is empty git status output afterward. This was an instruction-limited observational phase, not a tool-disabled Plan-mode sandbox or an independent second reviewer. The source challenge below was also performed by the assistant; it is not claimed as the student's own inspection. The AI had filesystem capabilities, so technical inability to edit is not claimed.

Assignment prompt explicitly addressed to this same assistant:

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```
Assistant response, preserved verbatim:

```text
1. Agent operations / Security: app/AGENTS.md permits Supabase/login, real KBTU data and production deployment, and names nonexistent test:unit. An agent following it could leave scope or publish an unchecked build. Verify each rule against the assignment and package.json, then execute the named test command. The lines are observable; no deployment or exposure is claimed to have occurred.
2. Maintainability: src/booking.ts canBook and src/lib/availability.ts checkAvailability independently encode interval, past-time, duration, blocked and overlap rules. App.tsx invokes both, combining the boolean from one with messages from the other. A future edit to one can produce inconsistent decisions/reasons. Compare predicates and trace handleCheck; add an architecture regression proving one policy owner plus independent adapter parity checks. Current divergence on ordinary valid inputs is not established.
3. Correctness / scope: src/lib/sampleData.ts exports five fictional rooms and App.tsx maps them all. This contradicts the assigned one-room scope, though it is inherited from Week 07. Count records and inspect the rendered page. The data is marked fictional; this is not evidence of real personal data.
4. Reliability: App.tsx stores decision separately from startStr/endStr/currentTime; TimeField edits only change the time state. A previously Available result can stay visible after an invalidating time edit until resubmit. Trace handlers and reproduce in a browser. The source suggests it; I have not yet run that browser interaction.
5. Privacy: no privacy leak is established in src/lib/sampleData.ts, which is explicitly fictional. Real timetable use encouraged by AGENTS.md would create a plausible future privacy risk, not evidence of an existing leak. Inspect data literals and browser requests; do not fetch real schedules.
6. Reliability / readiness: there is no app README, formatter configuration, .env.example, pre-commit hook or CI workflow in the imported app. Clean checks therefore rely on a human invoking package scripts. Verify the tracked inventory and scripts; absence of CI does not prove a failed build.
7. Security: dependency vulnerabilities may exist because dependency ranges are broad and no security check is configured. A committed lockfile does pin an install graph, so ranges alone do not prove an exploitable dependency. An advisory audit and threat review would be required; neither is claimed here.
I edited no app files during this review. I have not claimed SQL injection, fixture mutation, a passing browser check or a production incident.
```

### 3.2 Challenging the AI's claims

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Playbook permits deployment and has an unusable test command | Agent operations | AGENTS.md Commands/Before you finish, package.json, baseline-test-unit.txt | confirmed | prod deployment is explicitly requested; test:unit is absent and actually failed. No deployment was attempted. |
| 2 | Two independently owned policies can drift | Maintainability | booking.ts canBook; lib/availability.ts checkAvailability; App.tsx handleCheck | confirmed | Same five predicates duplicated; App combines first boolean and second message. Current ordinary-input disagreement is not established. |
| 3 | Five-room fixture violates one-room scope | Correctness | lib/sampleData.ts SAMPLE_ROOMS and App.tsx map | confirmed | Five literals at checkpoint, assignment says one; final single-room diff is separately preserved. |
| 4 | Editing time can retain an old decision | Reliability | App.tsx TimeField onChange/setCurrentTime and stored decision | confirmed | Those handlers do not reset/recompute decision; actual browser reproduction is recorded separately when available. |
| 5 | No current privacy leak demonstrated; real timetable instruction could introduce one | Privacy | Fictional comment and every sampleData literal; no network client in src | plausible | Future bad instruction creates exposure risk; no real timetable or person has been shown. |
| 6 | Missing README, formatter, hooks and app CI at checkpoint | Reliability | Tracked checkpoint inventory, package.json, no README/workflow/hook | confirmed | Missing files are observable. Final CI is new evidence infrastructure, so final 3a/3d differ from checkpoint. |
| 7 | Dependency vulnerabilities might exist | Security | Lockfile; later npm ci warning and actual npm audit JSON | confirmed | Ranges alone were insufficient. Subsequent audit exited 1 and reported 24 advisories, including 2 critical/13 high. Exploitability was not demonstrated. |

No unsupported claim was manufactured to fill a label. All observations were checked by the implementing assistant, so this does not establish independent student verification.

## 4. Task 4 — the risk register

Likelihood 1 unlikely, 2 possible, 3 likely; impact 1 minor, 2 moderate, 3 serious. Scores are judgments grounded in the observable trigger and this fictional, read-only checker scope, not measured probabilities.

### 4.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | Contradictory playbook → agent follows prod/data/login instructions without tests → scope/privacy/release breach | AGENTS.md | Real-data instruction; nonexistent test:unit; netlify --prod; Supabase/login permission | confirmed | 3 | 3 | 9 | Minimal approved playbook patch; forbid external actions and require real checks | Student approves; assistant applies | Diff with same headings, nine checker-counted changed lines; all named commands exist and pass; C1-C6 checker |
| R2 | Maintainability | Two policy owners → future boundary fix changes one → boolean and explanation disagree | src/booking.ts canBook; src/lib/availability.ts checkAvailability | Five duplicated predicates; App combines both outputs; architecture regression fails before extraction | confirmed | 3 | 2 | 6 | Extract one pure availabilityPolicy; preserve both public adapters | Assistant; student reviews | R2 architecture/integration test red then green; original 20 tests; 15606 baseline comparisons |
| R3 | Correctness | Imported five-room fixture → broader UI than one-room assignment → scope violation | src/lib/sampleData.ts | Five room records in unchanged checkpoint, all rendered by App map | confirmed | 2 | 2 | 4 | Keep only fictional r1 and its two bookings; separate scope-only patch | Assistant; student reviews | scope.diff; final fixture count and browser single-room assertion |
| R4 | Reliability | Decision stored independently of edited times → stale Available visible → misleading feedback until resubmit | src/App.tsx handleCheck and TimeField handlers | onChange only sets times; decision resets on room change, not time edit | confirmed | 2 | 2 | 4 | Until dedicated UI fix, require explicit Check availability after each edit; no booking writes exist | Student release owner | Browser edit/resubmit reproduction; future rendered invalidation regression before a separate UI change |
| R5 | Reliability | Missing current architecture/setup documentation → agent guesses commands/ownership → incorrect or unreproducible change | missing: app README with current architecture and setup | No README, no .env.example, no formatter/hooks; AGENTS snapshot insufficient for new policy ownership | confirmed | 2 | 2 | 4 | Add accurate local-only architecture/setup notes and evaluate remaining readiness gaps in a later task | Student maintenance owner | Twelve-row audit; next-level evidence inspection, not claimed complete |
| R6 | Security | Reported vulnerable dependency graph → susceptible tooling used beyond this isolated demo → possible compromise | package.json; package-lock.json | npm ci and later npm audit report 24 advisories: 2 critical, 13 high, 7 moderate, 2 low; dependency-audit.json | confirmed | 2 | 3 | 6 | No deployment or exposure; scoped dependency remediation/retest required separately, no blind audit fix | Student release owner | Audit exit 1 preserved; investigate advisory applicability and retest proposed updates; no exploit is claimed |

### 4.2 The top two for action

1. **R1** — 3 × 3 = 9. The file directly orders production deployment and real data and allows login/database while its test command is absent; an agent instructed to obey it has a likely trigger, and publishing or exposing data is serious even though no such incident occurred.
2. **R2** — 3 × 2 = 6. Both active code paths own every core rule and App actually calls both. A future edit has two places to update, so drift is likely; inconsistent local availability feedback has moderate impact because no real reservation is written. R6 was later confirmed at the same score 6 by advisory output; its potential compromise impact is serious (3), with applicability uncertain (L2). It is not lower priority by score, but R2 is the mandatory tested refactor; R6 remains a release blocker, so GO is disallowed. No omitted confirmed risk scores above 6.

## 5. Task 5 — the agent-readiness audit

Final-tree readiness below is an audit rubric, not certification. Checkpoint lacked CI/integration evidence; a read-only evidence workflow and the new two-module integration/architecture test now exist.

### 5.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier dependency/config in app. ESLint alone does not establish a formatter. |
| 1b | Linter | yes | app/eslint.config.js and eslint dependency; npm run lint exit 0. |
| 1c | Type checks | yes | app/tsconfig.json, typescript dependency and typecheck script. |
| 1d | Unit tests | yes | src/booking.test.ts imports Vitest and real modules; vitest 3.2.4 dependency. |
| 1e | Pinned dependencies (lockfile) | yes | Committed app/package-lock.json unchanged by installation/refactor. |
| 2a | `.env.example` | no | Absent; no environment values are actually required for the local checker. Rubric still says no. |
| 2b | Architecture notes | no | No app README/doc of the current shared policy. Copied AGENTS Project names old entry points but omits the newly extracted policy. |
| 2c | `AGENTS.md` | yes | app/AGENTS.md is present; presence alone does not imply safe instructions. |
| 3a | CI | yes | Repository .github/workflows/week-10-evidence.yml runs test/typecheck/lint/build on every week-10 push. |
| 3b | Pre-commit hooks | no | No .husky, lint-staged, simple-git-hooks or pre-commit config in app. |
| 3c | Integration checks | yes | R2 test calls both canBook and checkAvailability using independent fixtures; none existed at baseline. |
| 3d | Reviewable evidence | yes | Workflow preserves actual check log and screenshot artifact; this PR attaches run logs and reviewed diffs. |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:** Level 1 has 4/5 = 80%, so it is reached despite no formatter (1a). Level 2 has 1/3 = 33.3%; both 2a (.env.example with no secrets) and 2b (accurate architecture/setup notes) would need to exist to reach 3/3, the 80% ceiling for three rows. Do not invent an environment requirement just to satisfy the rubric. Level 3 currently has 3/4 = 75%, missing hooks, and cannot bypass Level 2. No app README exists, so its accuracy cannot be asserted; src/components versus src/lib is clear, but policy ownership needs current documentation. Root workflow is operational evidence rather than a claim that app contains its own recognized workflow directory.

## 6. Task 6 — the agent playbook

User approval is required by the exact assignment prompt before the drafted playbook is applied. It was requested through the chat approval question; pending status must not be replaced with an assumed yes.

### 6.1 The playbook prompt and the answer

Assignment prompt explicitly addressed to this same assistant:

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```
Assistant response, preserved verbatim:

```text
The provided file conflicts with one fictional room and no real data, endpoint touching under AC4, no database/login, no secrets, no external deployments, and tests before acceptance. It omits AC6; test:unit does not exist. Broad edit/package permissions are also too loose for this bounded audit.
Draft only, preserving every heading: replace real-data guidance with one fictional room/bookings only; correct AC4 to allow touching; insert AC6; change Tests to npm test; restrict edits to task-approved source/tests with diff review; forbid new packages for this audit/refactor; replace Supabase/login permission with no database/login/secrets/credentials/personal data; require npm test, npm run typecheck, npm run lint and npm run build before acceptance plus UI inspection; replace deployment instruction with never deploy and human review before merge.
These are nine original lines replaced and one line inserted, ten changed lines under the checker's definition. All named check scripts exist in package.json. I drafted the complete file outside app/ at /tmp/week10-agents-approved-draft.md and requested your approval; app/AGENTS.md remains unchanged until that reply. I reject a rewritten playbook, extra headings, added infrastructure and a new deployment tool.
```

### 6.2 Findings and my decisions

Assistant technical review recommendations below; student approval pending, so no row is represented as a completed human approval. The preserved AI draft answer miscounted ten changed lines; a dry-run of the supplied check_agents on a separate temporary copy measured nine (evidence/agents-draft-check.json), with all playbook constraints passing there. This is draft validation only; app/AGENTS.md is unchanged.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU room/timetable instruction | Conflicts with one fictional room and no real personal data | modify | Replace with one fictional room/bookings only; do not fetch real schedule. |
| 2 | AC4 includes touching as overlap | Conflicts with strict interval predicate and AC4 contract | modify | Explicitly allow endpoint touching, preserve actual booking behavior. |
| 3 | No AC6 | Missing desktop/mobile feedback rule | modify | Insert the exact AC6 rule without changing headings. |
| 4 | Tests: npm run test:unit | Missing script in package.json | modify | Use existing npm test; no new test script needed. |
| 5 | Edit any file | Overbroad for bounded audit | modify | Limit to task-approved source/tests and diff review. |
| 6 | Add packages | Unnecessary app dependency expansion | modify | Forbid adding application packages for audit/refactor; isolated evidence tool is not an app dependency. |
| 7 | Supabase and login | Conflicts with no database/login; no secret guard | modify | Forbid database/login, secrets/credentials/personal data explicitly. |
| 8 | Page loads is enough | Missing tests-before-acceptance gate | modify | Require existing test/typecheck/lint/build and desktop/mobile inspection. |
| 9 | netlify deploy --prod | Conflicts with no external deployments | modify | Never deploy; require human review before merge. |
| 10 | Rewrite headings or add infrastructure | Unnecessary expansion | reject | Keep all five original headings; no deployment tooling or application dependency changes. |

### 6.3 The approved patch

Approval pending: the following is the proposed, unapplied diff, not an approved patch.

```text
--- week-10/provided/AGENTS.md	2026-11-22 21:52:28.662512424 +0500
+++ /tmp/week10-agents-approved-draft.md	2026-11-22 21:53:07.368242931 +0500
@@ -9,30 +9,31 @@
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional bookings only; no real timetable or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit only task-approved source and tests; review the diff before acceptance.
+- Do not add packages for this audit or refactor.
+- Do not add a database or login; do not use secrets, credentials or real personal data.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` before proposing acceptance; inspect the UI at desktop and mobile widths.
+- Never deploy to external services; require human review before merging.
```

## 7. Task 7 — verify safely

The failing regression is an architecture guard against the confirmed duplication, not a newly discovered failing ordinary-input AC case. Baseline canBook tests were green; this limitation is explicit.

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**.

The first version used node:fs; Vitest ran it but typecheck caught missing Node declarations. The guard was moved to Vite ?raw imports without adding packages or weakening any assertion. The corrected committed guard was rerun against the untouched checkpoint evaluators before restoring the proposed extraction. This is that real red run (original first red run also retained):

```text

> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-10-work/week-10/app

 ❯ src/booking.test.ts (21 tests | 1 failed) 18ms
   ✓ canBook: fixed acceptance criteria > T01 AC4 touching after 1ms
   ✓ canBook: fixed acceptance criteria > T02 AC1 starts now 0ms
   ✓ canBook: fixed acceptance criteria > T03 AC1 zero duration 0ms
   ✓ canBook: fixed acceptance criteria > T04 AC1 reversed 0ms
   ✓ canBook: fixed acceptance criteria > T05 AC1 past day end 0ms
   ✓ canBook: fixed acceptance criteria > T06 AC2 exactly 120 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T07 AC2 121 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T08 AC4 touching before 0ms
   ✓ canBook: fixed acceptance criteria > T09 AC4 partial overlap 0ms
   ✓ canBook: fixed acceptance criteria > T10 AC4 contains existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T11 AC4 inside existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T12 AC4 identical interval 0ms
   ✓ canBook: fixed acceptance criteria > T13 AC3 blocked 0ms
   ✓ canBook: fixed acceptance criteria > T14 AC4 empty bookings 0ms
   ✓ canBook: fixed acceptance criteria > AC5 accepted check preserves existing booking data 1ms
   ✓ canBook: fixed acceptance criteria > X1 AC1 ending exactly at midnight 0ms
   ✓ canBook: fixed acceptance criteria > X2 AC4 overlap with the second existing booking 0ms
   ✓ canBook: fixed acceptance criteria > E1 AC1 first future minute is permitted 0ms
   ✓ canBook: fixed acceptance criteria > E2 AC4 gap touches both existing bookings 0ms
   ✓ canBook: fixed acceptance criteria > E3 AC5 repeated accepted checks keep all data unchanged 0ms
   × R2 AC4 AC5: boolean and UI adapters share one pure policy 12ms
     → expected 'export interface BookingInterval {\n …' to contain 'from \'./lib/availabilityPolicy\''

 Test Files  1 failed (1)
      Tests  1 failed | 20 passed (21)
   Start at  21:58:01
   Duration  651ms (transform 77ms, setup 0ms, collect 81ms, tests 18ms, environment 0ms, prepare 194ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R2 AC4 AC5: boolean and UI adapters share one pure policy
AssertionError: expected 'export interface BookingInterval {\n …' to contain 'from \'./lib/availabilityPolicy\''

- Expected
+ Received

- from './lib/availabilityPolicy'
+ export interface BookingInterval {
+   start: number;
+   end: number;
+ }
+
+ export interface BookingRequest {
+   start: number;
+   end: number;
+   now: number;
+   blocked: boolean;
+   bookings: readonly BookingInterval[];
+ }
+
+ /** Extracted Week 06 decision. The caller supplies the room and same-day data. */
+ export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
+   if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
+   if (start < 0 || end > 1440) return false;
+   if (start >= end) return false;
+   if (start <= now) return false;
+   if (end - start > 120) return false;
+   if (blocked) return false;
+   for (const booking of bookings) {
+     if (start < booking.end && booking.start < end) return false;
+   }
+   return true;
+ }
+

 ❯ src/booking.test.ts:113:27
    111| test('R2 AC4 AC5: boolean and UI adapters share one pure policy', () =…
    112|   // Architecture guard: both public adapters must import the single r…
    113|   expect(predicateSource).toContain("from './lib/availabilityPolicy'");
       |                           ^
    114|   expect(uiAdapterSource).toContain("from './availabilityPolicy'");
    115|   const bookings = Object.freeze([Object.freeze({ start: 600, end: 660…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1440×1000 | Actual localhost build, one room, 10:00–11:00 at now09:00, touching is Available; assistant inspected the actual image | Automated browser assertions and visual inspection passed; student manual check not claimed | `evidence/ui-desktop.png` |
| Mobile | 390×844 viewport; 390×1009 full page | 09:30–10:30 rejected with 09:00–10:00 overlap reason; scrollWidth=clientWidth=390; assistant inspected image | Automated assertions and visual inspection passed; physical phone and student manual interaction not tested | `evidence/ui-mobile.png` |

The cloud browser refused workspace loopback. Vite preview bound to 0.0.0.0 also failed because interface enumeration is restricted; explicit 127.0.0.1 starts successfully. No network protection was weakened. Actual screenshots were captured at source commit 6be56f08d0c023088e7b5a0adbb0bc8e47bbebc5 by Chromium 141.0.7390.37 at 2026-11-22T17:06:33.305Z (22:06 Almaty). Successful run: https://github.com/keshuba1ev/se-practice/actions/runs/45047451942. Manifest hashes match the downloaded artifact (ZIP SHA-256 a7d125e5ec1d9876122e8314a7ae2b0d73f0b4862ff5d1ff719d3fd1f7254262). The first failed capture used an ambiguous Start label; only the evidence selector changed to an anchored name, with its actual failed log excerpt preserved. The five successful browser assertions also reproduce R4 before resubmitting; it remains a known defect.

The isolated CI runner serves only localhost and has repository contents:read, no stored checkout credentials and no deployment step. Its tools are installed outside app and do not change the application dependency graph.

### 7.3 Tests and checks I did not run

- Student manual desktop/phone interaction and independent review have not been performed or confirmed; assistant automation/visual inspection will be labelled separately.
- Physical phone hardware, Safari/Firefox, screen reader/keyboard-only audit and exhaustive accessibility testing were not run; current browser evidence is Chromium emulation only.
- npm audit was run after CI revealed warnings: exit 1 and 24 advisories, stored verbatim. Exploit reproduction, advisory applicability assessment, fuzz/security testing and dependency remediation were not run. External deployment is forbidden, not an acceptance check.
- Persisted booking, login/database and real timetable tests are out of scope; those features do not exist.
- Optional second-assistant comparison/background-agent execution was not performed. The background policy is a thought experiment only.
- The R2 guard checks shared imports and a few independent adapter decisions. It is not a mutation test or proof of every input; the separate equivalence experiment samples 15606 decisions/messages against checkpoint.

## 8. Task 8 — mitigate two risks

The formal top-two mitigations are the R1 playbook patch (waiting for human approval) and R2 policy extraction. Separately, R3 scope correction removes inherited extra fictional fixtures; it is not hidden inside the refactor and does not add a feature.

### 8.1 The first mitigation

**Risk:** R1

This is the playbook mitigation, not the refactor. It is not applied yet because student approval is pending.

**Problem → pattern → benefit:** Not applicable to this documentation-only patch.

**What I rejected from the agent's patch, and why:** Rejected a complete rewrite, extra headings, deployment tooling, new app dependencies and unrequested infrastructure because the assignment requires a focused patch. The assistant reviewed the draft diff; this is not human acceptance.

The diff I approved (`git diff`): not yet approved by the student; proposed patch only.

```text
--- week-10/provided/AGENTS.md	2026-11-22 21:52:28.662512424 +0500
+++ /tmp/week10-agents-approved-draft.md	2026-11-22 21:53:07.368242931 +0500
@@ -9,30 +9,31 @@
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional bookings only; no real timetable or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit only task-approved source and tests; review the diff before acceptance.
+- Do not add packages for this audit or refactor.
+- Do not add a database or login; do not use secrets, credentials or real personal data.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` before proposing acceptance; inspect the UI at desktop and mobile widths.
+- Never deploy to external services; require human review before merging.
```

### 8.2 The second mitigation

**Risk:** R2

Assignment prompt explicitly addressed to this same assistant:

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```
Assistant response, preserved verbatim:

```text
Planned edits only: src/lib/availabilityPolicy.ts (new pure policy with shared request/result types), src/booking.ts (thin boolean adapter preserving canBook's signature), src/lib/availability.ts (existing rich-message adapter delegating to the same policy). The existing App.tsx flow and message text remain unchanged; src/booking.test.ts receives only the already planned architecture/parity regression. No new package, Strategy/Adapter class, clock service, room catalog or unrelated rename is justified.
Problem: two evaluators independently own the same five acceptance rules. Extract Function/Module is sufficient: one pure evaluation result supplies boolean and detailed adapters, so a future boundary edit has one owner. Keep original 20 assertions, use frozen independent bookings in the new integration assertion, and inspect the diff for the same ordering, reason strings and touching semantics before applying. The red regression is an architecture guard plus behavior parity test, not a claim that an existing ordinary-input AC test failed.
```

**Problem → pattern → benefit:** Two active evaluators independently implement the same acceptance rules and App combines their outputs, creating a drift risk. Extract Function/Module places the predicates in a single pure availabilityPolicy and preserves boolean and rich-message adapters, so later boundary changes have one owner without introducing a Strategy or class hierarchy.

**What I rejected from the agent's patch, and why:** Rejected Strategy/Adapter classes, new dependencies, renamed public parameters and unrelated UI redesign because there is one policy. Also rejected silently tightening invalid now inputs: the refactor preserves even existing invalid-clock behavior; a new validation policy belongs in a separate reviewed change. Replaced the test's Node filesystem import with Vite raw imports after the actual typecheck failure. No original assertion was removed. Implementation review was performed by the assistant; student acceptance is unconfirmed.

The diff I approved (`git diff`), as a technical assistant review within the authorized task:

```text
diff --git a/week-10/app/src/booking.test.ts b/week-10/app/src/booking.test.ts
index 02a7c08..3e36c2d 100644
--- a/week-10/app/src/booking.test.ts
+++ b/week-10/app/src/booking.test.ts
@@ -1,4 +1,5 @@
-import { readFileSync } from 'node:fs';
+import predicateSource from './booking.ts?raw';
+import uiAdapterSource from './lib/availability.ts?raw';
 import { checkAvailability } from './lib/availability';
 import { describe, expect, test } from 'vitest';
 import { canBook, type BookingRequest } from './booking';
@@ -109,8 +110,6 @@ describe('canBook: fixed acceptance criteria', () => {
 
 test('R2 AC4 AC5: boolean and UI adapters share one pure policy', () => {
   // Architecture guard: both public adapters must import the single rule owner.
-  const predicateSource = readFileSync(new URL('./booking.ts', import.meta.url), 'utf8');
-  const uiAdapterSource = readFileSync(new URL('./lib/availability.ts', import.meta.url), 'utf8');
   expect(predicateSource).toContain("from './lib/availabilityPolicy'");
   expect(uiAdapterSource).toContain("from './availabilityPolicy'");
   const bookings = Object.freeze([Object.freeze({ start: 600, end: 660 })]);
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index a06f979..1e6d6ef 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -1,26 +1,7 @@
-export interface BookingInterval {
-  start: number;
-  end: number;
-}
-
-export interface BookingRequest {
-  start: number;
-  end: number;
-  now: number;
-  blocked: boolean;
-  bookings: readonly BookingInterval[];
-}
+import { evaluateBooking, type BookingRequest } from './lib/availabilityPolicy';
+export type { BookingInterval, BookingRequest } from './lib/availabilityPolicy';
 
-/** Extracted Week 06 decision. The caller supplies the room and same-day data. */
-export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
-  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
-  if (start < 0 || end > 1440) return false;
-  if (start >= end) return false;
-  if (start <= now) return false;
-  if (end - start > 120) return false;
-  if (blocked) return false;
-  for (const booking of bookings) {
-    if (start < booking.end && booking.start < end) return false;
-  }
-  return true;
+/** Preserved public boolean API; all rules live in the shared pure policy. */
+export function canBook(request: BookingRequest): boolean {
+  return evaluateBooking(request).ok;
 }
diff --git a/week-10/app/src/lib/availability.ts b/week-10/app/src/lib/availability.ts
index e88db30..81082e7 100644
--- a/week-10/app/src/lib/availability.ts
+++ b/week-10/app/src/lib/availability.ts
@@ -1,7 +1,7 @@
+import { evaluateBooking } from './availabilityPolicy';
 import type { Booking, CheckInput, Decision, Room } from './types';
 
 const MINUTES_PER_DAY = 1440;
-const MAX_DURATION = 120;
 
 /**
  * Evaluate a candidate booking interval against the acceptance criteria.
@@ -14,60 +14,35 @@ export function checkAvailability(
 ): Decision {
   const { roomId, start, end, currentTime } = input;
 
-  // AC1: interval validity and "start after current time"
-  if (!Number.isFinite(start) || !Number.isFinite(end)) {
-    return fail('invalid-interval', 'Please enter valid start and end times.');
-  }
-  if (start < 0 || end > MINUTES_PER_DAY) {
-    return fail(
-      'invalid-interval',
-      'Times must fall within the same day (00:00 to 24:00).'
-    );
-  }
-  if (start >= end) {
-    return fail(
-      'reversed-interval',
-      'End time must be after the start time.'
-    );
-  }
-  if (start <= currentTime) {
-    return fail(
-      'past-start',
-      'Start time must be later than the current time.'
-    );
-  }
-
-  // AC2: duration cap
-  if (end - start > MAX_DURATION) {
-    return fail(
-      'too-long',
-      'Bookings cannot be longer than 120 minutes.'
-    );
-  }
-
   const room = rooms.find((r) => r.id === roomId);
-  if (!room) {
-    return fail('unknown-room', 'Please select a room.');
-  }
+  const evaluation = evaluateBooking({
+    start, end, now: currentTime, blocked: room?.blocked ?? false,
+    bookings: bookings.filter((b) => b.roomId === roomId),
+  });
 
-  // AC3: blocked room
-  if (room.blocked) {
-    return fail(
-      'room-blocked',
-      `${room.name} is currently blocked and cannot be booked.`
-    );
+  // Keep the existing message text and invalid-time precedence over unknown room.
+  if (!evaluation.ok) {
+    switch (evaluation.reason) {
+      case 'invalid-interval':
+        return fail('invalid-interval', Number.isFinite(start) && Number.isFinite(end)
+          ? 'Times must fall within the same day (00:00 to 24:00).'
+          : 'Please enter valid start and end times.');
+      case 'reversed-interval':
+        return fail('reversed-interval', 'End time must be after the start time.');
+      case 'past-start':
+        return fail('past-start', 'Start time must be later than the current time.');
+      case 'too-long':
+        return fail('too-long', 'Bookings cannot be longer than 120 minutes.');
+    }
   }
-
-  // AC4: overlap (touching endpoints allowed)
-  const roomBookings = bookings.filter((b) => b.roomId === roomId);
-  const overlap = roomBookings.find(
-    (b) => start < b.end && b.start < end
-  );
-  if (overlap) {
-    return fail(
-      'overlap',
-      `Overlaps an existing booking (${fmt(overlap.start)}–${fmt(overlap.end)}).`
-    );
+  if (!room) return fail('unknown-room', 'Please select a room.');
+  if (!evaluation.ok) {
+    if (evaluation.reason === 'room-blocked') {
+      return fail('room-blocked', `${room.name} is currently blocked and cannot be booked.`);
+    }
+    if (evaluation.reason === 'overlap') {
+      return fail('overlap', `Overlaps an existing booking (${fmt(evaluation.booking.start)}–${fmt(evaluation.booking.end)}).`);
+    }
   }
 
   return { ok: true, message: `${room.name} is available from ${fmt(start)} to ${fmt(end)}.` };
diff --git a/week-10/app/src/lib/availabilityPolicy.ts b/week-10/app/src/lib/availabilityPolicy.ts
new file mode 100644
index 0000000..17e03af
--- /dev/null
+++ b/week-10/app/src/lib/availabilityPolicy.ts
@@ -0,0 +1,31 @@
+export interface BookingInterval {
+  start: number;
+  end: number;
+}
+
+export interface BookingRequest {
+  start: number;
+  end: number;
+  now: number;
+  blocked: boolean;
+  bookings: readonly BookingInterval[];
+}
+
+export type AvailabilityEvaluation =
+  | { ok: true }
+  | { ok: false; reason: 'invalid-interval' | 'reversed-interval' | 'past-start' | 'too-long' | 'room-blocked' }
+  | { ok: false; reason: 'overlap'; booking: BookingInterval };
+
+/** Single pure rule owner; adapters keep their existing public return shapes. */
+export function evaluateBooking({ start, end, now, blocked, bookings }: BookingRequest): AvailabilityEvaluation {
+  if (!Number.isFinite(start) || !Number.isFinite(end)) return { ok: false, reason: 'invalid-interval' };
+  if (start < 0 || end > 1440) return { ok: false, reason: 'invalid-interval' };
+  if (start >= end) return { ok: false, reason: 'reversed-interval' };
+  if (start <= now) return { ok: false, reason: 'past-start' };
+  if (end - start > 120) return { ok: false, reason: 'too-long' };
+  if (blocked) return { ok: false, reason: 'room-blocked' };
+  for (const booking of bookings) {
+    if (start < booking.end && booking.start < end) return { ok: false, reason: 'overlap', booking };
+  }
+  return { ok: true };
+}
```

Additional scope-only R3 diff, separately committed after the behavior-preserving refactor:

```text
diff --git a/week-10/app/src/lib/sampleData.ts b/week-10/app/src/lib/sampleData.ts
index 3ec2085..5973535 100644
--- a/week-10/app/src/lib/sampleData.ts
+++ b/week-10/app/src/lib/sampleData.ts
@@ -3,17 +3,9 @@ import type { Booking, Room } from './types';
 // Fictional sample data only.
 export const SAMPLE_ROOMS: Room[] = [
   { id: 'r1', name: 'Athena 101', building: 'Engineering Block', capacity: 40, blocked: false },
-  { id: 'r2', name: 'Curie 204', building: 'Science Wing', capacity: 24, blocked: false },
-  { id: 'r3', name: 'Turing 310', building: 'CS Lab', capacity: 16, blocked: true },
-  { id: 'r4', name: 'Da Vinci 012', building: 'Arts Hall', capacity: 60, blocked: false },
-  { id: 'r5', name: 'Newton 220', building: 'Physics Block', capacity: 30, blocked: false },
 ];
 
 export const SAMPLE_BOOKINGS: Booking[] = [
   { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Intro to Circuits' },
   { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Signals Lab' },
-  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Orgo Study Group' },
-  { id: 'b7', roomId: 'r3', start: 600, end: 660, bookedBy: 'Maintenance Hold' },
-  { id: 'b5', roomId: 'r4', start: 480, end: 540, bookedBy: 'Faculty Meeting' },
-  { id: 'b6', roomId: 'r5', start: 840, end: 900, bookedBy: 'Quantum Seminar' },
 ];
```

Equivalence verification (script evidence/compare-policy.cjs compiles the checkpoint and final policy with the existing TypeScript package and compares full results/messages):

```text
PASS: 5202 canBook results exactly equal baseline; 10404 UI-adapter decisions/messages exactly equal baseline; fixtures unchanged.
Inputs include touching, overlap, 120/121 boundaries, midnight, invalid numbers, blocked and unknown room. This equivalence check preserves existing invalid-clock behavior; it does not prove every possible input.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 3 | 3 | 9 | Approval pending: no risk reduction credited until app/AGENTS.md is actually patched. |
| R2 | 3 | 2 | 6 | 1 | 2 | 2 | Both public adapters import the sole pure owner; architecture/integration test green; 15606 equivalence comparisons. |
| R3 | 2 | 2 | 4 | 1 | 2 | 2 | Separate sampleData patch leaves only fictional r1 with its own bookings; no broader catalog feature. |
| R4 | 2 | 2 | 4 | 2 | 2 | 4 | Time-edit staleness not fixed; require explicit resubmit, and no reservation is written. |
| R5 | 2 | 2 | 4 | 2 | 2 | 4 | Level 1 only; missing current docs not disguised by new CI evidence. |
| R6 | 2 | 3 | 6 | 2 | 3 | 6 | Actual npm audit reports critical/high issues; no blind fix or exploit claim. Isolate tooling and block broader release pending advisory review. |

### 8.4 The final run

```text

> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-10-work/week-10/app

 ✓ src/booking.test.ts (21 tests) 8ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  22:04:40
   Duration  601ms (transform 80ms, setup 0ms, collect 86ms, tests 8ms, environment 0ms, prepare 214ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

The full committed 21-test suite passed after the separate scope correction. Matching final-typecheck.txt, final-lint.txt and final-build.txt contain real successful output. No application package or lockfile changed. Playbook-only changes do not change the tested source.

## 9. Task 9, and what still fails

Background-agent rules are a proposal; no background agent was actually launched.

### 9.1 A background agent on this project

| Rule | What I require |
| --- | --- |
| Isolation | Create a dedicated week-10 task branch and separate worktree from the checkpoint; no direct changes to main or shared working tree. |
| Permitted files | Only task-listed week-10/app/src/booking.ts, src/lib/availability.ts, src/lib/availabilityPolicy.ts and src/booking.test.ts; AGENTS.md only after explicit student approval. |
| Commands | In week-10/app run npm ci, npm test, npm run typecheck, npm run lint and npm run build; run python tests/check_audit.py from week-10 with dependencies excluded from the source snapshot. |
| Prohibited actions | No credentials, real timetable, login/database, application packages, external service calls, deployment, changing provided checkers, history rewriting or weakened/skipped assertions. |
| Required evidence | Attach exact diff, real full test output, typecheck/lint/build exit status, risks and residual scores, browser capture provenance and a review note for each changed file. |
| Before merging or deploying | Human must review the isolated diff, evidence and risk decision before merge; keep this graded PR open and unmerged. External deployment remains forbidden even after a green build. |

### 9.2 Optional — the deck's checklist prompt (not graded)

Optional prompt not sent. No asynchronous agent execution is claimed; the six rules above apply to a hypothetical future task.

### 9.3 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| A2 | The copied playbook is intentionally still unchanged: explicit user approval of the concrete draft is pending. |
| A3 | The original nonexistent test:unit and deployment command remain until that approval; no command is claimed to exist. |
| C1 | Original real-data permission remains in the unapplied playbook; actual app fixtures are fictional and reduced to one. |
| C2 | Original database/login permission remains; neither feature was implemented. |
| C3 | Original incorrect touching rule and missing AC6 remain pending patch; real code preserves AC1–AC6 semantics. |
| C4 | Original playbook lacks the proposed no-secrets rule; no secret was used. |
| C5 | Original deployment instruction remains unapplied; no external deployment occurred. |
| C6 | Original finish instructions lack the proposed test gate; actual tests/checks were nevertheless run. |
| L13 | Student-authored 80–150-word release conclusion requested; not fabricated by AI. |

## 10. Release decision and conclusion

**Decision:** NO-GO

Later evidence update: npm ci reported 24 vulnerabilities; npm audit --json independently returned exit 1 with 2 critical and 13 high reports. R6 is now confirmed at score 6. A GO is therefore barred even if R1 receives approval. These are advisory counts rather than a claim of proven exploitation.

<!-- Write your conclusion below this line -->
Student-authored 80–150-word conclusion requested and still pending. No conclusion has been generated in the student's name. Provisional technical recommendation remains NO-GO while R1 is unmitigated and review requirements are unresolved; the student must make the final decision in their own words.

