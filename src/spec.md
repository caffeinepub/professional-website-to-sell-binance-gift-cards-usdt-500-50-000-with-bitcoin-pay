# Specification

## Summary
**Goal:** Replace the hardcoded Bitcoin payment address used during checkout with the new BTC address for newly created orders.

**Planned changes:**
- Update the fixed `btcAddress` value in `frontend/src/pages/CheckoutPage.tsx` used when submitting `createOrder` to `12usSpmU49fnNfm7VuoGkvkoT47jS5snri`.
- Ensure the checkout success screen displays the updated BTC address for newly placed orders.
- Ensure the order status page displays the updated BTC address for newly created orders (as stored on the order).

**User-visible outcome:** After placing a new order, users see the Bitcoin Address as `12usSpmU49fnNfm7VuoGkvkoT47jS5snri` on both the checkout success screen and the order status page.
