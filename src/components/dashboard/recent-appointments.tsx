import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function formatTime(time: string) {
  const [hour, minute] = time.split(":");

  const h = Number(hour);

  return new Date(
    2000,
    0,
    1,
    h,
    Number(minute)
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export async function RecentAppointments() {
  const supabase = await createClient();

  const { data: appointments, error } = await supabase
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
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>

      <CardContent>
        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 hover:bg-zinc-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-semibold">
                    {appointment.patients?.name}
                  </p>

                  <p className="text-sm text-zinc-400">
                    👨‍⚕️ {appointment.doctors?.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    📅 {appointment.appointment_date}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-sm font-medium">
                    🕒 {formatTime(appointment.appointment_time)}
                  </p>

                  <Badge
                    className={
                      appointment.status === "Confirmed"
                        ? "bg-green-600"
                        : appointment.status === "Scheduled"
                        ? "bg-blue-600"
                        : appointment.status === "Completed"
                        ? "bg-zinc-600"
                        : "bg-red-600"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-zinc-400">
            No recent appointments.
          </div>
        )}
      </CardContent>
    </Card>
  );
}