# Simulator Playwright Page and Flow Map

This document is the handover reference for the Product Simulator browser tests. It maps each user-facing Playwright flow to its route, required page content, and navigation placement. It deliberately separates browser pages from direct API checks so a page is not invented for an endpoint-only test.

## Scope

- Browser UI: `tests/api/simulator-ui.spec.ts`
- Browser flows and critical paths: `tests/api/simulator-comprehensive.spec.ts`
- Direct API coverage: `tests/api/simulator-api-integration.spec.ts`
- Simulator application root: `apps/simulator/src`

## Route inventory

| Route | Page/component | Status | Entry points |
|---|---|---|---|
| `/` | `Homepage` | Implemented | Direct URL; five persona cards |
| `/jobs` | `JobFeed` | Implemented | Persona login; Jobs menu |
| `/order/create` | `OrderCreation` | Implemented | Orders menu; Business Owner Create Order action; Dashboard flow menu |
| `/dashboard` | `Dashboard` | Implemented | Jobs menu; page navigation |
| `/contacts` | `Contacts` | Implemented | Jobs, Dashboard, Reports, and page navigation |
| `/reports` | `Reports` | Implemented | Jobs, Dashboard, Billing, and page navigation |
| `/wallet` | `WalletPage` | Implemented | Jobs, Dashboard, Reports, and page navigation |
| `/billing` | `BillingPage` | Implemented | Jobs, Dashboard, Reports, and page navigation |
| `/maps` | `MapsPage` | Implemented | Jobs, Dashboard, Reports, and page navigation |
| `/business/onboard` | `BusinessOnboarding` | Implemented | Dashboard flow menu |
| `/rider/register` | `RiderManagement` | Implemented | Dashboard flow menu |
| `*` | `NotFound` | Implemented | Invalid/deep-link route fallback |

`ApiDebugPanel` is a global component mounted in `App`; it is not a route.

## Menu and navigation contract

| Surface | Required links | Why it is placed here |
|---|---|---|
| Homepage | Persona cards | Starts every Playwright browser flow and selects a demo role. |
| Job feed left menu | Jobs, Orders, Dashboard, Contacts, Reports, Wallet, Billing, Maps | Primary authenticated navigation; all single-page assertions start here. |
| Job feed header | Create Order for Business Owner | Makes the order workflow a concrete action rather than an optional test branch. |
| Dashboard left menu | Jobs, Contacts, Reports, Wallet, Billing, Maps, onboarding/registration/order flows | Supports the business-owner critical path and operational flows. |
| Wallet, Billing, Maps | Shared `PageNavigation` | These full-page layouts previously stranded users; they now expose the primary destinations. |
| Reports and Contacts | Their existing side menus | Continue the core navigation loop without returning to Jobs first. |
| Order, Business Onboarding, Rider Registration | Return to Dashboard after action/cancel | Keeps focused forms out of the global menu while preserving an exit path. |

## Browser test-to-page map

| Playwright area | Expected flow | Page and required UI | Coverage state |
|---|---|---|---|
| Homepage and authentication | `/` → persona card → `/jobs` | `Homepage`; Rider, Fleet Manager, Business Owner, Marketplace Contractor, System Admin cards | Implemented |
| Job feed | Persona → `/jobs` | `JobFeed`; Jobs button, seeded cards, status/workspace controls | Implemented |
| Multi-workspace | Fleet Manager → QuickBite / SwiftMove | `JobFeed`; visible workspace controls and filtered feed | Implemented |
| Multi-vertical | Rider/Fleet Manager → Jobs | `JobFeed`; seeded delivery and moving cards | Implemented |
| Dashboard | Business Owner → Dashboard | `Dashboard`; dashboard heading and metrics | Implemented |
| Reports | Business Owner → Reports | `Reports`; report controls and export action | Implemented |
| Wallet | Rider → Wallet | `WalletPage`; Balance, transactions, Request Payout, return navigation | Implemented |
| Billing | Business Owner → Billing | `BillingPage`; Billing heading, invoices, page navigation | Implemented |
| Maps | Fleet Manager → Maps | `MapsPage`; **Map View** heading and job map | Implemented |
| Contacts | Fleet Manager → Contacts | `Contacts`; Contacts heading and contact action | Implemented |
| Orders | Business Owner → Orders/Create Order | `OrderCreation`; order and delivery request form | Implemented |
| Debug | Any authenticated page → API Debug | global `ApiDebugPanel`; toggle and request-history surface | Implemented |
| Error route | Invalid route | `NotFound`; visible error message and home action | Implemented |
| Rider critical path | Rider → Jobs → Wallet → Jobs → Contacts | Job menu plus `PageNavigation` on Wallet | Implemented |
| Business Owner critical path | Owner → Jobs → Dashboard → Billing → Reports → Contacts | Dashboard menu plus `PageNavigation` on Billing | Implemented |
| Workspace critical path | Fleet Manager → QuickBite → SwiftMove | JobFeed workspace controls | Implemented |

## Direct API tests: no page required

`simulator-api-integration.spec.ts` exercises backend endpoints directly. These are integration checks, not missing simulator pages:

| API area | Endpoints covered |
|---|---|
| Health | `/api/health/live` |
| Organizations | `/api/organizations` |
| Riders | `/api/riders` |
| Orders | `/api/orders` |
| Deliveries | `/api/deliveries`, `/api/deliveries/request` |
| Wallet | `/api/wallets/:actorId`, `/transactions` |
| Workspaces | `/api/workspaces`, `/api/workspaces/:id` |
| Job types and assignments | `/api/job-types`, `/api/assignments` |
| Error/performance | invalid endpoints, invalid workspace, response timing |

## Deliberate follow-up work

These are not required by the current browser assertions, but should be planned before increasing end-to-end coverage:

1. Add a dedicated delivery tracking route, such as `/deliveries/:id`, with real status history. Current delivery coverage observes seeded job cards and calls APIs directly.
2. Add explicit loading and failure states to API-backed form submissions. The current loading-state test only observes the UI opportunistically.
3. Replace in-memory simulator data with a controlled E2E seed fixture when browser tests need backend persistence guarantees.
4. Strengthen the specs with assertions after optional branches (status filters, order form fields, workspace selection, and debug request entries).

## Maintenance rule

When a Playwright browser assertion is added or renamed, update this document in the same change. New route-bearing user flows must appear in the route inventory and name their visible menu entry point.
