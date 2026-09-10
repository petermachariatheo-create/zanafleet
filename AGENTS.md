# ZanaFleet Agent Instructions

## Active Workstream

**Current Objective:** Transform `apps/web` from a static MSW-backed demo into a live, production-ready Multi-Vendor Delivery Management System frontend.

**Progress Tracker:** `MVD_TRACKING.md` (this repository root)

**Execution Mode:** Linear atomic steps. Do not skip steps. Do not batch unrelated changes. Each step must be committed before the next begins.

## Critical Rules

1. **Single Step at a Time:** Only execute the next pending step from `MVD_TRACKING.md`. Do not plan ahead or refactor beyond the current step's scope.
2. **Commit After Every Step:** After completing a step, run `git add -A && git commit -m "<step commit message>"`. Do not accumulate uncommitted changes across steps.
3. **Verify Before Advancing:** Run the verification command listed in the step before marking it complete. If verification fails, fix before proceeding.
4. **No Structural Rewrites:** All changes must be incremental. Do not rename folders, move files, or change architecture unless the current step explicitly requires it.
5. **Preserve Backward Compatibility:** If a step changes a service API, ensure all existing consumers of that service still compile and pass tests.
6. **Reference the Tracker:** At the start of every session, read `MVD_TRACKING.md`. At the end of every session, update the `Status` column in the tracking table for the completed step.
7. **God Class Refactoring:** If a file exceeds 500 lines, you are authorized to refactor it into smaller, more manageable files or classes. This refactoring must:
   - Preserve all original method signatures and exports to ensure backward compatibility with existing tests and consumers
   - Maintain core functionality unchanged; only reorganize implementation, do not alter behavior
   - Verify the refactored code compiles and passes relevant tests before proceeding
   - Document the split in the commit message, e.g., `refactor(web): split large service file into focused modules`

## Context Anchors

- **Frontend app:** `apps/web`
- **Backend API:** `apps/api` (NestJS, runs on `localhost:3000`)
- **Test accounts:** See `apps/web/README.md` for DevAccountSwitcher credentials
- **Auth:** Keycloak OIDC via `keycloak-js` (integration starting at Step 30)
- **Real-time:** NATS WebSocket (integration starting at Step 32)
- **Mock layer:** MSW (to be disabled at Step 28)

## When Starting a New Session

1. Read `MVD_TRACKING.md`.
2. Identify the first step with `Status: Pending` and no blockers.
3. Announce: "Continuing MVD integration from Step N: <step title>."
4. Execute only Step N.
5. Update `MVD_TRACKING.md` `Status` to `Completed` and increment `Completed Tasks` count.
6. Commit with the exact message from the step.

## When Blocked

1. Do not skip the blocked step.
2. Document the blocker in the `Blockers` column of `MVD_TRACKING.md`.
3. Halt execution. Do not proceed to subsequent steps.
4. Notify the user with: "Blocked at Step N: <description>. Waiting for resolution."

## Quality Gates

- TypeScript: `npm run type-check` must pass after every service migration step.
- Lint: `npm run lint:check` must pass before committing.
- Tests: `npm test -- <affected-path>` must pass for the changed module.
- Build: `npm run build` must pass at Steps 28, 29, 33, and 34.

## Out of Scope

- Backend feature development (unless explicitly required by a step's collaborative requirement).
- Database schema changes.
- New MUI component creation (reuse existing `components/common`).

## Escalation

If a step requires a backend change, document it in `Collaborative Requirements` and `Blockers`, then halt. Do not implement backend changes without explicit user direction.
