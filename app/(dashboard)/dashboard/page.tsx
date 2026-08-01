import {
  CalendarDays,
  Users,
  Stethoscope,
  Clock,
} from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { DoctorStatus } from "@/components/dashboard/doctor-status";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
const supabase = await createClient();

const { count: patientCount } = await supabase
  .from("patients")
  .select("*", { count: "exact", head: true });


const { count: doctorCount } = await supabase
  .from("doctors")
  .select("*", { count: "exact", head: true });


const now = new Date();

const today =
  `${now.getFullYear()}-` +
  `${String(now.getMonth() + 1).padStart(2, "0")}-` +
  `${String(now.getDate()).padStart(2, "0")}`;
  
console.log("Database date:", today);

const { count: todayAppointmentCount } = await supabase
  .from("appointments")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("appointment_date", today);
const { count: pendingCount } = await supabase
  .from("appointments")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("status", "Scheduled");
  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Welcome back. Here's what's happening today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
			  title="Today's Appointments"
			  value={todayAppointmentCount ?? 0}
			  description="Appointments today"
			  trend=""
			  icon={CalendarDays}
			/>

			<StatsCard
			  title="Total Patients"
			  value={patientCount ?? 0}
			  description="Patients registered"
			  trend=""
			  icon={Users}
			/>

			<StatsCard
			  title="Doctors"
			  value={doctorCount ?? 0}
			  description="Doctors registered"
			  trend=""
			  icon={Stethoscope}
			/>

			<StatsCard
			  title="Pending Requests"
			  value={pendingCount ?? 0}
			  description="Awaiting confirmation"
			  trend=""
			  icon={Clock}
			/>
        </div>

        {/* Main Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAppointments />

          <DoctorStatus />
        </div>
      </div>
  );
}