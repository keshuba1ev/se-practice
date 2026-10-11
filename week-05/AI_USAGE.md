# AI Usage Disclosure — Week 05

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT (web) | GPT-6, Instant mode | Plan, first version, focused critique in one new chat | Original function and unedited replies in lab-report.md |
| ChatGPT / Codex | not displayed | AC review, restoring received line breaks, all tests, type guard, report, technical explanations, checkers and GitHub workflow | code/booking.py, code/test_booking.py, lab-report.md, AI_USAGE.md, submission.yml |

**The assistant wrote, or helped write, my tests in `code/`:** yes

Codex wrote all added tests. Expected values were derived from AC1–AC5 and the student's explicit decision to return False for non-integer request times, not copied from program outputs. The first six-case suite missed six mutations. Additional boundary, containment, later-booking and list-preservation cases caught them. Four outside-contract tests document the type policy and are correctly excluded from M checks.

**`code/original/` holds the assistant's first answer exactly as returned:** yes, as received in the student's pasted message.

The code arrived as one physical line with all statements after a comment. It was saved and remotely committed before any change. The origin of the lost line breaks is unknown; it is not attributed conclusively to the model. The original file was never repaired. The working copy received line breaks and later a type guard chosen by the student.

**Everything I submitted, I can explain and defend in class — including the overlap condition:** no

**Anything I accepted from the AI without fully understanding it:**

The student needed explanation that the numbers represent minutes after midnight and asked what the reservation is for. Independent explanation of the overlap formula, the redundant lower bound and mutation testing has not yet been demonstrated. The student selected False for non-integer input and raised the question of time for people to leave or maintenance. Codex explained that AC4 permits touching without a buffer. The conclusion and sections 9.2/9.3 were assisted, not independently written.

The extra Codex assistance is disclosed separately from the selected assistant/model used for the required prompts. No in-class work or independently authored test suite is claimed. Exact raw plan headings cause retained L1/L2 checker failures; neither checker script was edited.

Signed: pending student review
Date: 2026-10-11
