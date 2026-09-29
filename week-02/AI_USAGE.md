# AI Usage Disclosure — Week 02

## 1. The tool under test

| | |
| --- | --- |
| Assistant | ChatGPT |
| Exact model name | GPT-6 Astra (Лёгкое) |
| Plan (free / paid) | Paid (ChatGPT Plus) |
| Dates of the four runs | 2026-09-30 (Almaty, Kazakhstan) |

## 2. What it produced

| Prompt | File it produced | Edited by me afterwards? |
| --- | --- | --- |
| A | `week-02/code/prompt_a.py` | No; code block copied exactly. |
| B | `week-02/code/prompt_b.py` | No; code block copied exactly. |
| C | `week-02/code/prompt_c.py` | No; implementation and tests copied exactly, in their original order. |
| D | `week-02/code/prompt_d.py` | No; implementation and tests copied exactly, in their original order. |

I copied the code blocks into `.py` files without changing them. The surrounding explanations are reflected in `lab-report.md`, and the complete replies remain in the chats. I also kept the supplied test harness unchanged.

## 3. Any other AI use in this lab

| Tool | Used for | Which file or section |
| --- | --- | --- |
| Codex workspace assistant | Helped draft Prompt D using the results of A–C, copy code blocks, run the harness, and write the report from actual output. | `lab-report.md`, especially sections 5–8; placement of files in `code/`. |
| Codex workspace assistant | Helped write this disclosure and create the Git commits and PR. | `AI_USAGE.md`, Git workflow. |

All four code responses being compared came from the ChatGPT model above. Codex helped with the write-up and repository work; it did not change the four code outputs.

## 4. Declarations

- **Every prompt was sent in a fresh chat, and the outputs were saved before any editing:** Yes; code was copied without edits.
- **The test results in section 6 of `lab-report.md` are real output from real runs:** Yes.
- **Everything I submitted, I can explain and defend in class:** To confirm after my own review.

**Anything I accepted from the AI without fully understanding it:** I need to review the `validate` function, pass percentage calculation, and test verdicts before signing.

Signed: Abylai Keshubaev (pending my review)  
Date: 2026-09-30
