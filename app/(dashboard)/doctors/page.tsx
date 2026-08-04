import AddDoctorDialog from "@/components/doctors/add-doctor-dialog";
import DoctorsList from "@/components/doctors/doctor-list";
import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const supabase = await createClient();

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select(`
      id,
      name,
      specialty,
      availability,
      work_start,
      work_end
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
  }

  const doctorList = doctors ?? [];

  const totalDoctors = doctorList.length;

  const availableDoctors = doctorList.filter(
    (doctor) => doctor.availability === "Available"
  ).length;

  const busyDoctors = doctorList.filter(
    (doctor) => doctor.availability !== "Available"
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Doctor Management
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
            Doctors
          </h1>

          <p className="mt-3 max-w-xl text-zinc-400">
            Manage your medical staff, monitor availability, and keep schedules
            up to date.
          </p>

        </div>

        <AddDoctorDialog />

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* Total */}

        <Card className="border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-xl shadow-black/20">

          <CardContent className="p-6">

            <p className="text-sm font-medium text-zinc-400">
              Total Doctors
            </p>

            <h2 className="mt-3 text-5xl font-bold tracking-tight text-white">
              {totalDoctors}
            </h2>

          </CardContent>

        </Card>

        {/* Available */}

        <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-950 shadow-xl shadow-emerald-500/5">

          <CardContent className="p-6">

            <p className="text-sm font-medium text-zinc-400">
              Available
            </p>

            <h2 className="mt-3 text-5xl font-bold tracking-tight text-emerald-400">
              {availableDoctors}
            </h2>

          </CardContent>

        </Card>

        {/* Busy */}

        <Card className="border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-zinc-950 shadow-xl shadow-amber-500/5">

          <CardContent className="p-6">

            <p className="text-sm font-medium text-zinc-400">
              Busy / On Leave
            </p>

            <h2 className="mt-3 text-5xl font-bold tracking-tight text-amber-400">
              {busyDoctors}
            </h2>

          </CardContent>

        </Card>

      </div>

      {/* Doctors List */}

      <DoctorsList doctors={doctorList} />

    </div>
  );
}