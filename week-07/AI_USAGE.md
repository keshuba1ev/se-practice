# AI Usage Disclosure — Week 07

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex in ChatGPT Work | gpt-6.1-sol | Baseline preparation, assisted test-plan reasons, extraction, first suite and review | app/src/booking.ts, App.tsx, suites/first/booking.test.ts, lab-report.md §§1–5 |
| Same assistant | Same frozen model | Improvement, real Vitest runs, deliberate mutants with restoration, browser checks, type-only repair and report draft | app/src/booking.test.ts, RoomCard.tsx, evidence/, lab-report.md §§6–10 |
| Same assistant | Same frozen model | Declaration and Git preparation | AI_USAGE.md, submission.yml, commits |

**I used an assistant to extract canBook or fix a defect:** yes. The pure Boolean decision was extracted from Week 06 checkAvailability. The page calls it; messages still come from the old helper. Fixed cases, mutation trials, build and typecheck are real terminal runs. The inherited RoomCard booking annotation gained roomId; no booking decision was changed to make tests pass.

**I used another assistant as well:** no. Generation and improvement were performed in the existing conversation by the same model; no fresh external chat or external response is claimed.

**suites/first/ holds the first test file exactly as generated:** yes, preserved before review/runs. Its hash is in evidence/first-suite.sha256.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. Full files remain in evidence/.

**I can explain every test without the assistant:** not yet verified by the student. This disclosure does not claim independent review or full understanding.

**Anything accepted without fully understanding it:** the generated suite, assisted plan and report require student review. The 120–180-word conclusion is AI-assisted, based on actual evidence, and labelled accordingly; the worksheet's unaided-writing requirement is not claimed as fulfilled. Browser checks were performed by the assistant, with the U2 and phone-capture limitations disclosed.

Prepared for Abylai Keshubaev (24B031847). Student signature/confirmation pending.
Date: 2026-11-06.
