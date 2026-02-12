import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllOrders } from '@/hooks/useQueries';
import { OrderStatus } from '@/backend';
import { Loader2, Eye, Package, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, error } = useGetAllOrders();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pendingPayment:
        return <Badge variant="secondary">Pending Payment</Badge>;
      case OrderStatus.paid:
        return <Badge className="bg-blue-500">Paid</Badge>;
      case OrderStatus.delivered:
        return <Badge className="bg-green-500">Delivered</Badge>;
      case OrderStatus.cancelled:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isError) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load orders. You may not have permission to access this page.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: '/' })}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Package className="h-8 w-8" />
          Admin: Order Management
        </h1>
        <p className="text-lg text-muted-foreground">
          View and manage all gift card orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            {orders ? `${orders.length} total orders` : 'Loading orders...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>BTC Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.buyerContact}</TableCell>
                      <TableCell className="font-mono">{order.amountInBitcoin} BTC</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: `/admin/orders/${order.id}` })}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
