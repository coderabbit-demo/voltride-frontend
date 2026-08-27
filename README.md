# ⚡ voltride-frontend

React + TypeScript (Vite) storefront for the [VoltRide](https://github.com/coderabbit-demo/voltride-platform) e-bike store. Runs on **port 5173**.

Talks to [voltride-catalog](https://github.com/coderabbit-demo/voltride-catalog), [voltride-cart](https://github.com/coderabbit-demo/voltride-cart), [voltride-orders](https://github.com/coderabbit-demo/voltride-orders), and [voltride-notifications](https://github.com/coderabbit-demo/voltride-notifications) through the Vite dev proxy (`/api/<service>/...` → `localhost:<port>`), so no service needs CORS. It never calls inventory or pricing directly — those are reached through the service chains. `src/api/*.ts` are hand-written mirrors of each backend's contract; see `AGENTS.md`.

## Pages

`/` product grid · `/products/:id` detail · `/cart` cart with promo codes · `/checkout` · `/orders/:orderId` confirmation with a mock "inbox"

## Run

```sh
npm install
npm run dev       # Vite on http://localhost:5173 — expects the backend services running locally
```

To run the whole VoltRide system, use the scripts in [voltride-platform](https://github.com/coderabbit-demo/voltride-platform).
