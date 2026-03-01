import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useGetOrder, useUpdateOrderStatus } from '@/hooks/useQueries';
import { OrderStatus } from '@/backend';
import { Loader2, AlertCircle, ArrowLeft, Save } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useGetOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await updateStatusMutation.mutateAsync({ orderId, newStatus });
      setNewStatus(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !order) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isError && error instanceof Error && error.message.includes('Access denied')
                ? 'Access denied. You do not have permission to view this order.'
                : 'Order not found or you do not have permission to view it.'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate({ to: '/admin/orders' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const currentStatus = newStatus || order.status;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/admin/orders' })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Managing order #{order.id}
          </p>
        </div>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>Complete order details and buyer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Order ID</p>
                  <p className="font-mono text-sm font-medium break-all">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Current Status</p>
                  <div className="mt-1">
                    {order.status === OrderStatus.pendingPayment && <Badge variant="secondary">Pending Payment</Badge>}
                    {order.status === OrderStatus.paid && <Badge className="bg-blue-500">Paid</Badge>}
                    {order.status === OrderStatus.delivered && <Badge className="bg-green-500">Delivered</Badge>}
                    {order.status === OrderStatus.cancelled && <Badge variant="destructive">Cancelled</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Buyer Contact</p>
                <p className="font-medium text-sm">{order.buyerContact}</p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Denomination</p>
                  <p className="font-medium text-sm">
                    {Number(order.denomination) > 0
                      ? `$${Number(order.denomination).toLocaleString()} USDT`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Bitcoin Amount</p>
                  <p className="font-mono font-medium text-sm">{order.amountInBitcoin} BTC</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">USDT Amount</p>
                  <p className="font-medium text-sm">
                    {Number(order.usdtAmount) > 0 ? `$${Number(order.usdtAmount).toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Payment Address</p>
                <p className="font-mono text-xs break-all bg-muted/40 p-2 rounded">{order.btcPaymentAddress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
              <CardDescription>Change the status of this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(value) => setNewStatus(value as OrderStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.pendingPayment}>Pending Payment</SelectItem>
                    <SelectItem value={OrderStatus.paid}>Paid</SelectItem>
                    <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
                    <SelectItem value={OrderStatus.cancelled}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {updateStatusMutation.isSuccess && (
                <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    Order status updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {updateStatusMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {updateStatusMutation.error?.message || 'Failed to update order status.'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleUpdateStatus}
                disabled={!newStatus || newStatus === order.status || updateStatusMutation.isPending}
                className="gap-2"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
