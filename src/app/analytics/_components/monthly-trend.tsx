"use client";
import { formatCurrency } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type TrendTooltipPayload = {
  dataKey?: string;
  value?: number;
  color?: string;
  name?: string;
};

type TrendTooltipProps = {
  active?: boolean;
  payload?: TrendTooltipPayload[];
  label?: string | number;
  currency: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  currency,
}: TrendTooltipProps) => {
  if (!active || !payload?.length) return null;
  const title = typeof label === "string" ? label : String(label);

  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="mt-1 space-y-1 text-sm">
        {payload.map((item) => (
          <li key={item.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium">
              {item.name}:{" "}
              {formatCurrency((item.value as number) ?? 0, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function MonthlyTrend({
  data,
  currency,
}: {
  data: Array<{ month: string; income: number; expense: number }>;
  currency: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 24, right: 16, left: 16, bottom: 8 }}
        barGap={2}
      >
        <CartesianGrid
          stroke="rgba(148, 163, 184, 0.35)"
          strokeDasharray="0"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: "#cbd5f5" }}
          tick={{ fill: "#475569", fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) => formatCurrency(value, currency)}
          tick={{ fill: "#475569", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "oklch(0.269 0 0 / 0.18)", radius: 8 }}
          content={(props) => <CustomTooltip {...props} currency={currency} />}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ fontSize: 12, paddingBottom: 24, marginRight: 8 }}
        />
        <Bar
          dataKey="income"
          name="Income"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
