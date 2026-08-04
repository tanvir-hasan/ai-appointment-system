import { createClient } from "@/lib/supabase/server";
import AppointmentCalendar from "@/components/calendar/appointment-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment } from "@/types/database";

export default async function CalendarPage() {
  const supabase = await createClient();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`
      id,
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      status,
      notes,
      patients (
        id,
        name
      ),
      doctors (
        id,
        name
      )
    `)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });


  const { data: patients } = await supabase
    .from("patients")
    .select("id, name")
    .order("name");


  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, name")
    .order("name");


  if (error) {
    console.error("Appointment fetch error:", error);
  }


  // Convert Supabase relationship arrays into objects
  const appointmentList: Appointment[] =
    appointments?.map((appointment) => ({
      ...appointment,
      patients: appointment.patients?.[0] ?? null,
      doctors: appointment.doctors?.[0] ?? null,
    })) ?? [];


  const confirmed = appointmentList.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;


  const scheduled = appointmentList.filter(
    (appointment) => appointment.status === "Scheduled"
  ).length;


  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Calendar Overview
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Appointment Calendar
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            View appointments by date and keep track of your team's schedule.
          </p>

        </div>

      </div>


      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10">

          <p className="text-sm font-medium text-zinc-400">
            Total Appointments
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {appointmentList.length}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            All appointments
          </p>

        </div>


        <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10">

          <p className="text-sm font-medium text-zinc-400">
            Confirmed
          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-400">
            {confirmed}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Ready for consultation
          </p>

        </div>


        <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">

          <p className="text-sm font-medium text-zinc-400">
            Scheduled
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-400">
            {scheduled}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Waiting confirmation
          </p>

        </div>

      </div>


      {/* Calendar */}

      <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950">

        <CardContent className="p-6">

          <AppointmentCalendar
            appointments={appointmentList}
            patients={patients ?? []}
            doctors={doctors ?? []}
          />

        </CardContent>

      </Card>


    </div>
  );
}