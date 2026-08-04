import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import {
  CalendarDays,
  Clock3,
  Stethoscope,
  ChevronRight,
} from "lucide-react";


function formatTime(time: string) {
  const [hour, minute] = time.split(":");

  return new Date(
    2000,
    0,
    1,
    Number(hour),
    Number(minute)
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


function getStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";

    case "Scheduled":
      return "bg-blue-500/15 text-blue-400 border border-blue-500/20";

    case "Completed":
      return "bg-zinc-700/40 text-zinc-300 border border-zinc-700";

    case "Cancelled":
      return "bg-red-500/15 text-red-400 border border-red-500/20";

    default:
      return "bg-zinc-700 text-zinc-300";
  }
}


export async function RecentAppointments() {

  const supabase = await createClient();


  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      patients (
        name
      ),
      doctors (
        name
      )
    `)
    .order("appointment_date", {
      ascending: false,
    })
    .order("appointment_time", {
      ascending: false,
    })
    .limit(5);



  return (
    <Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-xl">

      <CardHeader className="border-b border-white/5 pb-5">

        <div className="flex items-center justify-between">

          <CardTitle className="text-xl font-bold text-white">
            Recent Appointments
          </CardTitle>


          <Link
            href="/appointments"
            className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>


        </div>

      </CardHeader>



      <CardContent className="space-y-4 p-6">


        {appointments?.length ? (

          appointments.map((appointment) => (

            <div
              key={appointment.id}
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
            >


              <div className="flex items-center gap-4">


                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/30">

                  {appointment.patients?.[0]?.name?.charAt(0) ?? "?"}

                </div>



                <div>


                  <h3 className="text-base font-semibold text-white">

                    {appointment.patients?.[0]?.name ?? "Unknown Patient"}

                  </h3>



                  <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">

                    <Stethoscope className="h-4 w-4 text-indigo-400" />

                    Dr. {appointment.doctors?.[0]?.name ?? "Unknown Doctor"}

                  </div>



                  <div className="mt-3 flex flex-wrap gap-2">


                    <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">

                      <CalendarDays className="h-3.5 w-3.5" />

                      {formatDate(
                        appointment.appointment_date
                      )}

                    </span>



                    <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">

                      <Clock3 className="h-3.5 w-3.5" />

                      {formatTime(
                        appointment.appointment_time
                      )}

                    </span>


                  </div>


                </div>


              </div>



              <Badge
                className={getStatusStyle(
                  appointment.status
                )}
              >

                {appointment.status}

              </Badge>


            </div>

          ))

        ) : (

          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-zinc-500">

            No recent appointments

          </div>

        )}


      </CardContent>


    </Card>
  );
}