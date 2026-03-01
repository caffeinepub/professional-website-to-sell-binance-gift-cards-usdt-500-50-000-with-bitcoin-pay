import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { GlobalErrorFallbackPage } from './pages/GlobalErrorFallbackPage';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import TrackOrderPage from './pages/TrackOrderPage';
import FaqPage from './pages/FaqPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminContactMessagesPage from './pages/admin/AdminContactMessagesPage';

// Root route with layout and error handling
const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
  errorComponent: ({ error, reset }) => <GlobalErrorFallbackPage error={error} reset={reset} />,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: OrderStatusPage,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistoryPage,
});

const trackOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/track',
  component: TrackOrderPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

// Admin routes (protected)
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <AdminRouteGuard>
      <AdminOrdersPage />
    </AdminRouteGuard>
  ),
});

const adminOrderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders/$orderId',
  component: () => (
    <AdminRouteGuard>
      <AdminOrderDetailPage />
    </AdminRouteGuard>
  ),
});

const adminContactMessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/messages',
  component: () => (
    <AdminRouteGuard>
      <AdminContactMessagesPage />
    </AdminRouteGuard>
  ),
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  checkoutRoute,
  orderStatusRoute,
  orderHistoryRoute,
  trackOrderRoute,
  faqRoute,
  aboutRoute,
  contactRoute,
  adminDashboardRoute,
  adminOrdersRoute,
  adminOrderDetailRoute,
  adminContactMessagesRoute,
]);

// Create router with error handling
const router = createRouter({ 
  routeTree,
  defaultErrorComponent: ({ error, reset }) => <GlobalErrorFallbackPage error={error} reset={reset} />,
});

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary fallback={(error, reset) => <GlobalErrorFallbackPage error={error} reset={reset} />}>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
}
