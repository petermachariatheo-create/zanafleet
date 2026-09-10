# Multi-Vendor Delivery System — Frontend Live Integration Tracker

## Progress Overview

| Metric | Count |
|--------|-------|
| **Completed Tasks** | 23 |
| **In-Progress Tasks** | 0 |
| **Pending Tasks** | 11 |
| **Blocked Tasks** | 0 |

---

## Step Sequence (Linear Execution Order)

> Execute steps in strict numerical order. Each step must be **complete, verified, and committed** before proceeding to the next. No step depends on a future step — only on the immediately preceding step.

### Step 1: Create centralized API client utility
- **Action:** Create `apps/web/src/utils/apiClient.ts`
- **Details:** Implement `apiFetch()` wrapper that injects `Authorization: Bearer <token>`, `X-Workspace-Id`, and `Content-Type` headers. Use `AuthContext` for token and `user.activeWorkspaceId` for workspace. Throw normalized `ApiError` on non-2xx.
- **Verification:** `npm run type-check` passes; `apiClient.ts` exports `apiFetch`, `getApiUrl`, `ApiError`.
- **Commit message:** `feat(web): add centralized apiClient with auth and workspace headers`

### Step 2: Update AuthContext to consume apiClient
- **Action:** Refactor `apps/web/src/contexts/AuthContext.tsx` to use `apiClient` instead of direct `fetch` in `login`, `logout`, `getCurrentUser`.
- **Details:** Import `apiClient` and replace inline `fetch` calls. Keep token persistence in `localStorage` unchanged.
- **Verification:** `npm start` runs; login via DevAccountSwitcher still works; network tab shows `Authorization` header.
- **Commit message:** `refactor(web): AuthContext uses apiClient`

### Step 3: Add token refresh interceptor
- **Action:** Extend `apps/web/src/utils/apiClient.ts` with automatic token refresh on 401.
- **Details:** Detect `WWW-Authenticate` or 401 response, call `/auth/refresh`, retry original request once. Store refreshed token in `AuthContext`.
- **Verification:** Manually expire token in devtools; observe automatic refresh without full logout.
- **Commit message:** `feat(web): add automatic token refresh interceptor`

### Step 4: Migrate authApi.ts to apiClient
- **Action:** Update `apps/web/src/services/authApi.ts` to use `apiClient`.
- **Details:** Replace direct `fetch` with `apiClient`. Ensure `login`, `logout`, `getCurrentUser`, `getProfile` all route through the client.
- **Verification:** `npm test -- src/services/authApi.ts` passes.
- **Commit message:** `refactor(web): authApi uses apiClient`

### Step 5: Migrate signupApi.ts to apiClient
- **Action:** Update `apps/web/src/services/signupApi.ts` to use `apiClient`.
- **Details:** Replace direct `fetch` with `apiClient`. Keep `ApiError` re-export.
- **Verification:** `npm test -- src/services/signupApi.ts` passes.
- **Commit message:** `refactor(web): signupApi uses apiClient`

### Step 6: Migrate deliveryApi.ts to apiClient + fix DTOs
- **Action:** Update `apps/web/src/services/deliveryApi.ts` to use `apiClient` and align `RequestDeliveryInput` with backend DTO.
- **Details:** Replace `fetch` with `apiClient`. Update `RequestDeliveryInput` to match `RequestDeliveryDto` from `deliveries.controller.ts` (ensure `pickupLocationId`/`dropoffLocationId` optional, add `isScheduled`, `scheduledPickupTime`).
- **Verification:** `npm run type-check` passes; `RequestDeliveryPage` form submits without TypeScript errors.
- **Commit message:** `refactor(web): deliveryApi uses apiClient and aligns DTOs`

### Step 7: Migrate orderApi.ts to apiClient + expand DTOs
- **Action:** Update `apps/web/src/services/orderApi.ts` to use `apiClient` and add missing order operations.
- **Details:** Replace `fetch` with `apiClient`. Add `getOrderById`, `updateOrderStatus`, `getOrderHistoryPaginated`. Align `PlaceCustomerOrderInput` with backend `PlaceCustomerOrderInput` from `order.coordinator.ts`.
- **Verification:** `npm test -- src/services/orderApi.ts` passes.
- **Commit message:** `refactor(web): orderApi uses apiClient and expands coverage`

