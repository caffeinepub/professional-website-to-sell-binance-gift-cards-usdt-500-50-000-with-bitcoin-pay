# Specification

## Summary
**Goal:** Fix admin “Access Denied” for the real site owner by persisting a single owner Principal in the backend and providing a safe one-time ownership claim flow, with frontend guidance to self-resolve when no owner is configured.

**Planned changes:**
- Persist an explicit site-owner Principal in stable state in the Motoko backend and use it as the sole source of truth for admin authorization checks.
- Add backend endpoints to (1) query the currently configured owner Principal (or none) and (2) allow a one-time ownership claim that sets owner = caller only when no owner is configured yet (optionally allow owner-only transfer).
- Update the frontend admin-route gating on `/admin/orders` to check whether an owner is configured; if not, offer an English “Claim Admin Access” action with clear success/failure feedback, otherwise show the existing English “Access Denied” experience for non-owners.

**User-visible outcome:** The real owner can reliably access admin-only pages and actions (including after upgrades). If the backend has no owner configured, the first logged-in user can claim admin access from the Access Denied screen; non-owners continue to be blocked with clear English messaging.
