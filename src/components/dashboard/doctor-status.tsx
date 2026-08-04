import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Circle } from "lucide-react";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

function getStatusStyle(status: string) {
  switch (status) {
    case "Available":
      return {
        badge:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
        dot: "text-emerald-400",
      };

    case "Busy":
      return {
        badge:
          "bg-amber-500/15 text-amber-400 border border-amber-500/20",
        dot: "text-amber-400",
      };

    case "On Leave":
      return {
        badge:
          "bg-red-500/15 text-red-400 border border-red-500/20",
        dot: "text-red-400",
      };

    default:
      return {
        badge:
          "bg-zinc-700 text-zinc-300 border border-zinc-600",
        dot: "text-zinc-400",
      };
  }
}

export async function DoctorStatus() {
  const supabase = await createClient();

  const { data: doctors } = await supabase
    .from("doctors")
    .select(`
  id,
  name,
  specialty,
  availability,
  work_start,
  work_end
`)
    .order("name");

  return (
    <Card className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">

		<CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-5">

		  <CardTitle className="text-xl font-semibold text-white">
			Doctor Availability
		  </CardTitle>

		  <Link
			href="/doctors"
			className="flex items-center gap-1 text-sm text-indigo-400 transition hover:text-indigo-300"
		  >
			View all
			<ChevronRight className="h-4 w-4" />
		  </Link>

		</CardHeader>

      <CardContent className="space-y-4 p-6">

        {doctors && doctors.length > 0 ? (

          <div className="space-y-4">

            {doctors.map((doctor) => {
              const status = getStatusStyle(
                doctor.availability
              );

              return (
                <div
                  key={doctor.id}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-zinc-800/60"
                >

                  {/* Left */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
                      {doctor.name.charAt(0)}
                    </div>

                    <div>

                      <p className="font-semibold text-white">
                        {doctor.name}
                      </p>

						<p className="text-sm text-zinc-500">
						  {doctor.specialty ?? "General Physician"}
						</p>

						<p className="mt-1 text-xs text-zinc-500">
						  🕘 {doctor.work_start?.slice(0, 5)} - {doctor.work_end?.slice(0, 5)}
						</p>

						<div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">

						  <Circle
							className={`h-2.5 w-2.5 fill-current animate-pulse ${status.dot}`}
						  />

						  {doctor.availability}

						</div>

                    </div>

                  </div>

                  {/* Right */}

                  <Badge
                    className={`rounded-full px-4 py-1 font-medium ${status.badge}`}
                  >
                    {doctor.availability}
                  </Badge>

                </div>
              );
            })}

          </div>

        ) : (

          <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl">
              👨‍⚕️
            </div>

            <p className="font-medium text-zinc-300">
              No doctors available
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Add your first doctor to get started.
            </p>

          </div>

        )}

      </CardContent>

    </Card>
  );
}