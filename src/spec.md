# Specification

## Summary
**Goal:** Show Bitcoin payment instructions using a global 50% discounted USDT basis, and lock down the Admin Panel so only the site owner can access admin pages and operations.

**Planned changes:**
- Apply a global 50% pricing rule to the USDT amount used for BTC payment instruction calculations and the displayed “≈ $X USDT” line on Checkout success and on the Order Status page (Pending Payment).
- Persist the discounted USDT amount (or equivalent) in backend order data so Order Status can render correct payment instructions without relying on cart/session state.
- Require Internet Identity login for admin routes and restrict AdminOrdersPage/AdminOrderDetailPage visibility to the configured owner identity; show English “Access denied” for non-owners.
- Enforce owner-only authorization in the backend for admin-only methods (listing all orders, updating order status), ensuring bypassing the frontend still fails.

**User-visible outcome:** Buyers see BTC payment instructions reflecting half the selected gift card total on Checkout and Order Status (pending) screens, while admin pages and admin actions are accessible only to the logged-in owner (others are prompted to log in or shown “Access denied” in English.