### Step 8: Migrate dashboardApi.ts to apiClient and remove fixture fallbacks
- **Action:** Update `apps/web/src/services/dashboardApi.ts` to use `apiClient` and replace all hardcoded fixture data with real API calls.
- **Details:** Replace `fetch` with `apiClient`. Remove `sampleEarningsTrend`, `sampleDeliveryVolumes`, `sampleSettlementStatusBreakdown`, and all other mock data arrays. Ensure all dashboard functions return real API responses.
- **Verification:** `npm run type-check` passes; `BusinessDashboard` loads without console errors.
- **Commit message:** `refactor(web): dashboardApi uses apiClient and removes mock fixtures`

### Step 9: Migrate customerApi.ts to apiClient and verify response shapes
- **Action:** Update `apps/web/src/services/customerApi.ts` to use `apiClient` and align return types with backend `CustomerController`.
- **Details:** Replace `fetch` with `apiClient`. Update `Customer` interface to include `customerId`, `businessId`, `name`, `phoneNumber`. Update `CustomerActivity` interface to match `CustomerActivityProjection`. Add `getBusinessAvailability` with correct return type `BusinessAvailabilityProjection[]`.
- **Verification:** `npm test -- src/services/customerApi.ts` passes; `ShopPage` customer search returns typed results.
- **Commit message:** `refactor(web): customerApi uses apiClient and aligns types`

### Step 10: Migrate geoApi.ts to apiClient and verify autocomplete
- **Action:** Update `apps/web/src/services/geoApi.ts` to use `apiClient` and validate `Address` type against backend geo responses.
- **Details:** Replace `fetch` with `apiClient`. Ensure `Address` has `formattedAddress`, `latitude`, `longitude`, `locationId`. Add error handling for empty results.
- **Verification:** `npm test -- src/services/geoApi.ts` passes; address autocomplete in `RequestDeliveryPage` works.
- **Commit message:** `refactor(web): geoApi uses apiClient`

### Step 11: Migrate searchApi.ts to real backend endpoint
- **Action:** Update `apps/web/src/services/searchApi.ts` to call real `/search` endpoint via `apiClient`.
- **Details:** Replace MSW-backed mock with `apiClient.get('/search', { params })`. Align `SearchResult` type with `SearchResults` from backend. Remove mock `searchBusinesses`, `searchRiders` if they were stubs.
- **Verification:** `npm test -- src/services/searchApi.ts` passes; `SearchResultsPage` returns live data when backend is running.
- **Commit message:** `refactor(web): searchApi uses real backend endpoint`

### Step 12: Create riderApi.ts with real endpoints
- **Action:** Create `apps/web/src/services/riderApi.ts` with full CRUD and availability operations.
- **Details:** Export `getRider`, `updateRider`, `getRiderAvailability`, `setRiderAvailability`, `getRiderDocuments`. Use `apiClient`. Types from `@zanafleet/contracts` (`Rider`, `VehicleType`).
- **Verification:** `npm run type-check` passes; `RiderDashboard` settings tab can fetch rider profile.
- **Commit message:** `feat(web): add riderApi service with real endpoints`

### Step 13: Create saccoApi.ts with real endpoints
- **Action:** Create `apps/web/src/services/saccoApi.ts` with Sacco CRUD and member operations.
- **Details:** Export `getSacco`, `updateSacco`, `getSaccoMembers`, `addSaccoMember`, `getSaccoQueue`. Use `apiClient`. Types from contracts.
- **Verification:** `npm run type-check` passes; `OperatorDashboard` queue tab can fetch sacco data.
- **Commit message:** `feat(web): add saccoApi service with real endpoints`

