# Datalabs Interactive Showroom

An interactive enterprise technology storytelling experience.

## Project experiences (V1)
1. Cloud & Migration Simulator — LEARN → SHOW → SELL.
2. Google Workspace — A Day at Work.
3. Ask Your Data — fragmented enterprise data to usable intelligence.

## Current state
The working application has been imported through **Phase 6D.1**.
Source snapshot: `89d992d242c471cb829573493cebcebf528171de`.
This is a snapshot import, not a copy of the original Git history.
Phase 6D.2 now has an isolated opening preview in `dist/prototypes/ask-your-data-6d2.html`. Run `npm start` and visit `/prototypes/ask-your-data-6d2.html`. The approved main experience remains unchanged. See `docs/phase-6d2-qa.md` for scope and verification limits. 68 automated tests pass; visual approval is pending.

## Run locally
Requires Node.js 18+ and Python 3. No dependency installation or backend is required.

```sh
npm start
# Open http://localhost:3000
npm test
npm run check
```

`dist/` contains the actual handwritten, buildless application source and static assets. It must be tracked and served directly.

## Next milestone
**Phase 6D.2: Ask Your Data cinematic opening scene prototype.**

Visual direction: cinematic manga sci-fi × enterprise data intelligence; midnight navy, charcoal, electric-blue gradients, restrained cyan accents, four distinct data environments, meaningful luminous connections, editorial typography.

## Development guardrails
- Preserve the existing product and approved functionality.
- Inspect the original codebase before implementation; do not rebuild from this README.
- Do not alter Cloud, Migration, Workspace, or the global shell for Phase 6D.2.
- Prototype the Ask Your Data opening scene in isolation before replacement.
- Stop at ASK → partial signals → THE ANSWER IS SCATTERED. No CONNECT or ANSWER sequence in that prototype.
- Do not add unsolicited features, AI services, backends, or dependencies.
- Verify changes and report what was and was not tested.
- Keep scope changes separate and obtain product-owner approval.

## Code and verification
- `dist/`: application, structured content, assets, state machines and rendering.
- `src/types.ts`: shared event and visibility contracts.
- `tests/`: automated model and integration coverage.
- `docs/phase-6d1-qa.md`: latest completed phase and verification limits.
- `docs/implementation-notes.md` and `QA.md`: retained historical implementation notes; later phase reports supersede earlier story descriptions.
- Import verification: 61 automated tests passed. Browser-based visual/responsive QA remains unverified.

The original deployment remains unchanged. Host-specific `.openai/hosting.json` is intentionally excluded from this portable repository; it is not needed to run or host the static application.
