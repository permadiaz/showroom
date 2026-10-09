# Phase 6D.2 — isolated opening prototype

## Preview and scope
Open `/prototypes/ask-your-data-6d2.html` on the published Site, or run `npm start` and open `http://localhost:3000/prototypes/ask-your-data-6d2.html`.
Canonical implementation is in `dist/prototypes/`; root `prototypes/` retains compatibility links for the earlier GitHub path. The current Ask Your Data experience and all other experiences remain unchanged. No dependencies, backend, AI or CONNECT/ANSWER sequence were added.

## Changes from GitHub dev 3c37132
- Imported the standalone preview, retaining its navy/electric-blue direction.
- Replaced the dominant slogan with the actual business question.
- Distinct lightweight SVG environments: ERP ledger, POS terminal, CRM opportunity network and spreadsheet grid.
- Connection geometry uses measured question and source positions, including mobile bottom-row routing around the upper sources.
- Bounded query pulses and one partial signal per source; stops on THE ANSWER IS SCATTERED.
- Initially hidden signals are excluded from the accessibility tree. Native controls, visible focus, Escape restart and reduced-motion fallback.
- Deterministic sequence, repeat-click guard, generation-guarded reset, pause/resume with remaining delay on visibility change, preference-change and disposal cleanup.

## Verification
68 Node tests pass, including all 61 existing tests unchanged and seven new tests covering timing, repeat interaction, reset, stale callbacks, pause/resume, reduced motion, disposal, geometry and semantic markup. JavaScript syntax and whitespace checks pass.
No supported browser QA capability is available in this managed environment. Actual desktop/mobile renders, physical keyboard/touch behavior, animation appearance and exact approved-reference fidelity are NOT visually verified. Responsive layouts are implemented, not certified. Very short viewports under the minimum stage height may scroll.

## Continuity
GitHub dev is the review branch. Main remains the approved import. This preview is not promoted into the core story. Stop here for visual review.
