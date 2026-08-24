"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const COLORS = {
  terracotta: "#bd5220",
  forest: "#2c4636",
  marigold: "#d99a2b",
  line: "#e2d5ba",
  ink: "#5c4f42",
};

function formatMonth(value) {
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
}

function formatProgram(value) {
  return value.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.line} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fill: COLORS.ink, fontSize: 12 }}
          axisLine={{ stroke: COLORS.line }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: COLORS.ink, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Donated"]}
          labelFormatter={formatMonth}
          contentStyle={{ borderRadius: 12, borderColor: COLORS.line }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke={COLORS.terracotta}
          strokeWidth={2.5}
          dot={{ r: 3, fill: COLORS.terracotta }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProgramBreakdownChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid stroke={COLORS.line} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: COLORS.ink, fontSize: 12 }}
          axisLine={{ stroke: COLORS.line }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="program"
          tickFormatter={formatProgram}
          tick={{ fill: COLORS.ink, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Donated"]}
          labelFormatter={formatProgram}
          contentStyle={{ borderRadius: 12, borderColor: COLORS.line }}
        />
        <Bar dataKey="total" fill={COLORS.forest} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
