"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { EditDoctorDialog } from "./edit-doctor-dialog";
import { DeleteDoctorDialog } from "./delete-doctor-dialog";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  work_start: string | null;
  work_end: string | null;
}

interface Props {
  doctors: Doctor[];
}

export default function DoctorsList({
  doctors,
}: Props) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "available" | "busy"
  >("all");


  const filteredDoctors = useMemo(() => {
    let result = doctors;


    if (filter === "available") {
      result = result.filter(
        (doctor) =>
          doctor.availability === "Available"
      );
    }


    if (filter === "busy") {
      result = result.filter(
        (doctor) =>
          doctor.availability !== "Available"
      );
    }


    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(q) ||
          doctor.specialty.toLowerCase().includes(q) ||
          doctor.availability.toLowerCase().includes(q)
      );
    }


    return result;

  }, [search, filter, doctors]);


  return (
    <div className="space-y-6">


      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search doctors..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

        </div>


        <div className="flex gap-3">

          <Button
            variant={
              filter === "all"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setFilter("all")
            }
            className="rounded-xl"
          >
            All Doctors
          </Button>


          <Button
            variant={
              filter === "available"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setFilter("available")
            }
            className="rounded-xl"
          >
            Available
          </Button>


          <Button
            variant={
              filter === "busy"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setFilter("busy")
            }
            className="rounded-xl"
          >
            Busy
          </Button>

        </div>

      </div>



      <div className="space-y-4">

        {filteredDoctors.length ? (

          filteredDoctors.map((doctor) => (

            <Card
              key={doctor.id}
              className="group overflow-hidden border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
            >

              <CardContent className="flex items-center justify-between p-7">


                <div className="flex items-center gap-5">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">

                    {doctor.name.charAt(0)}

                  </div>


                  <div>

                    <h3 className="text-lg font-semibold text-white">
                      {doctor.name}
                    </h3>


                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        🩺 {doctor.specialty}
                      </span>


                      {doctor.work_start &&
                        doctor.work_end && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            🕘{" "}
                            {doctor.work_start.slice(0, 5)}
                            {" - "}
                            {doctor.work_end.slice(0, 5)}
                          </span>
                        )}

                    </div>

                  </div>

                </div>



                <div className="flex items-center gap-3">


                  <Badge
                    className={`rounded-full px-4 py-1 font-medium ${
                      doctor.availability === "Available"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : doctor.availability === "Busy"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {doctor.availability}
                  </Badge>


                  <EditDoctorDialog
                    doctor={doctor}
                  />


                  <DeleteDoctorDialog
                    doctorId={doctor.id}
                    doctorName={doctor.name}
                  />


                </div>


              </CardContent>


            </Card>

          ))

        ) : (

          <Card>

            <CardContent className="py-24 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                👨‍⚕️
              </div>


              <h3 className="mt-6 text-lg font-semibold text-white">
                No doctors found
              </h3>


              <p className="mt-2 text-zinc-400">
                Try another search or add a new doctor.
              </p>


            </CardContent>

          </Card>

        )}

      </div>


    </div>
  );
}