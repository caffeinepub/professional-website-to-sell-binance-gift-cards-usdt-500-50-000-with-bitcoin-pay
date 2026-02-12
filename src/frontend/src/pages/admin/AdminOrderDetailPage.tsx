import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      await updateStatusMutation.mutateAsync({
        orderId,
        newStatus,
      });
      setNewStatus(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isError && error instanceof Error && error.message.includes('Access denied')
              ? 'Access denied. You do not have permission to view this order.'
              : 'Order not found or you do not have permission to view it.'}
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: '/admin/orders' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const currentStatus = newStatus || order.status;

  return (
    <div className="container py-12 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate({ to: '/admin/orders' })}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Order Details</h1>
        <p className="text-lg text-muted-foreground">
          View and manage order #{order.id}
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Complete order details and buyer information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
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
              <p className="text-sm text-muted-foreground mb-1">Buyer Contact</p>
              <p className="font-medium">{order.buyerContact}</p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bitcoin Amount</p>
                <p className="font-mono font-medium">{order.amountInBitcoin} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Address</p>
                <p className="font-mono text-sm break-all">{order.btcPaymentAddress}</p>
              </div>
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

            <Button 
              onClick={handleUpdateStatus}
              disabled={!newStatus || newStatus === order.status || updateStatusMutation.isPending}
              className="w-full"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Status
                </>
              )}
            </Button>

            {updateStatusMutation.isSuccess && (
              <Alert>
                <AlertDescription>
                  Status updated successfully!
                </AlertDescription>
              </Alert>
            )}

            {updateStatusMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {updateStatusMutation.error instanceof Error && updateStatusMutation.error.message.includes('Access denied')
                    ? 'Access denied. You do not have permission to update order status.'
                    : 'Failed to update status. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
