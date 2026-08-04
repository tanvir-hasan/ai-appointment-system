import {
  CalendarDays,
  Users,
  Stethoscope,
  Clock,
} from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { DoctorStatus } from "@/components/dashboard/doctor-status";
import AppointmentStatusChart from "@/components/dashboard/appointment-status-chart";
import WeeklyAppointmentsChart from "@/components/dashboard/weekly-appointments-chart";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const now = new Date();

  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}`;

  const [
    { count: patientCount },
    { count: doctorCount },
    { count: todayAppointmentCount },
    { count: pendingCount },
    { data: appointmentStatuses },
    { data: appointmentDates },
  ] = await Promise.all([
    supabase
      .from("patients")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("doctors")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", today),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "Scheduled"),

    supabase
      .from("appointments")
      .select("status"),

    supabase
      .from("appointments")
      .select("appointment_date"),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-2">

      {/* ================= HEADER ================= */}

		{/* Hero Section */}

		<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 shadow-2xl">

		  <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

		  <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

		  <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

			{/* Left */}

			<div className="max-w-2xl">

			  <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-100 backdrop-blur">
				Healthcare Dashboard
			  </span>

			  <h1 className="mt-5 text-4xl font-bold text-white">
				Welcome back,
				<span className="ml-2 text-indigo-100">
				  Tanvir 👋
				</span>
			  </h1>

			  <p className="mt-3 text-base leading-7 text-indigo-100/90">
				Here's a quick overview of today's appointments,
				doctors and patients.
			  </p>

			</div>

			{/* Right */}

			<div className="grid grid-cols-2 gap-4">

			  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

				<p className="text-xs uppercase tracking-wide text-indigo-100">
				  Today
				</p>

				<p className="mt-2 text-lg font-semibold text-white">
				  {new Date().toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
				  })}
				</p>

			  </div>

			  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

				<p className="text-xs uppercase tracking-wide text-indigo-100">
				  System
				</p>

				<div className="mt-3 flex items-center gap-2">

				  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

				  <span className="font-medium text-white">
					Online
				  </span>

				</div>

			  </div>

			</div>

		  </div>

		</div>

      {/* ================= STATS ================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Today's Appointments"
          value={todayAppointmentCount ?? 0}
          description="Appointments scheduled today"
          trend="+12%"
          icon={CalendarDays}
        />

        <StatsCard
          title="Total Patients"
          value={patientCount ?? 0}
          description="Registered patients"
          trend="+8%"
          icon={Users}
        />

        <StatsCard
          title="Doctors"
          value={doctorCount ?? 0}
          description="Medical professionals"
          trend="+3%"
          icon={Stethoscope}
        />

        <StatsCard
          title="Pending Requests"
          value={pendingCount ?? 0}
          description="Awaiting confirmation"
          trend="+18%"
          icon={Clock}
        />
      </div>

      {/* ================= PERFORMANCE ================= */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-semibold">
            Performance Overview
          </h2>

          <p className="text-sm text-muted-foreground">
            Appointment statistics for this week.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <WeeklyAppointmentsChart
              data={appointmentDates ?? []}
            />
          </div>

          <AppointmentStatusChart
            data={appointmentStatuses ?? []}
          />

        </div>

      </div>

      {/* ================= RECENT ACTIVITY ================= */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-semibold">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest appointments and doctor availability.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <RecentAppointments />

          <DoctorStatus />

        </div>

      </div>

    </div>
  );
}