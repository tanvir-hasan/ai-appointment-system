"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

	export default function PatientsPage() {
  const supabase = createClient();

	const [patients, setPatients] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, [search]);

	async function loadPatients() {
	  setLoading(true);

	  let query = supabase
		.from("patients")
		.select("*")
		.order("created_at", {
		  ascending: false,
		});

	  if (search.trim()) {
		query = query.or(
		  `name.ilike.%${search}%,phone.ilike.%${search}%,patient_email.ilike.%${search}%`
		);
	  }

	  const { data, error } = await query;

	  if (error) {
		console.error(error);
	  }

	  setPatients(data ?? []);
	  setLoading(false);
	}

  const totalPatients = patients?.length ?? 0;

  const activePatients =
    patients?.filter(
      (patient) =>
        (patient.status ?? "Active") === "Active"
    ).length ?? 0;

  const newPatients = patients?.slice(0, 5).length ?? 0;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Patient Management
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Patients
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Manage patient profiles, contact information and medical records in one place.
          </p>

        </div>

        <AddPatientDialog />

      </div>

      {/* Statistics */}

		<div className="grid gap-6 md:grid-cols-3">

		  {/* Total Patients */}

		  <Card className="border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-xl shadow-black/20">
			<CardContent className="p-6">

			  <p className="text-sm font-medium text-zinc-400">
				Total Patients
			  </p>

			  <h2 className="mt-3 text-5xl font-bold tracking-tight text-white">
				{totalPatients}
			  </h2>

			</CardContent>
		  </Card>

		  {/* Active Patients */}

		  <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-950 shadow-xl shadow-emerald-500/5">
			<CardContent className="p-6">

			  <p className="text-sm font-medium text-zinc-400">
				Active Patients
			  </p>

			  <h2 className="mt-3 text-5xl font-bold tracking-tight text-emerald-400">
				{activePatients}
			  </h2>

			</CardContent>
		  </Card>

		  {/* Recently Added */}

		  <Card className="border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-zinc-950 shadow-xl shadow-indigo-500/5">
			<CardContent className="p-6">

			  <p className="text-sm font-medium text-zinc-400">
				Recently Added
			  </p>

			  <h2 className="mt-3 text-5xl font-bold tracking-tight text-indigo-400">
				{newPatients}
			  </h2>

			</CardContent>
		  </Card>

		</div>

      {/* Search */}

		<div className="relative max-w-md">

		  <Search
			size={18}
			className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
		  />

		  <input
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			placeholder="Search patients..."
			className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
		  />

		</div>

      {/* Patient Cards */}

      <div className="space-y-4">
	  {loading ? null : patients.length ? (
	  patients.map((patient) => (
    <Card
      key={patient.id}
      className="group overflow-hidden border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <CardContent className="flex items-center justify-between p-7">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {patient.name?.charAt(0)}
          </div>

          <div>

            <h3 className="text-lg font-semibold text-white">
              {patient.name}
            </h3>

			<div className="mt-3 flex flex-wrap gap-2">

			  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
				📱 {patient.phone}
			  </span>

			  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
				🎂 {patient.age} Years
			  </span>

			  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
				✉️ {patient.patient_email}
			  </span>

			</div>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <Badge
            className={`rounded-full px-4 py-1 font-medium ${
              (patient.status ?? "Active") === "Active"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-zinc-700 text-zinc-300"
            }`}
          >
            {patient.status ?? "Active"}
          </Badge>

          <EditPatientDialog
            patient={patient}
          />

          <DeletePatientDialog
            patientId={patient.id}
            patientName={patient.name}
          />

        </div>

      </CardContent>
    </Card>
  ))
) : (
  <Card>
	<CardContent className="py-24 text-center">
	  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
		👤
	  </div>

	  <h3 className="mt-6 text-lg font-semibold text-white">
		No patients found
	  </h3>

	  <p className="mt-2 text-zinc-400">
		Add your first patient to get started.
	  </p>
	</CardContent>
  </Card>
)}

      </div>
    </div>
  );
}