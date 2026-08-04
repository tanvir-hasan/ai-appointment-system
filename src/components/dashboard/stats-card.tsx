import { LucideIcon, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/15">

      {/* Background Glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/20" />

      <CardContent className="relative p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              {title}
            </p>

            <h2 className="mt-3 text-5xl font-bold tracking-tight text-white">
              {value}
            </h2>

          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-4 shadow-xl shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">

            <Icon
              size={24}
              className="text-white"
            />

          </div>

        </div>

        {/* Progress Accent */}

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">

          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />

        </div>

        <div className="mt-5 flex items-center justify-between">

          <p className="text-sm text-zinc-400">
            {description}
          </p>

          {trend && (

            <div className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">

              <TrendingUp
                size={14}
                className="text-emerald-400"
              />

              <span className="text-xs font-semibold text-emerald-400">
                {trend}
              </span>

            </div>

          )}

        </div>

      </CardContent>

    </Card>
  );
}