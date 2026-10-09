# Phase 5 — Functional consolidation QA

The three approved story engines and current visual identity are retained. This report distinguishes executable checks from checks requiring a browser.

## Corrected

- Restart now clears Reverse Discovery, selected questions/paths, reveals and learning exercises for the selected experience. Its local event history and scroll state clear too; other experiences remain intact.
- Unified mode/presentation/restart controls; SELL is explicitly internal. Presentation always renders the customer-safe story, never the guide. Escape works even while a text/select control is focused.
- Exact routing rejects invalid paths. Mode URLs match the visible mode, and normal page/experience hash history remains usable. Skip-to-content focuses the main region without entering an invalid hash route.
- Seven problem entries lead to the relevant approved experience. Migration downtime opens rehearsal after selecting the environment; a later Restart removes that temporary entry path.
- Cloud Previous/Next now work in the demand story as well as rehearsal. Rehearsal retains test/cutover gates and has its own restart. Its return control correctly says “Return to the story.”
- Leaving Cloud, opening Learn/rehearsal, or hiding the page pauses escalation. Returning requires Resume. Unrelated interactions no longer postpone a running tick, and no empty count-animation loop runs.
- Workspace's final network reveal now supports presenter arrows. Completion events are deduplicated when reviewing a reveal.
- Coming Soon worlds explain their scope without offering dead experience links; Custom Magic Show remains an inactive preview.
- Removed obsolete generic preview/sales renderers and unused preview metadata. Extracted shared mode definitions, visibility, routing, events, Workspace AI/network content and data capability mappings.
- Responsive fixes address grid shrinking, wrapping navigation, tappable controls, scrolling guides/scenes, file-table wrapping, safe areas and small text. These changes still need device/browser confirmation.

## Executable verification

`npm test`: **32 tests passed**.

| Coverage | Verification |
|---|---|
| Home → Universe → RUN → Cloud → Restart → Learn → Sell → Present → exit | Passed rendered-markup/interaction harness |
| Universe → WORK → complete workday → final reveal → Restart | Passed rendered-markup/interaction harness |
| Universe → UNDERSTAND → question → sources → mismatch → Reverse Discovery → unify → same question → evidence → follow-up → AI → technology → next step → Restart | Passed rendered-markup/interaction harness |
| Find a Problem → relevant experience, including migration entry | Passed route validation and rendered flow |
| Experiences → three available experiences + inactive Custom Magic Show | Passed rendered-markup check |
| Repeated Restart, cross-experience isolation, invalid routes, mode URLs | Passed model and shell checks |
| Show/presentation excludes internal guidance; confidential/unknown visibility denied | Passed policy matrix and rendered checks |
| P, Escape from editable control, arrows, paused/resumed timers | Passed event-handler harness |
| Dataset totals and evidence consistency | Passed arithmetic checks |
| Local events, context, nested-copy isolation, bounded history and unsubscribe | Passed event-contract checks |

`npm run check`: JavaScript syntax checks for all runtime modules.
`node --experimental-strip-types src/types.ts`: interface syntax accepted by Node; this is not a TypeScript compiler/type-check claim.
`git diff --check`: no whitespace errors.

The harness uses controlled DOM stubs and the actual generated markup. It checks that buttons exist before activating them, honors disabled controls, and walks the real state transitions. It does not emulate CSS layout, browser history UI, touch hit testing or assistive technology.

## Browser/device verification still required

The Sites managed environment does not expose its supported control-browser capability. Under the Sites workflow, no preview browser was started or improvised. Therefore none of the following are claimed as manually verified:

| Target | Status |
|---|---|
| 360px / 390px / 430px mobile | CSS safeguards implemented; visual fit, overflow and touch behavior unverified |
| 1280px / 1440px / 1920px desktop | Existing scene proportions retained; visual framing unverified |
| Browser Back/Forward buttons, actual focus visibility, screen reader behavior | Route/event logic tested; native-browser behavior unverified |
| Browser console, font loading and animation smoothness | Static/module checks only; live-console/performance review unverified |

