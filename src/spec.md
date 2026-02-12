# Specification

## Summary
**Goal:** Fix the production-only runtime crash that forces the app to show the global “Something went wrong” fallback on initial load, and make the app shell resilient to backend/actor/query failures.

**Planned changes:**
- Identify and fix the root cause of the production runtime error so `/` renders normally without triggering the TanStack Router `errorComponent`.
- Harden `GlobalErrorFallbackPage` so it never throws in production (browser-safe env checks using `import.meta.env` only, and safe rendering for unknown/undefined thrown values), keeping all fallback text in English.
- Update `SiteLayout` and non-critical initial queries (e.g., ownership/admin checks, recent orders dropdown) to fail gracefully when actor/backend/React Query calls fail (hide admin link unless confirmed, disable Orders menu, avoid throwing) while still rendering the layout and current route outlet.

**User-visible outcome:** In production, visiting `/` loads the Home page within `SiteLayout` without a global error screen; if backend connectivity or initial calls fail, the app still renders and non-critical UI elements degrade gracefully instead of crashing.
