# Datalabs SHOWROOM — Core Experiences

Run with Node 18+ and Python 3:

    npm start

Open http://localhost:3000. No install or backend required.

    npm test
    npm run check

## Cloud SHOW journey

Choose ON-PREMISE, HYBRID or OTHER CLOUD. The selected workload starts in a fixed-capacity configuration; this is not a claim that every existing environment is fixed.

1. Trigger TRAFFIC SPIKE. A bounded animation passes through 1,000 → 3,800 → 8,200 → 15,000 requests/min. Packet density, speed, pressure, queue and application state change together. Pause/resume controls are available.
2. Escalation stops at the consequence. The presenter opens the question: “Demand changed. Your infrastructure didn't.”
3. WHAT WOULD CLOUD CHANGE? opens fixed-versus-elastic comparison at normal demand. This does not perform migration or promise real autoscaling.
4. RUN THE SAME TRAFFIC SPIKE applies identical demand to both sides. Fixed capacity stays at 2 illustrative resources; elastic capacity moves through 2 → 4 → 6 and redistributes traffic.
5. The animation stops. A separate action reveals the takeaway, then EXPLORE HOW reveals the capability layer.

Only escalation within a chosen test is timed. Question, transformation, replay, takeaway and capability reveal are presenter-controlled. Timers stop in Learn, on another route, or when the page is hidden. State survives mode switching. Reset cancels the story and restores the environment selector.

Mobile keeps scenario, systems and consequence together. Comparison stays side by side, uses compact resource paths and places secondary metrics behind a disclosure. Reduced-motion settings disable particle animation and numeric tweening.

The optional workload migration rehearsal retains DISCOVER → ASSESS → DESIGN → REPLICATE → TEST → CUTOVER → OPTIMIZE. Test must complete before cutover; source and target traffic states remain distinct. Migration rehearsal cannot bypass the business-story reveal gate.

Other scenarios show server failure, data growth, a new application and backup/recovery. The compact AE drawer changes ASK, LISTEN FOR, PROBE, CONNECT and NEXT MOVE according to the scenario. Eleven Cloud Learn modules remain available.

## Scope and architecture

- dist/content.js: scoped experiences, universe descriptions and problem-entry data
- dist/navigation.js: exact route matching and shared mode definitions
- dist/visibility.js: PUBLIC / PRESENTATION_ONLY / INTERNAL / CONFIDENTIAL rendering rules
- dist/show-session.js and dist/experience-events.js: local event contract and experience adapters
- dist/app.js: shell, routing, modes, bounded animation lifecycle and accessible event handling
- dist/cloud-model.js: deterministic state transitions, story/migration gates, scripted simulation metrics and learning content
- dist/cloud-story.js: business cause-and-effect stage, comparison and gated capability layer
- dist/cloud-view.js: learning, migration rehearsal and contextual sales rendering
- dist/style.css: responsive design and reduced-motion support
- src/types.ts: content, Cloud state and future customization contracts

Keyboard: P presentation; Escape exits presentation even from an editable control; S opens/closes Sell outside presentation; arrows follow the active story or open migration rehearsal. Required interactions and reveals retain their gates.

All three core experiences are available. Custom Magic Show is inactive. No customer data, complete portfolio, generator or infrastructure API is included. Hash routes make the static build portable.

All demand, CPU, queue, storage and resource counts are SIMULATED DATA. CPU values and capacity are an illustrative script, not a benchmark or prediction. Real scaling depends on design, policies, quotas, dependencies and startup time. No downtime, savings or SLA is guaranteed.

Presentation removes internal guidance from rendering; this is not authentication. Never include confidential data in client assets.

## Verification

See `QA.md` for the Phase 5 functional checks and the explicitly unverified browser/device checks.


## Phase 3 — A Day at Work

Workspace uses a separate presenter-paced human-workflow model; there is no Cloud timer or infrastructure simulation in this experience.

- Opening: an 08:03 customer request without an application catalog.
- Before: nine moments accumulate fragmented context across inbox, downloaded files, local edits, version copies, messages, meeting and notes.
- Transformation: return to the same email and schedule a meeting. Find shared availability, select a supported slot, add the team, Meet link and assessment, then create the simulated event. Customer response is not assumed. The subsequent meeting scene explicitly advances to a confirmed meeting-day scenario next week.
- Meet: start a conceptual conversation with Customer, AE and Presales; capture simulated requirements and open questions.
- Collaboration: compare a quick Chat with a named project Space. Discussion, meeting context, files, links and updates remain attached to the project.
- Work: open Assessment.xlsx in Sheets, apply Presales and Technical Team contributions to one working file, then carry the next action into the shared Proposal Draft in Docs.
- Gemini: summarize selected demo notes, assessment and proposal into requirements, risks, open questions and next actions. This is simulated output, not an AI API.
- Follow-up: create a short simulated Gmail draft; no send action exists.
- Final: first show the chain, then explicitly reveal the project-centered connected network.