Use the user's final QA route for the browser pass, including repeated Restart and entering/exiting presentation at an intermediate story moment. Check all six widths, both portrait and a short viewport; confirm guide and scene scrolling never hides primary controls.

## Deliberately deferred

Art direction and visual overhaul; new experiences; Custom Magic Show generation; Discovery Capture UI; AI backend; analytics services; CRM/Odoo integration; complex authorization. V1 visibility is a rendering policy, not a confidentiality/security boundary for shipped source assets.

## Phase 6A — Cloud visual benchmark

Implemented only the core Cloud SHOW presentation. One persistent workload SVG supports demand, spatial queue, resource expansion, redistribution and held reveal moments. Finite CSS motion and a small DOM-preservation adapter replace decorative loops in this sequence. Reduced-motion styles show static evidence.

The approved `cloud-model.js` is unchanged. A separate presentation projection holds the observed 15,000 peak during presenter-controlled resource additions (2 → 3 → 4 → 5 → 6). The original model still owns replay (1,000 → 3,800 → 8,200 → 15,000), timers, migration gates and event semantics. No new timer or backend. Secondary scenarios and migration use the preserved prior Cloud renderer.

Validation: 36 tests pass, including the 32 baseline tests with only Cloud presentation-copy/markup assertions updated. Four new regression tests cover constant-demand projection without model mutation, gated technology and component inspection, freeze/replay/provider distinction, and finite-motion progress/reset. The shell integration test additionally exercises resource additions and preservation across Learn/Show/Presentation. All runtime JavaScript syntax checks pass; `git diff --check` passes.

Official Google Cloud SVGs and source provenance are in `dist/assets/google-cloud/`. Structured narrative/component content, workload/evidence/node primitives, presentation state, motion lifecycle and scoped styles are separate modules.

Responsive implementation: distinct mobile SVG geometry, viewport-bounded stage with scrollable scene details, retained bottom presenter controls, large reveal typography and compact on-demand architecture explanations. Desktop uses an open narrative/system composition. These are implementation details, not a claim of browser verification.

Known limitation: no supported browser-control capability is available in this managed environment. No screenshots, six-width viewport checks, native animation smoothness, actual touch behavior or visual acceptance test are claimed as passed. Review at 360/390/430 and 1280/1440/1920, including short-height phones; technical explanation may require internal scrolling. Source-level checks cannot establish the visual quality gate.

Intentionally unchanged: migration rehearsal, secondary scenario depth, Workspace, Ask Your Data, homepage, Universe, Experiences, Find a Problem, global shell, Learn/Sell content, event/visibility policies and business reducers. No additional experience, Discovery Capture, Custom Magic Show generator, CRM/Odoo or AI backend.

## Phase 6A focused continuity refinement

The living-system DOM subtree now survives shell renders. A stable set of 72 request identities represents qualitative demand; active density follows the existing demand stages. A compact queue forms immediately upstream of the constrained gate while other requests use processing paths. Released queued requests travel through that same gate toward available resources. The qualitative marks are not additional performance metrics. Model queue/CPU/demand values remain unchanged.

Finite Web Animations replace restarting CSS path animations. Captured request positions and animation times survive pause, mode/presentation changes and scene transitions. Freeze holds the current work; inactive stages pause their finite animations. Restart cancels old request motion. Filled resource-expansion animations are canceled when resources become inactive during replay. No new story timer or background loop was introduced.

Capacity remains presenter-controlled, 2 → 3 → 4 → 5 → 6 at constant simulated peak demand. A separate presenter action reveals “The flow finds room” after the additions. Replay and the approved business reducer remain unchanged. Technology maps onto the same distribution point, resource pool and observation branch in three presenter-controlled reveals, rather than opening another architecture diagram. Mobile keeps that system before optional component details. New Application remains a secondary scenario.