### Step 14: Migrate notificationsApi.ts to apiClient and real endpoints
- **Action:** Update `apps/web/src/services/notificationsApi.ts` to use `apiClient` and call real notification endpoints.
- **Details:** Replace MSW mocks with `apiClient.get('/notifications')`, `apiClient.post('/notifications/preferences')`, etc. Align `Notification` type with backend `NotificationEntity`.
- **Verification:** `npm test -- src/services/notificationsApi.ts` passes; `MessagingPage` loads real notification list.
- **Commit message:** `refactor(web): notificationsApi uses apiClient and real endpoints`

### Step 15: Migrate messagingApi.ts to apiClient and real endpoints
- **Action:** Update `apps/web/src/services/messagingApi.ts` to use `apiClient` and call real messaging endpoints.
- **Details:** Replace MSW mocks with `apiClient.get('/messages')`, `apiClient.post('/messages')`, etc. Align `Message` type with backend message entity.
- **Verification:** `npm test -- src/services/messagingApi.ts` passes; `MessagingPage` can send and receive messages via API.
- **Commit message:** `refactor(web): messagingApi uses apiClient and real endpoints`

### Step 16: Migrate aiApi.ts to apiClient and backend proxy
- **Action:** Update `apps/web/src/services/aiApi.ts` to use `apiClient` and call real AI backend proxy.
- **Details:** Replace MSW mock with `apiClient.post('/ai/chat', { message, context })`. Ensure streaming response handling if backend supports SSE.
- **Verification:** `npm test -- src/services/aiApi.ts` passes; `AIAssistantPage` sends messages and receives responses.
- **Commit message:** `refactor(web): aiApi uses apiClient and backend proxy`

### Step 17: Migrate mediaApi.ts to apiClient
- **Action:** Update `apps/web/src/services/mediaApi.ts` to use `apiClient` and support upload progress.
- **Details:** Replace direct `fetch` with `apiClient`. Add `onUploadProgress` callback using `XMLHttpRequest` or `axios` if needed. Align with `MediaController` endpoints.
- **Verification:** `npm test -- src/services/mediaApi.ts` passes; profile picture upload works.
- **Commit message:** `refactor(web): mediaApi uses apiClient`

### Step 18: Migrate settingsApi.ts to apiClient
- **Action:** Update `apps/web/src/services/settingsApi.ts` to use `apiClient`.
- **Details:** Replace direct `fetch` with `apiClient`. Ensure user settings CRUD aligns with backend user/actor endpoints.
- **Verification:** `npm test -- src/services/settingsApi.ts` passes; `SettingsPage` can update preferences.
- **Commit message:** `refactor(web): settingsApi uses apiClient`

### Step 19: Update RequestDeliveryPage to use real APIs
- **Action:** Refactor `apps/web/src/pages/RequestDelivery/index.tsx` to consume `deliveryApi.requestDelivery` and `geoApi.searchAddress` with live data.
- **Details:** Remove hardcoded Nairobi coordinates. Use address search results for lat/lng. Add loading skeletons and error states. Validate form with backend DTO constraints.
- **Verification:** `npm start`; fill form with real addresses; submit returns `deliveryId` and `orderId`.
- **Commit message:** `feat(web): RequestDeliveryPage uses real delivery and geo APIs`

### Step 20: Update ShopPage to use real APIs
- **Action:** Refactor `apps/web/src/pages/Shop/index.tsx` to consume `customerApi.getCustomerActivity`, `dashboardApi.getMyBusinesses`, and `orderApi.placeCustomerOrder` with live data.
- **Details:** Replace `fetch('/api/businesses')` with `dashboardApi.getMyBusinesses()`. Remove hardcoded mock businesses. Add loading and error states. Ensure cart submission uses `placeCustomerOrder`.
- **Verification:** `npm start`; browse real businesses; place order returns success.
- **Commit message:** `feat(web): ShopPage uses real business and order APIs`

