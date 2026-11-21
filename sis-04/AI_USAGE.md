# AI Usage Disclosure — SIS #04

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| ChatGPT Default, unauthenticated browser chat | not displayed | 2026-11-22 | Analysis, corrected plan, adapter/test review; three real exchanges | Reply excerpts and prompts in evidence/ and report §8 |
| Codex in ChatGPT Work | not displayed | 2026-11-22 | Source inspection, plan review, feature, refactoring, tests, actual runs, diagrams, report and Git stages | app/, diagrams/, evidence/, report.md (including requested editing of the student reflection), submission.yml, AI_USAGE.md |

**The assistant wrote, or helped write, tests in app/:** yes. Kept the 20 original Week 07 tests unedited. Added 16 catalog, four time-helper and five rendered UI cases. Expectations were taken from AC1–AC6, F1–F5 and fixed B1–B6. The first external reply's wrong boundary IDs and third reply's changed function signature were rejected. No expected result was changed to match a broken implementation.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes, actual code runs in the assistant task workspace, not a claim of student execution. Full original outputs remain in evidence/, including the failed attempts.

**Every number in report.md section 7 was measured the way its row says:** yes. No percentage improvement or time-spent estimate is fabricated. Commit dates were generated at real publication time. The final tree comparison found the baseline import had relocated the original app/.gitignore; application code and tests were unchanged, but baseline_unchanged is declared no. The original ignore file was restored in the final tree, without rewriting baseline history.

**I shared no credentials, keys or private data with any tool:** yes. Only fictional catalog data, source and the existing student identification used for coursework were published to the student's requested repository. No environment values or real-room/student records were sent to the analysis chat.

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** no; independent student review and understanding are not yet confirmed.

**Anything I accepted from the AI without fully understanding it:** student review is pending for the analysis, implementation, tests and design decisions. All technical checks were performed by the assistant. The student supplied a draft with bracketed, unconfirmed personal actions and asked for corrections. The original is preserved; AI edited and expanded it to remove unverified claims and correct AC/F/B terminology. The edited reflection is labelled as assisted and needs student review; unaided authorship is not asserted. Five screenshots could not be obtained. No claim of complete compliance or visual QA is made.

No new SKILL.md was created. GitHub access was scoped to the task branch and an open PR; no main push or merge. The cloud browser was used for the three AI exchanges. Its local app connection failed and its file URL policy was respected.

Signed: Prepared for Keshubayev Abylay; student confirmation pending.
Date: 2026-11-22.
