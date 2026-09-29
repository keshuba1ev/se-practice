# AI Usage Disclosure — Week 02

## 1. The tool under test

| | |
| --- | --- |
| Assistant | ChatGPT |
| Exact model name | GPT-6 Astra (Лёгкое), as shown in the student's screenshot |
| Plan (free / paid) | Paid (ChatGPT Plus) |
| Dates of the four runs | 2026-09-30 (Asia/Qyzylorda) |

## 2. What it produced

| Prompt | File it produced | Edited by me afterwards? |
| --- | --- | --- |
| A | `week-02/code/prompt_a.py` | No; code block copied exactly. |
| B | `week-02/code/prompt_b.py` | No; code block copied exactly. |
| C | `week-02/code/prompt_c.py` | No; implementation and tests copied exactly, in their original order. |
| D | `week-02/code/prompt_d.py` | No; implementation and tests copied exactly, in their original order. |

The model's surrounding prose was not inserted into executable `.py` files. Its assumptions and explanations are described in `lab-report.md`; the user's complete replies remain in the chat history. The given `tests/test_analyze_marks.py` was copied without modification. No generated code was repaired before testing.

## 3. Any other AI use in this lab

| Tool | Used for | Which file or section |
| --- | --- | --- |
| Codex workspace assistant | Drafted the combined Prompt D from A–C findings; copied code blocks, ran the provided harness, and assembled the report using its actual terminal output. | `lab-report.md`, especially sections 5–8; `code/` file placement. |
| Codex workspace assistant | Drafted this disclosure and organized the Git commits and pull request. | `AI_USAGE.md`, Git workflow. |

The four code responses under comparison came from the same ChatGPT model identified above. Codex's writing and repository assistance is disclosed separately; it did not rewrite the model's code.

## 4. Declarations

- **Every prompt was sent in a fresh chat, and the outputs were saved before any editing:** Yes, based on the student's reported workflow; code was copied without edits.
- **The test results in section 6 of `lab-report.md` are real output from real runs:** Yes.
- **Everything I submitted, I can explain and defend in class:** Student to confirm personally before submission.

**Anything I accepted from the AI without fully understanding it:** Student to review the `validate` function, pass percentage calculation, and test verdicts before signing.

Signed: Abylai Keshubaev (confirm after review)  
Date: 2026-09-30
