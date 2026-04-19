"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PaceData {
  month: string; // "Jan", "Feb", etc
  pace: number; // min/km
}

interface Props {
  data: PaceData[];
}

export function PaceChart({ data }: Props) {
  if (data.length < 2) return null;

  return (
    <div className="w-full h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64697A", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            reversed
            tick={{ fill: "#64697A", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}'`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,15,22,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#F5F5F7",
            }}
            formatter={(value) => [`${Number(value).toFixed(1)} min/km`, "Pace"]}
            labelStyle={{ color: "#64697A", fontSize: "11px" }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3, fill: "#10B981" }}
            activeDot={{ r: 5, fill: "#10B981", stroke: "#F5F5F7", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
