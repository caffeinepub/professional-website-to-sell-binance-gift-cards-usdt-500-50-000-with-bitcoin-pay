# Specification

## Summary
**Goal:** Improve the Binance Gift Cards UI with a site-wide Binance-style promo ticker, real-time BTC/USDT pricing updates, more compact denomination cards, and cleaned-up footer branding.

**Planned changes:**
- Add a top-of-page, all-routes running ticker banner (Binance-like dark background with yellow accent) that scrolls smoothly and does not interfere with header/navigation or page interaction.
- Update the ticker copy (English) to be more engaging while clearly stating a flash 50% discount, limited-time urgency, and a credible special-offer reason.
- Make BTC/USDT rate fetching auto-refresh and ensure all BTC-derived UI amounts (including any summary/top rate display and catalog conversions) update when the rate changes, with graceful loading/fallback states.
- Adjust gift card denomination cards to be more compact and Binance-like in density/layout while keeping the existing Binance-style palette and avoiding black/brown styling.
- Remove the “Built with ❤️ using caffeine.ai” text/link from the footer without removing other footer content.

**User-visible outcome:** Users see a Binance-style promo ticker across the entire site, live-updating BTC-based pricing throughout the UI, a more compact Binance-like gift card catalog layout, and a footer without caffeine.ai branding.
