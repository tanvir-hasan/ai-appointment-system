import { Search, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog";

export default async function PatientsPage() {
  const supabase = await createClient();

  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Patients
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage patient profiles and medical records.
          </p>
        </div>

        <AddPatientDialog />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <Search
          size={18}
          className="text-zinc-400"
        />

        <input
          placeholder="Search patients..."
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </div>

      {/* Patients List */}
      <Card className="border-zinc-800 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle>
            Patient Directory
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {patients?.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-500/10 p-3">
                    <UserRound
                      size={20}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">
                      {patient.name}
                    </h3>

                    <p className="text-sm text-zinc-400">
                      Age: {patient.age} · {patient.phone}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {patient.patient_email}
                    </p>
                  </div>
                </div>

				<div className="flex items-center gap-3">
				  <Badge>
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
              </div>
            ))}

            {patients?.length === 0 && (
              <div className="py-10 text-center text-zinc-400">
                No patients found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}