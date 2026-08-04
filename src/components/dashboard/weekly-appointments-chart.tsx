"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalendarDays } from "lucide-react";

interface Props {
  data: {
    appointment_date: string;
  }[];
}

const DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function CustomTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-wider text-zinc-400">
        Appointments
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {payload[0].value}
      </p>
    </div>
  );
}

export default function WeeklyAppointmentsChart({
  data,
}: Props) {
  const chartData = DAYS.map((day) => ({
    day,
    appointments: 0,
  }));

  data.forEach((appointment) => {
    const date = new Date(
      appointment.appointment_date
    );

    chartData[date.getDay()].appointments += 1;
  });

  const totalAppointments = chartData.reduce(
    (sum, item) => sum + item.appointments,
    0
  );

  return (
    <Card className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10">

      <CardHeader className="flex flex-row items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">

            <CalendarDays className="h-6 w-6 text-white" />

          </div>

          <div>

            <CardTitle className="text-xl font-semibold text-white">
              Weekly Appointments
            </CardTitle>

            <p className="text-sm text-zinc-500">
              Appointments across the week
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Total
          </p>

          <p className="text-3xl font-bold text-indigo-400">
            {totalAppointments}
          </p>

        </div>

      </CardHeader>

      <CardContent className="h-[360px] pt-4">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            barCategoryGap="28%"
          >
            <defs>
              <linearGradient
                id="appointmentsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#818CF8"
                />

                <stop
                  offset="100%"
                  stopColor="#4F46E5"
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "#71717a",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: "#71717a",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />

            <Tooltip
              cursor={{
                fill: "rgba(99,102,241,.08)",
              }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="appointments"
              fill="url(#appointmentsGradient)"
              radius={[12, 12, 12, 12]}
              maxBarSize={42}
            />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>

    </Card>
  );
}