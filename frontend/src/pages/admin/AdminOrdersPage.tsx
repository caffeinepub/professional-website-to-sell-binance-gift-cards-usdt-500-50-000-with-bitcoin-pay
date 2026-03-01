import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useGetAllOrders, useBulkUpdateOrderStatus } from '@/hooks/useQueries';
import { OrderStatus } from '@/backend';
import {
  Loader2,
  Eye,
  Package,
  AlertCircle,
  ArrowUpDown,
  CheckSquare,
  X,
  RefreshCw,
} from 'lucide-react';

type StatusFilter = 'all' | OrderStatus;
type SortOrder = 'newest' | 'oldest';

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case OrderStatus.pendingPayment:
      return <Badge variant="secondary" className="whitespace-nowrap">Pending Payment</Badge>;
    case OrderStatus.paid:
      return <Badge className="bg-blue-500 whitespace-nowrap">Paid</Badge>;
    case OrderStatus.delivered:
      return <Badge className="bg-green-500 whitespace-nowrap">Delivered</Badge>;
    case OrderStatus.cancelled:
      return <Badge variant="destructive" className="whitespace-nowrap">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError, refetch } = useGetAllOrders();
  const bulkUpdateMutation = useBulkUpdateOrderStatus();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>(OrderStatus.paid);

  // Count per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filter + sort
  const filteredOrders = useMemo(() => {
    let result = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);
    if (sortOrder === 'newest') {
      result = [...result].reverse();
    }
    return result;
  }, [orders, statusFilter, sortOrder]);

  const allVisibleSelected =
    filteredOrders.length > 0 && filteredOrders.every((o) => selectedIds.has(o.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateMutation.mutateAsync({
        ids: Array.from(selectedIds),
        newStatus: bulkStatus,
      });
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Bulk update failed:', err);
    }
  };

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: OrderStatus.pendingPayment },
    { label: 'Paid', value: OrderStatus.paid },
    { label: 'Delivered', value: OrderStatus.delivered },
    { label: 'Cancelled', value: OrderStatus.cancelled },
  ];

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load orders. You may not have permission to access this page.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
            Back to Home
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {orders.length} total orders
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        {/* Filter Tabs + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setSelectedIds(new Set());
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  statusFilter === tab.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  statusFilter === tab.value
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {statusCounts[tab.value] || 0}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder((s) => s === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded border border-border hover:border-primary"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as OrderStatus)}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.pendingPayment}>Pending Payment</SelectItem>
                  <SelectItem value={OrderStatus.paid}>Paid</SelectItem>
                  <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
                  <SelectItem value={OrderStatus.cancelled}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleBulkUpdate}
                disabled={bulkUpdateMutation.isPending}
                className="h-8 text-xs"
              >
                {bulkUpdateMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : null}
                Update Status
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds(new Set())}
                className="h-8 text-xs"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {statusFilter === 'all' ? 'All Orders' : `${filterTabs.find(t => t.value === statusFilter)?.label} Orders`}
            </CardTitle>
            <CardDescription>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} shown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 pl-4">
                        <Checkbox
                          checked={allVisibleSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Denomination</TableHead>
                      <TableHead>BTC Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className={selectedIds.has(order.id) ? 'bg-primary/5' : ''}
                      >
                        <TableCell className="pl-4">
                          <Checkbox
                            checked={selectedIds.has(order.id)}
                            onCheckedChange={() => toggleSelect(order.id)}
                            aria-label={`Select order ${order.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {order.id.slice(0, 12)}...
                        </TableCell>
                        <TableCell className="max-w-[140px] truncate text-sm">
                          {order.buyerContact}
                        </TableCell>
                        <TableCell className="text-sm">
                          {Number(order.denomination) > 0
                            ? `$${Number(order.denomination).toLocaleString()} USDT`
                            : '—'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {order.amountInBitcoin} BTC
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate({ to: `/admin/orders/${order.id}` })}
                            className="h-7 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No orders found for this filter
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
