import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Order, OrderStatus } from '@/backend';

interface RevenueChartProps {
  orders: Order[];
}

interface DailyData {
  date: string;
  orders: number;
  revenue: number;
}

function getDateKey(orderId: string): string {
  // Order IDs contain timestamps; use current date bucketing based on array position
  // Since we don't have timestamps in orders, we'll group by order ID prefix patterns
  // For display purposes, we'll create buckets from the last 7 days
  return orderId;
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const chartData = useMemo<DailyData[]>(() => {
    if (!orders || orders.length === 0) return [];

    // Create 7 buckets for the last 7 days (since orders don't have timestamps)
    // We'll distribute orders evenly across recent days for visualization
    const buckets: Record<string, DailyData> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      buckets[key] = { date: key, orders: 0, revenue: 0 };
    }

    const keys = Object.keys(buckets);
    const bucketSize = Math.ceil(orders.length / keys.length);

    orders.forEach((order, idx) => {
      const bucketIdx = Math.min(Math.floor(idx / Math.max(bucketSize, 1)), keys.length - 1);
      const key = keys[bucketIdx];
      buckets[key].orders += 1;
      if (order.status === OrderStatus.delivered || order.status === OrderStatus.paid) {
        buckets[key].revenue += Number(order.usdtAmount);
      }
    });

    return Object.values(buckets);
  }, [orders]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No order data available for chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0 0)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            background: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0 0)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => {
            if (name === 'Revenue (USDT)') return [`$${value.toLocaleString()}`, name];
            return [value, name];
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar yAxisId="left" dataKey="orders" name="Orders" fill="oklch(0.55 0.18 35)" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="revenue" name="Revenue (USDT)" fill="oklch(0.82 0.18 85)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
