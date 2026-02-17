# Specification

## Summary
**Goal:** Make the BTC/USDT live rate reliably update without getting stuck as “rate unavailable” by adding a working API fallback, and surface the live BTC price + status clearly across the UI.

**Planned changes:**
- Update the BTC/USDT live rate hook to use a reliable primary live price API with automatic refresh, plus a secondary fallback provider when the primary fails.
- Preserve auto-refresh behavior (at least every 60 seconds) and refetch on reconnect/focus, while returning rate metadata indicating the active source (primary, fallback, cached/stale, hardcoded fallback).
- Improve failure handling: if both providers fail, use last cached successful rate even if older than the previous limit and mark it as cached/stale; only use a hardcoded fallback when no cached rate exists, clearly flagged.
- Add a live BTC price readout to the PromoTicker (e.g., “BTC: $xx,xxx”) with English loading and unavailable/cached/fallback status messaging.
- Ensure storefront and order pages use the same effective rate data and display consistent, user-friendly English indicators when conversions are based on cached or fallback pricing (including accurate source labels/badges).

**User-visible outcome:** Users see a continuously updating BTC price in the promo ticker, and all BTC conversions across storefront/order pages remain consistent with clear English indicators when the app is using live, cached, or fallback pricing—avoiding “rate unavailable” whenever possible.
