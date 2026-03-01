import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { DenominationBreakdownChart } from '@/components/admin/DenominationBreakdownChart';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { useGetAdminStats, useGetAllOrders, useGetContactMessages, useGetOrdersByDenomination, useGetUnreadContactMessageCount } from '@/hooks/useQueries';
import { useBtcUsdtRate } from '@/hooks/useBtcUsdtRate';
import { OrderStatus } from '@/backend';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Bitcoin,
  MessageSquare,
  MailOpen,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
  onClick?: () => void;
}

function StatCard({ title, value, icon, description, colorClass = 'text-primary', onClick }: StatCardProps) {
  return (
    <Card
      className={`transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-muted/60 ${colorClass}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: orders = [] } = useGetAllOrders();
  const { data: messages = [] } = useGetContactMessages();
  const { data: denominationData = [] } = useGetOrdersByDenomination();
  const { data: unreadCount } = useGetUnreadContactMessageCount();
  const { effectiveRate, source: rateSource, isLive } = useBtcUsdtRate();

  const totalOrders = stats ? Number(stats.totalOrders) : 0;
  const pendingOrders = stats ? Number(stats.pendingOrders) : 0;
  const paidOrders = stats ? Number(stats.paidOrders) : 0;
  const deliveredOrders = stats ? Number(stats.deliveredOrders) : 0;
  const cancelledOrders = stats ? Number(stats.cancelledOrders) : 0;
  const totalRevenue = stats ? Number(stats.totalUsdtRevenue) : 0;
  const totalMessages = stats ? Number(stats.totalContactMessages) : 0;
  const unreadMessages = unreadCount ? Number(unreadCount) : 0;

  const completionRate = totalOrders > 0
    ? Math.round((deliveredOrders / totalOrders) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Overview of your Binance Gift Cards store
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/admin/orders' })}
            className="gap-2"
          >
            View All Orders
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Orders"
                value={totalOrders}
                icon={<Package className="h-5 w-5" />}
                description={`${completionRate}% completion rate`}
                colorClass="text-primary"
                onClick={() => navigate({ to: '/admin/orders' })}
              />
              <StatCard
                title="Pending Payment"
                value={pendingOrders}
                icon={<Clock className="h-5 w-5" />}
                description="Awaiting BTC payment"
                colorClass="text-yellow-600"
                onClick={() => navigate({ to: '/admin/orders' })}
              />
              <StatCard
                title="Paid Orders"
                value={paidOrders}
                icon={<CheckCircle2 className="h-5 w-5" />}
                description="Payment confirmed"
                colorClass="text-blue-600"
              />
              <StatCard
                title="Delivered"
                value={deliveredOrders}
                icon={<CheckCircle2 className="h-5 w-5" />}
                description="Cards delivered"
                colorClass="text-green-600"
              />
              <StatCard
                title="Cancelled"
                value={cancelledOrders}
                icon={<XCircle className="h-5 w-5" />}
                description="Cancelled orders"
                colorClass="text-destructive"
              />
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                description="USDT from delivered orders"
                colorClass="text-green-600"
              />
              <StatCard
                title="BTC/USDT Rate"
                value={`$${effectiveRate.toLocaleString()}`}
                icon={<Bitcoin className="h-5 w-5" />}
                description={isLive ? `Live · ${rateSource}` : `Cached · ${rateSource}`}
                colorClass="text-binance-yellow"
              />
              <StatCard
                title="Unread Messages"
                value={unreadMessages}
                icon={<MailOpen className="h-5 w-5" />}
                description={`${totalMessages} total messages`}
                colorClass={unreadMessages > 0 ? 'text-blue-600' : 'text-muted-foreground'}
                onClick={() => navigate({ to: '/admin/messages' })}
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Orders & Revenue</CardTitle>
              </div>
              <CardDescription>Order volume and revenue over recent days</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart orders={orders} />
            </CardContent>
          </Card>

          {/* Denomination Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">By Denomination</CardTitle>
              </div>
              <CardDescription>Orders grouped by card value</CardDescription>
            </CardHeader>
            <CardContent>
              <DenominationBreakdownChart data={denominationData} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/orders' })}
                className="text-xs gap-1"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest orders and contact messages</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityFeed orders={orders} messages={messages} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
