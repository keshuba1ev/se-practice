# Reproduce the completed visual evidence

All five required PNGs are present. capture-manifest.json records actual settings, dimensions and SHA-256 hashes. visual-qa-ci.txt contains the real assertions and capture output.

From app/: npm ci; npx playwright install --with-deps chromium; npm run build; npm run capture:evidence.

The script starts its own HTTP preview server and produces filter-match.png, filter-empty.png, switch-a.png, switch-b.png and narrow.png. It verifies exactly matched rooms, an empty state, same-time switching with opposite decisions, blocked rejection, stale-feedback handling, duration/end-of-day boundaries and a 390×844 mobile viewport without horizontal overflow. The full-page phone capture is taller than the viewport to show controls and result. This is genuine Chromium emulation, not physical hardware testing.

The GitHub workflow uses Ubuntu 24.04, read-only repository permissions and no stored checkout credentials. Report and declaration-only commits do not trigger a recapture. Re-run check_sis.py and validate_submission.py whenever evidence/report contents change.
