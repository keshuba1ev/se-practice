# AI Usage Disclosure — SIS #03

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Codex in ChatGPT Work | not displayed | Baseline clarification, review, tests, report organisation, reflection drafting from student answers and GitHub operations | report.md, code/test_booking.py, AI_USAGE.md, submission.yml, evidence | this SIS |
| ChatGPT (web) | GPT-6 (Instant) | Python v1 and initial plan from practice; generation response received via student paste | code/original/booking_v1.py | week-05 |
| Bolt.new | not displayed; Standard agent mode | Web v1, new critique, two focused repairs, verification plan | web/original/, web/final/, exchange records | week-06 and this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes. The first27tests are reused from Week05; Codex added exact T10, repeated T11/data equality, and bool-input tests. Expected values are derived from AC1-AC5, not from generated output. Actual runs are preserved in evidence/python-suite.txt and python-cases.json.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes, copied unchanged from the practice branches. The Python version is exactly the received one-line paste, not a reconstructed executable version. No claim is made about whether copying introduced its formatting defect.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes. Setup/input limitations are explicitly Not testable. Closest-fixture diagnostics are not substituted for fixed cases. Codex operated the tests and browser; this does not imply independent student execution.

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in section 9:** not yet confirmed by the student.

**Anything I accepted from the AI without fully understanding it:** The student initially proposed multiple days, rejecting120minutes and a preparation buffer. The fixed scope and contract were explained in conversation. Detailed source review and evidence collection were performed with assistance; the student supplied their views for section10; Codex organised them into the reflection. Independent mastery of every submitted detail has not been confirmed. The baseline is assisted and is not presented as the required unaided work.

Signed: Abylai Keshubaev (prepared with AI assistance; no handwritten signature implied)
Date: 2026-10-27
