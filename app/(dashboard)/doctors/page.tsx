import AddDoctorDialog from "@/components/doctors/add-doctor-dialog";
import { EditDoctorDialog } from "@/components/doctors/edit-doctor-dialog";
import { createClient } from "@/lib/supabase/server";
import { DeleteDoctorDialog } from "@/components/doctors/delete-doctor-dialog";
import { Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const supabase = await createClient();

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const doctorList = doctors ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Doctors
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage doctors, specialties, and availability.
          </p>
        </div>

        <AddDoctorDialog />
      </div>

      {/* Doctors */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctorList.map((doctor) => (
          <Card
            key={doctor.id}
            className="border-zinc-800 bg-zinc-900 text-white"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500/10 p-3">
                  <Stethoscope
                    size={22}
                    className="text-indigo-400"
                  />
                </div>

                <div>
                  <CardTitle className="text-base">
                    {doctor.name}
                  </CardTitle>

                  <p className="text-sm text-zinc-400">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Patients
                </span>

                <span>{doctor.patients ?? 0}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-sm text-zinc-400">
                  Status
                </span>

                <Badge>{doctor.availability}</Badge>
              </div>

              <div className="mt-6 flex gap-2">
                <EditDoctorDialog doctor={doctor} />

                <DeleteDoctorDialog
                  doctorId={doctor.id}
                  doctorName={doctor.name}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}