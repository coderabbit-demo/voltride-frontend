# AGENTS.md — voltride-frontend

Part of VoltRide, a multi-repo microservices demo (see the `voltride-platform` repo for the system map). Every repo hand-maintains local copies of its peers' contracts — there is **no shared types package anywhere in VoltRide**, and nothing must ever change that.

## Contract mirrors (this repo consumes only)

| File | Mirrors | Producer repo |
|---|---|---|
| `src/api/catalog.ts` | product list/detail responses | voltride-catalog |
| `src/api/cart.ts` | cart endpoints + `404 cart_not_found` (drives the stale-cart auto-retry) | voltride-cart |
| `src/api/orders.ts` | order response + 409/422 error bodies | voltride-orders |
| `src/api/notifications.ts` | notification records | voltride-notifications |

TypeScript cannot verify these mirrors against the producing repos — drift only shows up at runtime (undefined fields, NaN totals). When a producer repo changes its contract, the matching `src/api/*.ts` file here must be updated in a coordinated PR.

## Conventions

- All service calls go through the Vite dev proxy (`vite.config.ts`): `/api/catalog|cart|orders|notifications/*` → ports 4001/4002/4004/4006. Never call inventory (4003) or pricing (4005) directly — the chains are the point of the demo. Never add CORS assumptions.
- Cart id lives in `localStorage` (`voltride.cartId`); carts are server-side in-memory, so ids can go stale — `addToCart` auto-recovers on `cart_not_found`.
- Money is integer cents, formatted via `formatCents` in `src/components/PriceTag.tsx`.
- Verify with: `npx tsc --noEmit`, then `npm run dev` against the running system and click through browse → detail → cart → checkout → confirmation.