Official SVG artwork is now self-contained inline vector markup. Original geometry/colors are preserved, editor IDs removed and Compute Engine fill classes resolved to explicit fills; the original source SVG files remain unchanged. There are no product `<img>` requests or broken-image fallback labels in the benchmark. The exact cause of the previously reported browser asset-loading failure could not be verified locally; this implementation removes that separate image-fetch dependency.

Validation: 39 tests pass. Existing Phase 5 business/route/visibility/event/migration tests remain intact. Refinement tests cover stable request IDs, congestion/draining geometry, downstream queue release, explicit balance/mapping gates, inline icon completeness, freeze/resume animation time and reset cleanup. The shell harness exercises capacity and mapping actions plus Learn/Show/Presentation preservation. JavaScript syntax and whitespace checks pass. Protected business reducers, legacy migration renderer, Workspace/Data views, global style, content catalog, event adapter and visibility policy have no diff.

Browser/device limitation remains: supported browser-control tooling is unavailable, so the visual acceptance test, rendered mobile geometry, native animation smoothness and final asset appearance still require browser review. Automated model/markup checks do not replace that review. No visual acceptance pass is claimed.

## Phase 6B — Migration Rehearsal

Implemented a separate rehearsal stage and local state machine; Phase 6A main demand simulation modules/styles are unchanged. Migration opens with the current workload, progressively discovers identity/files/backup/API relationships, attaches assessment questions, and forms an illustrative target from requirements. Compute Engine, networking/VPC and Monitoring familiarity uses the existing self-contained official artwork; the data layer remains workload-specific rather than claiming a universal SAP/database target.

The same source/target SVG topology persists through rendering. Production, hollow replication-state markers and the dashed test path have distinct identities. Production remains at source through replication and all five target tests. A two-question presenter-controlled freeze precedes explicit cutover. Finite motion changes the active production path while retaining the source; verification is required before optimization. The final reveal and optional assessment/workshop choices are manual. No backend, booked meeting, AI generation or inferred buying signal was added.

Source retention/rollback remains illustrative, not an automated recovery claim. Downtime and migration-method disclaimers stay visible. Migration-specific internal guidance appears only in Sell and is excluded by the existing presentation policy.

Desktop uses current/target horizontally; mobile uses a distinct vertically arranged topology, side routes and a scrollable scene region with presenter controls outside it. CSS is scoped to migration. Finite animations preserve pause state and do not replay finished motion on shell rerenders. Leaving the scene pauses those animations; no additional story timer is used.

Events remain on the Phase 5 local session bus. Optional `scope` and `resetScope` isolate rehearsal completion/reset from main Cloud completion and other experiences. Resetting all Cloud still clears its scopes. The TypeScript event contract reflects these backward-compatible additions.

Validation: 47 automated tests pass (39 prior tests unchanged plus 8 focused migration tests). Coverage includes gates, source production during preparation/testing, two-question reveal, explicit cutover, retained source, verification-before-optimization, Previous after cutover, repeated local/global restart, pause/resume, desktop/mobile path endpoints, mode/presentation preservation, return to the saved main Cloud moment, cross-experience isolation, scoped completion and reset, internal guidance separation, and completed finite animation behavior. Runtime syntax, interface syntax and whitespace checks pass.

Verification limits: no supported browser-control skill is available in this managed environment. A standalone SVG raster inspection also could not run because its renderer was unavailable; no screenshot/visual pass is claimed. Final animation timing, diagram label spacing, 360/390/430 mobile and 1280/1440/1920 desktop fit, native touch/focus behavior and visual acceptance still need review on the Site. Passing model/markup tests is not evidence that the visual acceptance gate passed.

Intentionally unchanged: Phase 6A main Cloud story/reducer/primitives/motion/styles; Workspace; Ask Your Data; homepage; Universe; Experiences; Find a Problem; global Learn and Sell design. Stop at Phase 6B; no Discovery Capture, Custom Magic Show generator, CRM/Odoo or AI backend.
