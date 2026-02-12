# Specification

## Summary
**Goal:** Fix the production initial-load crash that renders only the global “Something went wrong” fallback, and make the error handling + layout resilient in production builds.

**Planned changes:**
- Identify and fix the root cause of the production runtime error that triggers the global error fallback on initial load (especially on the root route) so the Home page renders normally.
- Harden the global error fallback so it is safe in production builds (no `process` references), keeps all user-facing text in English, optionally shows error details only in development, and preserves working “Reload page” and “Go to Home” actions.
- Update the app shell (SiteLayout) and routing to tolerate backend/actor initialization failures and non-critical layout-level query failures by degrading gracefully instead of crashing (e.g., hide Admin link when owner check fails; show “Unable to load” for recent orders when that query fails).

**User-visible outcome:** Opening the production URL loads the normal Home page UI (header + hero) without console crashes on mobile browsers, and if a transient backend/query issue occurs the site still loads with graceful fallbacks instead of a full-app error screen.
