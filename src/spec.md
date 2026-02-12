# Specification

## Summary
**Goal:** Build a responsive, professional English-language marketing + storefront website to sell Binance Gift Cards in fixed USDT denominations ($500–$50,000) with a Bitcoin-instructions checkout and manual admin order management.

**Planned changes:**
- Create a responsive homepage that clearly presents Binance Gift Cards and the available denomination range ($500–$50,000 USDT).
- Build a product catalog UI to choose a USDT denomination and quantity, and compute totals in USDT; persist selections through checkout within the session.
- Implement a checkout flow that collects buyer name + one contact field (email or similar) and an optional note, then displays Bitcoin payment instructions (BTC address + order reference/ID) and amount due in USDT.
- Add backend order storage in a single Motoko actor with order creation, fetch-by-ID, and list-orders methods; store denomination, quantity, total, buyer contact, status, and timestamps; default to “Pending Payment”.
- Add a minimal admin screen (no external auth) to list orders, view details, and manually update order status (Pending Payment / Paid / Delivered / Cancelled); reflect status to buyers viewing by order ID.
- Apply a consistent professional crypto storefront theme (avoid blue/purple), using Tailwind and existing UI components via composition.
- Add and render generated static image assets from `frontend/public/assets/generated` (logo + hero on homepage/header; product illustration in catalog).

**User-visible outcome:** Users can browse gift card denominations, select quantity, see USDT totals, submit an order with contact info, and receive Bitcoin payment instructions with an order reference; admins can review orders and manually update statuses that buyers can view by order ID.
