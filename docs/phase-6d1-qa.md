# Phase 6D.1 — Ask Your Data simplification

## Scope
Only Ask Your Data's SHOW, its state model, local signal mapping, and its integration hooks changed. Cloud, Migration, Workspace, global navigation, palette and visibility architecture remain unchanged. Fifteen Data Learn modules remain available.

## Removed
The prior 12-scene sequence and layered visual flags were replaced. No introductory reveal, editable/supported-question picker, source-inspection gates, mismatch identifiers, four preparation steps, multiple evidence dashboards, deep follow-up investigation, AI summary, duration questionnaire or mandatory technology chapter in SHOW.

## State contract
QUESTION → FRAGMENTED → CONNECTING → CONNECTED → ANSWER → EVIDENCE → DISCOVERY.
Only CONNECTING completes automatically after 2.2 seconds. Reduced-motion users receive the complete connected state immediately. Previous skips CONNECTING when moving back from CONNECTED. The presenter advances all other story states. Technical exploration is a guarded optional branch at EVIDENCE/DISCOVERY; Previous closes it without losing the underlying story. Restart returns a fresh initial state and resets only Data events.

One static question and exactly four source identities are retained. The second ask briefly traverses the connected context before the answer and three-branch finding appear. Discovery has six validated choices, one local event per changed explicit selection, no inferred pain and no second questionnaire. The already-answerable selection does not force an opportunity.

## Example consistency
New SHOW benchmark is an explicitly simulated, same-period five-branch cohort. Revenue 1,000 → 916 illustrative million (−8.4%); first three branches account for 82 of the total 84 decline. Transactions 10,000 → 8,900 (−11%). Branch visits 100,000 → 114,000 (+14%). Transactions per visit therefore decline. This is an investigative signal, not demonstrated causality. Older supplemental synthetic-dataset reconciliation tests remain independent of this new benchmark.

## Verification
- 61 automated tests pass across the product; all JavaScript syntax checks pass.
- Real app event-handler tests with mocked DOM/timers exercise the Data journey, mode changes, presentation, navigation, visibility changes, canceled callbacks and repeated reset.
- Fresh-visitor regression covers Universe → Cloud modes → Workspace full workday → simplified Data → Problems → Experiences / Coming Soon.
- DOM identity checks cover persistent question and four-source world.
- Source/style review: bounded presentation stage, no scroll container in core SHOW, evidence recomposed to a 2×2 rail on mobile, six discovery choices in two columns, finite animation only. Technical exploration and Learn can scroll.
- Desktop 1280/1440/1920 and mobile 360/390/430 are design targets, NOT browser-verified results. Managed runtime has no supported control-browser. No screenshots, real touch tests or human non-technical comprehension test were performed.

## Review limits
Visual clipping, exact animation appearance and comprehension need browser/user review. No known failing functional tests. Stop at Phase 6D.1; no Phase 6E work.
