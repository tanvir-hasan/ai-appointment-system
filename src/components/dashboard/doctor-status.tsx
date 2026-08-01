import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function DoctorStatus() {
  const supabase = await createClient();

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select("id, name, availability")
    .order("name");

  if (error) {
    console.error(error);
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle>
          Doctor Availability
        </CardTitle>
      </CardHeader>

      <CardContent>
        {doctors && doctors.length > 0 ? (
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between"
              >
                <span>{doctor.name}</span>

                <span
                  className={`text-sm font-medium ${
                    doctor.availability === "Available"
                      ? "text-green-400"
                      : doctor.availability === "Busy"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {doctor.availability}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-400">
            No doctors found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}