Previous/Next preserve project state. Next cannot bypass required interactions. The main mobile scene uses a bounded reading region and preserves scroll position while interacting within that scene. File and scene changes reset the reading position. No full-workday autoplay exists.

Learn has ten modules with WHAT IT IS, WHEN TO USE IT, HOW IT CONNECTS, COMMON CUSTOMER QUESTION and TRY IT. Calendar covers nine topics; Chat/Spaces includes five classification exercises with explanations. Learn practice does not advance the customer story. The AE guide reacts to scheduling, collaboration, files and meeting/AI moments.

### Workspace files

- dist/workspace-model.js: deterministic journey state, prerequisites, learning content and stage-specific AE guidance
- dist/workspace-view.js: scene renderers, practice activities, final reveal and compact AE drawer
- dist/workspace.css: paper-and-conversation visual treatment with mobile scene layouts

### Product-reference checks

Google primary documentation was consulted on 2026-10-06. Learn modules link to relevant guidance. The UI avoids edition-wide Gemini promises, automatic external availability, automatic attachment permissions and automatic Chat deletion claims.

- https://support.google.com/calendar/answer/6294878
- https://support.google.com/calendar/answer/143753
- https://support.google.com/calendar/answer/6192039
- https://support.google.com/meet/answer/14754931
- https://support.google.com/chat/answer/7659784
- https://support.google.com/chat/answer/7664687
- https://support.google.com/chat/answer/15345722
- https://support.google.com/docs/answer/9406611

The approved Cloud and Workspace stories are retained. Other Cloud is an architecture/configuration comparison, not a provider limitation. Custom Magic Show remains inactive.

## Phase 4 — Ask Your Data

`#/show/ask-your-data` follows one supported business question across fragmented sources, record preparation, unified evidence, investigation and contextual AI assistance. Every major transition is presenter-controlled; there are no journey timers. Four question examples use a reconciled fictional dataset. Unsupported free text is explained instead of generating an invented answer. Product names appear only in the optional late capability reveal or educational Learn mode.

The dataset in `dist/data-dataset.js` reconciles revenue, regions, categories and order counts. Region/category contributions overlap and are explicitly not additive. Inventory/traffic signals are associations, not causal findings. Churn questions explicitly lack individual risk predictions. AI output is prepared simulated content, not a live model response.

`show-session.js` provides typed event names, subscriptions and a bounded 250-event in-memory page-session log. All three experiences emit observed lifecycle and interaction events; Ask Your Data also records explicit current-state choices. Pain and concern event types remain reserved. No network calls, backend capture, analytics service, localStorage, or persistent customer records. This is an extension point, not a Discovery Capture implementation. Restart clears the selected experience’s temporary state and local event history, including Reverse Discovery; other experiences are preserved.

Mobile uses one active scene with a bounded scrolling stage, persistent question and fixed presenter controls. Keyboard P / Esc controls presentation, arrows advance allowed moments, and S toggles the internal guide outside presentation. Learn contains ten modules and nine conceptual distinctions.

Validation: the Phase 5 suite includes 32 passing tests, including a fresh-visitor route through all three experiences, model gates, arithmetic, events, restarts and presentation safety. These are automated state and rendered-markup checks, not real-browser QA. See `QA.md`.


## Phase 5 — Functional consolidation

Each story engine retains its own state and approved content. A shared shell owns mode switching, presentation, restart, focus, route matching, and lifecycle events. Mode changes replace the current experience URL so reloading/bookmarking matches the visible mode; experience/page navigation uses normal hash history. Returning through The Universe preserves the current story, and a return link is available. Unknown or non-public experience routes fail closed.

Cloud escalation pauses on leaving the experience, entering Learn, opening rehearsal, or hiding the page; it requires explicit Resume. Timers are not rescheduled by unrelated interactions. Count animation runs only while needed. Story arrows support cause/consequence/reveal; migration arrows retain rehearsal gates. A separate rehearsal restart clears the migration path without erasing the demand comparison.

The shared Restart control is available in every mode and in presentation. It resets only that experience, including Learn exercises and selected example paths, removes a temporary migration-entry parameter, clears its scroll/reveal state and local events, and leaves the current mode intact. SHOW and Presentation never render the internal guide. SELL has an explicit internal label and a compact, scrollable guide.

Responsive corrections are isolated in `dist/hardening.css`: wrapping navigation, tap targets, bounded scene scrolling, safe-area space, responsive shared-file tables, guide scrolling and grid shrink constraints. No new visual identity, experience, generator, AI service, analytics or CRM integration is included.

Visibility is a rendering boundary, not authentication. CONFIDENTIAL and unknown metadata are denied; PRESENTATION_ONLY is only allowed during presentation. Client assets must never contain confidential customer or portfolio data.

The event module exports bounded snapshots and subscriptions. Each event contains a timestamp, experience, mode and step, with optional category/value/source. Payloads and subscriber copies are isolated. Completion is deduplicated until Restart; events remain only in memory. This prepares future integration without implementing Discovery Capture.
