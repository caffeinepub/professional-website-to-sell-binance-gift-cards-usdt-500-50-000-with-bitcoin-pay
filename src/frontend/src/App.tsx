import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});

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

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: AdminOrdersPage,
});

const adminOrderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders/$orderId',
  component: AdminOrderDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  checkoutRoute,
  orderStatusRoute,
  adminOrdersRoute,
  adminOrderDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
