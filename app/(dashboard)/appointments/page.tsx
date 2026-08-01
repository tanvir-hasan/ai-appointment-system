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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Appointments
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage and track patient appointments.
          </p>
        </div>

        <AddAppointmentDialog
          patients={patients ?? []}
          doctors={doctors ?? []}
        />
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