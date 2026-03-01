import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DenominationBreakdownChartProps {
  data: Array<[bigint, bigint]>;
}

const COLORS = [
  'oklch(0.82 0.18 85)',
  'oklch(0.55 0.18 35)',
  'oklch(0.65 0.20 200)',
  'oklch(0.60 0.22 25)',
  'oklch(0.70 0.18 140)',
  'oklch(0.65 0.15 280)',
  'oklch(0.75 0.16 60)',
];

export function DenominationBreakdownChart({ data }: DenominationBreakdownChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .map(([denom, count]) => ({
        name: `$${Number(denom).toLocaleString()} USDT`,
        value: Number(count),
        denomination: Number(denom),
      }))
      .sort((a, b) => a.denomination - b.denomination);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No denomination data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0 0)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [`${value} orders`, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
