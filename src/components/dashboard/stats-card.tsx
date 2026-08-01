import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
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
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <p className="text-sm font-medium text-zinc-400">
          {title}
        </p>

        <div className="rounded-lg bg-indigo-500/10 p-2">
          <Icon
            size={20}
            className="text-indigo-400"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight">
          {value}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <span className="text-xs font-medium text-green-400">
              {trend}
            </span>
          )}

          <span className="text-xs text-zinc-500">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}