### Step 21: Update OrderTrackingPage to use real APIs
- **Action:** Refactor `apps/web/src/pages/OrderTracking/index.tsx` to call `deliveryApi.getDeliveryTracking` or equivalent real endpoint.
- **Details:** Remove `setTimeout` mock. Fetch real delivery by `id` param. Display actual status, rider, merchant, customer coordinates. Add polling or WebSocket hook for live updates (polling first).
- **Verification:** `npm start`; navigate to `/order/<real-id>/track`; see live data.
- **Commit message:** `feat(web): OrderTrackingPage uses real delivery tracking API`

### Step 22: Update ShopperDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/ShopperDashboard/index.tsx` to consume `customerApi.getShopperOrders` and `customerApi.getShopperInsights` with live data.
- **Details:** Replace mock order arrays with `getShopperOrders(user.id)`. Replace mock insights with `getShopperInsights(user.id, businessId)`. Add tabs: Orders, Insights, Favorites.
- **Verification:** `npm start`; login as Customer; dashboard shows real orders and insights.
- **Commit message:** `feat(web): ShopperDashboard uses real customer APIs`

### Step 23: Update BusinessDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/BusinessDashboard/index.tsx` to consume `dashboardApi.getBusinessOverview`, `getBusinessDeliveries`, `getBusinessBillingSummary` with live data.
- **Details:** Replace fixture data in all tabs (overview, deliveries, request, active, billing, customers). Add error boundaries. Ensure `requestBusinessDelivery` uses real `deliveryApi.requestDelivery`.
- **Verification:** `npm start`; login as BusinessOwner; all tabs show live metrics and lists.
- **Commit message:** `feat(web): BusinessDashboard uses real dashboard APIs`

### Step 24: Update RiderDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/RiderDashboard/index.tsx` to consume `dashboardApi.getRiderActiveDeliveries`, `getRiderDeliveryHistory`, `getRiderEarnings` with live data.
- **Details:** Replace mock active deliveries and earnings charts. Add accept/decline actions that call backend assignment endpoints. Add status update actions.
- **Verification:** `npm start`; login as Rider; dashboard shows real active jobs and earnings.
- **Commit message:** `feat(web): RiderDashboard uses real rider APIs`

### Step 25: Update AdminDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/AdminDashboard/index.tsx` to consume `dashboardApi.getAdminMetrics`, `getSettlements`, etc.
- **Details:** Replace static metrics with real `GET /dashboards/admin/metrics`. Wire settlements table to `getSettlements`. Wire policies table to policy API (create if missing).
- **Verification:** `npm start`; login as Admin; dashboard shows live platform metrics.
- **Commit message:** `feat(web): AdminDashboard uses real admin APIs`

### Step 26: Update SupportDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/SupportDashboard/index.tsx` to consume real dispute, refund, and payment lookup endpoints.
- **Details:** Replace static tables with API calls. Add search by order ID, customer ID. Add refund action that calls backend.
- **Verification:** `npm start`; login as Support; queue shows live disputes.
- **Commit message:** `feat(web): SupportDashboard uses real support APIs`

### Step 27: Update OperatorDashboard to use real APIs
- **Action:** Refactor `apps/web/src/pages/OperatorDashboard/index.tsx` to consume `saccoApi` and rider matching endpoints.
- **Details:** Replace mock queue with real sacco member list. Wire candidate matching to backend. Add route optimization view (if endpoint exists).
- **Verification:** `npm start`; login as SaccoAdmin; dashboard shows live fleet queue.
- **Commit message:** `feat(web): OperatorDashboard uses real operator APIs`

### Step 28: Disable MSW in production build
- **Action:** Update `apps/web/craco.config.js` to set `REACT_APP_USE_MSW=false` in production environment.
- **Details:** Ensure `msw` worker is not bundled in production. Verify `src/index.tsx` respects the env flag.
- **Verification:** `npm run build`; inspect bundle for `msw` references; confirm none in production chunks.
- **Commit message:** `chore(web): disable MSW in production builds`

