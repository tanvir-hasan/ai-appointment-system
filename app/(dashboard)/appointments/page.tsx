import EditAppointmentDialog from "@/components/appointments/edit-appointment-dialog";
import DeleteAppointmentDialog from "@/components/appointments/delete-appointment-dialog";
import { createClient } from "@/lib/supabase/server";
import AppointmentsList from "@/components/appointments/appointments-list";
import AddAppointmentDialog from "@/components/appointments/add-appointment-dialog";
import {
  CalendarDays,
  Clock,
  UserRound,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

function badgeColor(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-green-600 hover:bg-green-600";

    case "Scheduled":
      return "bg-blue-600 hover:bg-blue-600";

    case "Completed":
      return "bg-zinc-600 hover:bg-zinc-600";

    case "Cancelled":
      return "bg-red-600 hover:bg-red-600";

    default:
      return "";
  }
}

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`
      *,
      patients (
        name
      ),
      doctors (
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
    console.error(error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
		<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

		  <div>

			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
			  Appointment Management
			</p>

			<h1 className="mt-2 text-4xl font-bold tracking-tight">
			  Appointments
			</h1>

			<p className="mt-3 max-w-2xl text-muted-foreground">
			  Schedule, monitor and manage all patient appointments in one place.
			</p>

		  </div>

		  <AddAppointmentDialog
			patients={patients ?? []}
			doctors={doctors ?? []}
		  />

		</div>
		<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
		  <Card className="border border-white/10 bg-zinc-900 shadow-xl shadow-black/20">
			<CardContent className="p-6">
			  <p className="text-sm text-zinc-400">
				Total Appointments
			  </p>

			  <h2 className="mt-3 text-4xl font-bold text-white">
				{appointments?.length ?? 0}
			  </h2>
			</CardContent>
		  </Card>

		  <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-900 shadow-xl shadow-black/20">
			<CardContent className="p-6">
			  <p className="text-sm text-zinc-400">
				Confirmed
			  </p>

			  <h2 className="mt-3 text-4xl font-bold text-emerald-400">
				{appointments?.filter(
				  (a) => a.status === "Confirmed"
				).length ?? 0}
			  </h2>
			</CardContent>
		  </Card>

		  <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-zinc-900 shadow-xl shadow-black/20">
			<CardContent className="p-6">
			  <p className="text-sm text-zinc-400">
				Scheduled
			  </p>

			  <h2 className="mt-3 text-4xl font-bold text-blue-400">
				{appointments?.filter(
				  (a) => a.status === "Scheduled"
				).length ?? 0}
			  </h2>
			</CardContent>
		  </Card>

		  <Card className="border border-zinc-700 bg-zinc-900 shadow-xl shadow-black/20">
			<CardContent className="p-6">
			  <p className="text-sm text-zinc-400">
				Completed
			  </p>

			  <h2 className="mt-3 text-4xl font-bold text-zinc-300">
				{appointments?.filter(
				  (a) => a.status === "Completed"
				).length ?? 0}
			  </h2>
			</CardContent>
		  </Card>
		</div>

		<AppointmentsList
		  appointments={appointments ?? []}
		  patients={patients ?? []}
		  doctors={doctors ?? []}
		>
	</AppointmentsList>
    </div>
  );
}