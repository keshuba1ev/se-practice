# AI Usage Disclosure — Week 06

| Tool | Exact model | Used for | Files and sections |
| --- | --- | --- | --- |
| Bolt.new | not displayed; UI shows Standard agent mode | Initial app generation and four focused cleanup prompts | original/ and prototype/ source; unedited responses in lab-report.md |
| Codex in ChatGPT Work | not displayed | Predictions, browser testing, evidence capture, code review, report preparation and GitHub workflow | lab-report.md, evidence/, AI_USAGE.md and submission.yml |

**v1 was downloaded and preserved before cleanup:** yes. The first attempt exported the starter template before synchronization; it was replaced by the ready generated v1 export before any cleanup. That retained v1 was committed as b6f917b.

**The export in original/ is unedited:** yes.

**Screenshots are unedited captures:** yes. Final screenshots capture the actual preview viewport directly, including a 375 × 667 phone viewport for T9.

**All reported browser outcomes come from real runs:** yes. Strict v1 cases are Not testable because the exact fixture was absent; closest-fixture diagnostic results are described separately. Intermediate regression outputs are saved.

**Component explanation and conclusion were written without AI assistance:** no. Codex prepared them. Independent oral explanation has not been verified.

**Scope decisions:** Server-side storage was rejected. The unused Supabase dependency was removed. A misleading AI explanation about a start equal to now was rejected after T6.

**Fallback:** none; the builder used was Bolt.new.

Prepared for: Abylai Keshubaev
Date: 2026-10-18