### Step 29: Remove /demo/components route from production App.tsx
- **Action:** Update `apps/web/src/App.tsx` to conditionally render `/demo/components` only in development.
- **Details:** Wrap `<Route path="/demo/components" ...>` in `process.env.NODE_ENV !== 'production'` check. Alternatively, remove route and keep page file for dev-only imports.
- **Verification:** `npm run build && npm start -s`; navigate to `/demo/components`; confirm 404 or redirect.
- **Commit message:** `chore(web): remove demo route from production`

### Step 30: Add Keycloak token refresh integration
- **Action:** Integrate `keycloak-js` token refresh into `AuthContext` and `apiClient`.
- **Details:** Initialize Keycloak instance with `onLoad: 'login-required'` or manual login. Hook `keycloak.token` into `apiClient` headers. Refresh token on 401 using Keycloak adapter.
- **Verification:** `npm start`; login via Keycloak; token refreshes automatically on expiry.
- **Commit message:** `feat(web): integrate Keycloak token refresh`

### Step 31: Add role-based route guards per dashboard
- **Action:** Update `apps/web/src/components/ProtectedRoute/ProtectedRoute.tsx` to enforce role requirements.
- **Details:** Add `requiredRoles` prop. Redirect to `/` or show 403 if user lacks required role. Apply to `/dashboard/admin/*` (Admin), `/dashboard/business/*` (BusinessOwner/Business), etc.
- **Verification:** `npm start`; login as Rider; attempt to navigate to `/dashboard/admin`; confirm redirect.
- **Commit message:** `feat(web): add role-based route guards`

### Step 32: Integrate NATS WebSocket for real-time delivery updates
- **Action:** Create `apps/web/src/hooks/useDeliveryUpdates.ts` and wire to backend NATS gateway.
- **Details:** Subscribe to `delivery.<deliveryId>.updates` channel. Update local delivery state in real-time. Fallback to polling if WebSocket unavailable.
- **Verification:** `npm start`; open two browser tabs; update delivery status in one; see live update in other.
- **Commit message:** `feat(web): add real-time delivery updates via NATS WebSocket`

### Step 33: Add offline caching with Service Worker
- **Action:** Implement Workbox-based service worker for caching static assets and API read responses.
- **Details:** Cache `src/`, `static/`, and `index.html` with stale-while-revalidate. Cache `GET /api/search` and `GET /api/businesses` with cache-first. Show offline banner when network unavailable.
- **Verification:** `npm run build && npm start -s`; disconnect network; app loads cached shell; cached API responses available.
- **Commit message:** `feat(web): add offline caching with service worker`

### Step 34: Final end-to-end verification
- **Action:** Run full test suite, lint, type-check, and manual smoke test across all roles.
- **Details:**
  - `npm run lint:check`
  - `npm run type-check`
  - `npm test`
  - Manual: login as each role (Admin, Business, Rider, Customer, Support, Operator); verify every dashboard loads live data; verify order placement flow end-to-end.
- **Verification:** All checks pass; zero console errors; all pages display live data.
- **Commit message:** `chore(web): final verification and cleanup`

---

## Tracking Table

