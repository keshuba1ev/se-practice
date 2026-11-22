# AI Usage Disclosure — Week 10

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex in ChatGPT Work | not displayed | Explicit read-only playbook summary and risk review of the checkpoint | none in app during review; preserved responses/status in evidence afterward |
| Same assistant | not displayed | Code challenge, risk scoring, readiness audit, playbook draft | lab-report.md, evidence/; app/AGENTS.md awaiting student approval |
| Same assistant | not displayed | Reviewed R2 pure-policy extraction and architecture/integration guard; separate one-room scope correction | app/src/booking.ts, booking.test.ts, lib/availability.ts, lib/availabilityPolicy.ts, lib/sampleData.ts |
| Same assistant | not displayed | Actual terminal checks, differential comparison and isolated Chromium evidence automation | evidence/, repository .github/workflows/week-10-evidence.yml |
| Same assistant | not displayed | Report drafting and factual declaration | lab-report.md, submission.yml, AI_USAGE.md |

**The review in Task 2 edited no app files and git status showed no change afterward:** yes. It was an instruction-restricted read-only phase in the same assistant session, not a technically tool-disabled Plan-mode sandbox. No independent second AI reviewer is asserted. The assignment supplied the exact prompts, which this assistant explicitly addressed; evidence preserves its responses. Source writes began after that phase.

**I labelled every claim after opening the cited file myself:** no independent student inspection is confirmed. The assistant opened the files, traced handlers and ran the commands, then labelled claims with stated uncertainty. The student must review those labels rather than claim those executions as personal work.

**Every change to app was reviewed by me as a diff before acceptance:** student review pending. The assistant inspected the proposed policy diff before applying it under the assigned scope. Playbook approval was specifically requested and is not assumed. No human approval is inferred from a green check.

**Another assistant was used:** no. The same Codex assistant performed the lab; prior SIS 04 tooling structure was consulted to build a new screenshot workflow, but no SIS application feature/source was imported into this one-room project. No external chat replies or model versions were fabricated.

**Every terminal output in the report comes from a real run, unedited:** yes. Full baseline/red/final suite logs are pasted verbatim. The separately labelled failed browser CI excerpt is an excerpt, with the full run linked. Original failed typecheck and initial browser capture are preserved. Counts are not invented.

**I can explain every score and the release decision without the assistant:** not independently confirmed. The student-authored conclusion was requested explicitly because README requires 80–150 words without AI. No conclusion has been written in the student's name. The later npm ci/audit finding confirms R6 at score 6, which forbids GO regardless of a green functional suite.

**Anything accepted without fully understanding it:** student understanding/review of the policy result union, preserved reason precedence, architecture guard limitations, scores and readiness calculation remains unconfirmed. These are assistant-produced technical results for student review. The R2 failing test demonstrates missing shared ownership, not a preexisting ordinary-input AC failure. The separate comparison checks 5202 boolean and 10404 full UI-adapter results against checkpoint, including invalid numeric inputs; it is finite evidence, not exhaustive proof. Existing invalid-now and stale-feedback behavior remains a limitation. npm audit was actually run after CI warned of advisories: exit 1, 24 reports including two critical and thirteen high; raw JSON is retained. No dependency remediation or exploit test was performed.

No application dependency/lockfile changed. Playwright is isolated outside app only in the disposable evidence runner; it is not an application package or production service. Workflow permissions are contents:read, checkout credentials are not persisted, only localhost app requests are permitted during browser tests, and nothing is deployed. Automated Chromium interaction is not presented as a student's manual browser/physical-phone test. Names in room/booking fixtures are fictional. Commit times are real and were not backdated.

Signed: Prepared for Keshubayev Abylay; student confirmation pending.
Date: 22 November 2026 (Almaty)
