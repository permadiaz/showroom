# Phase 6D.2 — functional recovery

## Root causes
- Cinematic artwork existed only in the separate opening prototype, not the complete main experience.
- Whole-app rendering restarted finished animations by calling play indiscriminately.
- Leaving CONNECTING reset its timeout while the visual scene was retained, causing timing drift. The app also passed the other experience's scene to the Data scheduler on navigation.
- Fixed SVG coordinates did not follow the responsive source layout.
- Claims were independently authored strings rather than derived from the illustrative benchmark.

## Implementation
The main route now uses four persistent SVG source environments. ASK reveals partial signals; CONNECT forms measured connections; ASK AGAIN carries the same scene into the answer. Evidence derives from the benchmark: revenue 1000 to 916, transactions 10000 to 8900, traffic 100000 to 114000. Three branches account for 82 of the total 84 illustrative revenue decline. These are example data, not customer outcomes or causal proof.

The scheduler retains remaining time during interruption, rejects stale callbacks, completes once, and resets independently. Only current running animations resume; finished and detached animations do not restart. Discovery selection survives backward navigation and clears on Restart. Existing event and visibility mechanisms remain in place.

## Files
- dist/app.js (Data timer integration only)
- dist/data-question-content.js
- dist/data-question-motion.js
- dist/data-question-view.js
- dist/data-question.css
- dist/data-source-art.js (new)
- tests/data-recovery.test.mjs (new)
- package.json (syntax check includes source art)
- docs/phase-6d2-recovery.md

## Verification
74 automated tests pass, including the existing product-level journey and cross-experience regressions. Six new tests cover remaining timer duration, exactly-once completion, reduced motion, render retention, persistent fragment visibility, responsive SVG geometry, and twenty repeated journeys. Syntax checks and git diff --check pass. Existing tests were not weakened.

These tests include simulated DOM/event handlers, not a real browser renderer. Browser visual QA is unavailable in the managed environment. Desktop viewport fit, mobile clipping/typography, actual focus rendering, and animation aesthetics still require visual review. Mobile scene content can scroll internally on short viewports to preserve access. No known failing automated behavior remains; this is not a claim of completed visual acceptance.

## Preview
Use the main route /#/show/ask-your-data. The separate /prototypes/ask-your-data-6d2.html remains an opening-only historical preview.
Locally: npm test; npm run check; npm start. Open http://localhost:3000/#/show/ask-your-data.

Walk through ASK → CONNECT → ASK AGAIN → SHOW ME WHY → discovery. Select a response, go Previous and forward, and confirm it remains selected. Restart twice. Repeat while switching Learn/Show/Sell and entering/exiting Presentation with P/Escape. Verify arrows and touch controls. Review at 360/390/430px and 1280/1440/1920px; these sizes have not been visually verified here.

No Phase 6E, backend, dependencies, or changes to other experience story engines.
