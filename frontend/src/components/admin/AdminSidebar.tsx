import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Package, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import { useGetAdminStats, useGetUnreadContactMessageCount } from '@/hooks/useQueries';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export function AdminSidebar() {
  const location = useLocation();
  const { data: stats } = useGetAdminStats();
  const { data: unreadCount } = useGetUnreadContactMessageCount();

  const pendingOrders = stats ? Number(stats.pendingOrders) : 0;
  const unreadMessages = unreadCount ? Number(unreadCount) : 0;

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: <Package className="h-4 w-4" />,
      badge: pendingOrders,
    },
    {
      label: 'Messages',
      path: '/admin/messages',
      icon: <MessageSquare className="h-4 w-4" />,
      badge: unreadMessages,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-binance-dark border-r border-binance-dark-border flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-binance-dark-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-binance-yellow flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-binance-dark" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin Panel</p>
            <p className="text-xs text-binance-dark-border">Management Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-binance-yellow text-binance-dark'
                  : 'text-gray-300 hover:bg-binance-dark-lighter hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={active ? 'text-binance-dark' : 'text-gray-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  active
                    ? 'bg-binance-dark text-binance-yellow'
                    : 'bg-red-500 text-white'
                }`}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-binance-dark-border">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <BarChart3 className="h-3 w-3" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
