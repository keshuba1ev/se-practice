# AI Usage Disclosure — Week 09

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT Default, unauthenticated | not displayed | Part 2 — writing the calls for R1, R2, R3 in three fresh conversations | calls/; replies transcribed without correction, R2 unavailable/empty |
| Codex in ChatGPT Work | not displayed | Schema generation, constraint review, real checker runs, browser evidence collection, assisted permissions and report draft, Git preparation | tool/check_room.json, lab-report.md, AI_USAGE.md, submission.yml, evidence/ |

**I wrote tool/check_room.json myself:** no. Codex generated all of the definition. Its types, inclusive bounds, nested requirements, unknown-property rejection and check-only description were reviewed against README and tested with the provided checker. Independent student understanding is not asserted.

**I used an AI to explain a JSON Schema keyword or a check:** yes. Integer versus string, required, additionalProperties, nested items, inclusive bounds, and the distinction between input shape and cross-field booking rules.

**Every reply in calls/ and report section 4 is exactly what the model returned:** no, not fully verifiable for R2. R1 and R3 preserve the displayed text without editing. No R2 text could be collected; its zero-byte file is an explicit missing-evidence marker, not a claim that the model generated an empty string. See chat-observations.md.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The report inserts the full actual output. The starter output is preserved separately.

**Anything accepted without fully understanding it:** student review of the definition, proposed permission decisions and conclusion is pending. Sections 8–10 were assembled by AI from real observations; unaided student writing is not claimed. The agent performed the terminal and browser checks; the student did not independently run them in this session.

Signed: Prepared for Abylai Keshubaev; student confirmation pending.
Date: 2026-11-15.
