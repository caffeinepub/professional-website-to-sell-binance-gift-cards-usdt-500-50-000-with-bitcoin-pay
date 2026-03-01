# Specification

## Summary
**Goal:** Upgrade the existing Admin Panel with a full-featured dashboard, analytics, enhanced order management, and improved contact message tracking.

**Planned changes:**
- Add a left sidebar navigation visible on all admin pages with links to Dashboard, Orders, Contact Messages, and Analytics; show badge counts for pending orders and unread messages, with active route highlighting
- Create an Admin Dashboard overview page at `/admin` with metric cards: Total Orders, Pending Orders, Completed Orders, Total Revenue (USDT), live BTC/USDT rate, and unread messages count
- Add a Recent Activity feed on the dashboard showing the 10 most recent orders and 5 most recent contact messages in a timeline-style list
- Add a Revenue & Orders analytics chart (bar or line) showing order volume and revenue over time grouped by day/week
- Add a Card Sales Breakdown pie/donut chart showing orders distributed by denomination (e.g. $10, $25, $50, $100)
- Add backend `getAdminStats` function returning aggregated counts by status, total USDT revenue from completed orders, and total contact messages count (owner-only)
- Add backend `getOrdersByDenomination` function returning order counts and USDT totals grouped by denomination (owner-only)
- Enhance the Admin Orders page with status filter tabs (All, Pending, Processing, Completed, Cancelled) showing counts, and sort by date (newest/oldest)
- Add bulk order status update: checkboxes on each order row, a Select All checkbox, and a bulk action toolbar that updates all selected orders' status at once (frontend + backend)
- Add read/unread tracking for contact messages: store flag in backend, mark as read when admin views a message, visually distinguish unread messages, and show unread badge on sidebar and dashboard
