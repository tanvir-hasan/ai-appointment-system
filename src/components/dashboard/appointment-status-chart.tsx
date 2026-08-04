"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalendarCheck } from "lucide-react";

interface Props {
  data: {
    status: string;
  }[];
}

const STATUS_CONFIG = {
  Scheduled: {
    color: "#60a5fa",
    bg: "bg-blue-500",
  },

  Confirmed: {
    color: "#34d399",
    bg: "bg-emerald-500",
  },

  Completed: {
    color: "#a1a1aa",
    bg: "bg-zinc-400",
  },

  Cancelled: {
    color: "#f87171",
    bg: "bg-red-500",
  },
};

function CustomTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 shadow-2xl">

      <p className="text-sm text-zinc-400">
        {payload[0].name}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {payload[0].value}
      </p>

    </div>
  );
}

export default function AppointmentStatusChart({
  data,
}: Props) {

  const chartData = [
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled",
  ].map((status) => ({
    name: status,
    value: data.filter(
      (item) => item.status === status
    ).length,
  }));

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Card className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">

      <CardHeader>

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">

            <CalendarCheck className="h-6 w-6 text-white" />

          </div>

          <div>

            <CardTitle className="text-xl font-semibold text-white">
              Appointment Status
            </CardTitle>

            <p className="mt-1 text-sm text-zinc-500">
              Current appointment distribution
            </p>

          </div>

        </div>

      </CardHeader>

      <CardContent className="h-[360px]">

        <div className="relative h-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={5}
                stroke="none"
              >

                {chartData.map((entry) => (

                  <Cell
                    key={entry.name}
                    fill={
                      STATUS_CONFIG[
                        entry.name as keyof typeof STATUS_CONFIG
                      ].color
                    }
                  />

                ))}

              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />

            </PieChart>

          </ResponsiveContainer>

          {/* Center */}

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

            <h2 className="text-4xl font-bold text-white">
              {total}
            </h2>

            <p className="mt-1 text-sm text-zinc-500 text-center">
              Total<br/>Appointments
            </p>

          </div>

        </div>

        {/* Legend */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          {chartData.map((item) => {

            const config =
              STATUS_CONFIG[
                item.name as keyof typeof STATUS_CONFIG
              ];

            return (

              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-900/70 px-4 py-3 transition hover:border-indigo-500/20"
              >

                <div className="flex items-center gap-3">

                  <span
                    className={`h-3 w-3 rounded-full ${config.bg}`}
                  />

                  <span className="text-sm text-zinc-300">
                    {item.name}
                  </span>

                </div>

                <span className="font-bold text-white">
                  {item.value}
                </span>

              </div>

            );

          })}

        </div>

      </CardContent>

    </Card>
  );
}