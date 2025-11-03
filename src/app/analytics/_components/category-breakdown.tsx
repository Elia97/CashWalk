"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

type CategoryDatum = { name: string; value: number; color: string };
type Props = { data: CategoryDatum[]; currency: string };

const palette = [
  "#0ea5e9",
  "#22d3ee",
  "#a855f7",
  "#f97316",
  "#f43f5e",
  "#10b981",
  "#6366f1",
  "#eab308",
];

type CategoryTooltipPayload = {
  color?: string;
  name?: string | number;
  value?: number;
  payload?: CategoryDatum & { percentage: number };
};

type CategoryTooltipProps = {
  active?: boolean;
  payload?: CategoryTooltipPayload[];
  currency: string;
};

const CategoryTooltip = ({
  active,
  payload,
  currency,
}: CategoryTooltipProps) => {
  if (!active || !payload?.length) return null;
  const details = payload[0].payload!;
  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 text-sm shadow-md">
      <div className="font-semibold">{details.name}</div>
      <div className="text-xs text-muted-foreground">
        {formatCurrency(details.value, currency)} ·{" "}
        {details.percentage.toFixed(1)}%
      </div>
    </div>
  );
};

export function CategoryBreakdown({ data, currency }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color ?? palette[index % palette.length],
    percentage: total === 0 ? 0 : (item.value / total) * 100,
  }));

  const handleSliceEnter = (_: unknown, index: number) => setActiveIndex(index);
  const handleSliceLeave = () => setActiveIndex(null);

  return (
    <div className="grid gap-6 xl:grid-cols-2 md:items-center">
      <div className="h-40 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              onMouseEnter={handleSliceEnter}
              onMouseLeave={handleSliceLeave}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="#0f172a"
                  strokeWidth={1}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.45
                  }
                />
              ))}
            </Pie>
            <Tooltip
              content={(props) => (
                <CategoryTooltip {...props} currency={currency} />
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {chartData.map((item, index) => (
          <li
            key={item.name}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={handleSliceLeave}
            className={`relative flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
              activeIndex === index && "scale-110"
            }`}
            style={{ borderColor: item.color }}
          >
            <div className="flex flex-col">
              <span className="block max-w-[100px] truncate text-sm font-medium">
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(item.value, currency)} ·{" "}
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