| Step | Task | Status | Blockers | Collaborative Requirements | Key Considerations |
|------|------|--------|----------|----------------------------|-------------------|
| 1 | Create apiClient.ts | Completed | None | None | Must not break existing fetch calls |
| 2 | Update AuthContext | Completed | None | None | Keep localStorage token flow intact |
| 3 | Add token refresh | Completed | None | Backend: `/auth/refresh` endpoint implemented | Token refresh TTL must align with backend |
| 4 | Migrate authApi.ts | Completed | None | None | Keep `ApiError` shape unchanged |
| 5 | Migrate signupApi.ts | Completed | None | None | Signup flow must remain testable |
| 6 | Migrate deliveryApi.ts | Completed | None | Backend: DTO alignment review | `RequestDeliveryDto` changes require backend sign-off |
| 7 | Migrate orderApi.ts | Completed | None | Backend: verify `PlaceCustomerOrderInput` | Payment flow depends on this |
| 8 | Migrate dashboardApi.ts | Completed | None | Backend: all dashboard endpoints return 200 in local env | Largest service; highest risk |
| 9 | Migrate customerApi.ts | Completed | None | None | `CustomerActivityProjection` must be populated |
| 10 | Migrate geoApi.ts | Completed | None | Backend: geo endpoints return lat/lng | Autocomplete UX depends on response shape |
| 11 | Migrate searchApi.ts | Completed | None | Backend: Postgres FTS + PostGIS working | Search relevance tuning may be needed |
| 12 | Create riderApi.ts | Completed | None | None | Rider availability toggle needs backend endpoint |
| 13 | Create saccoApi.ts | Completed | None | None | Sacco queue endpoint must support pagination |
| 14 | Migrate notificationsApi.ts | Completed | None | Backend: notification preferences CRUD | Real-time push requires service worker |
| 15 | Migrate messagingApi.ts | Completed | None | Backend: NATS message persistence | Chat history endpoint must exist |
| 16 | Migrate aiApi.ts | Completed | None | Backend: AI proxy endpoint stable | Streaming SSE adds complexity |
| 17 | Migrate mediaApi.ts | Completed | None | Backend: signed URL generation working | Upload progress needs XHR or axios |
| 18 | Migrate settingsApi.ts | Completed | None | None | Settings must persist to backend |
| 19 | Update RequestDeliveryPage | Completed | None | Steps 6, 10 | Form validation must match backend DTO |
| 20 | Update ShopPage | Completed | Steps 7, 9 | None | Cart state management required |
| 21 | Update OrderTrackingPage | Completed | Steps 6, 32 | None | Polling interval and WebSocket fallback needed |
| 22 | Update ShopperDashboard | Completed | Steps 9 | None | Customer activity projection must be seeded |
| 23 | Update BusinessDashboard | Completed | Step 8 | None | Billing invoices must exist in backend |
| 24 | Update RiderDashboard | Completed | Step 12 | None | Assignment endpoint must accept rider actions |
| 25 | Update AdminDashboard | Completed | Step 8 | None | Policy CRUD endpoints must exist |
| 26 | Update SupportDashboard | Completed | None | Backend: dispute/refund endpoints | Refund action requires payment webhook |
| 27 | Update OperatorDashboard | Completed | Step 13 | None | Route optimization may be algorithmic only |
| 28 | Disable MSW in production | Pending | Steps 1-18 complete | None | Must not break Jest tests |
| 29 | Remove demo route | Pending | None | None | Keep file for dev reference |
| 30 | Add Keycloak refresh | Pending | Step 3 | Backend: Keycloak realm config | Token refresh TTL must align with backend |
| 31 | Add role guards | Pending | Step 2 | None | Role mapping must stay in sync with backend |
| 32 | Add NATS WebSocket | Pending | Backend: NATS gateway exposed | Backend: WebSocket gateway | Reconnection logic required |
| 33 | Add offline caching | Pending | Steps 28, 32 | None | Cache invalidation strategy needed |
| 34 | Final verification | Pending | All prior steps | QA, Backend | Must test all 6 user roles |

---

## AGENTS.md Update Instructions

The `AGENTS.md` file does not yet exist at the repository root. Create it with the following content to ensure the coding agent maintains consistent context and references the correct progress markers throughout the entire process.

### File: `AGENTS.md` (Create at repo root)

```markdown
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
```

### Maintenance Protocol

1. **Session Start:** Always read `MVD_TRACKING.md` and `AGENTS.md` before executing any step.
2. **Step Completion:** Immediately update the tracking table `Status` cell from `Pending` to `Completed`. Increment `Completed Tasks` counter. Decrement `Pending Tasks` counter.
3. **Blocker Documentation:** If a step cannot proceed, update `Blockers` column with specific error message, missing endpoint, or dependency. Do not clear the blocker without user resolution.
4. **Collaborative Flags:** If a step requires backend work, update `Collaborative Requirements` with the exact endpoint, DTO, or behavior needed. Tag the user for action.
5. **Final Commit:** After Step 34, ensure `MVD_TRACKING.md` reflects 34 completed tasks, 0 pending, and all blockers resolved.
