"use client";

import { useMemo, useState } from "react";

import type {
  Appointment,
  Patient,
  Doctor,
} from "@/types/database";

import {
  CalendarDays,
  Clock,
  UserRound,
  Pencil,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import AppointmentFilters from "./appointment-filters";
import EditAppointmentDialog from "./edit-appointment-dialog";
import DeleteAppointmentDialog from "./delete-appointment-dialog";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface Props {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}

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

export default function AppointmentsList({
  appointments,
  patients,
  doctors,
}: Props) {
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [doctor, setDoctor] = useState("all");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<any>(null);

  async function updateStatus(
    id: string,
    newStatus: string
  ) {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Appointment updated.");

    window.location.reload();
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        appointment.patients?.name?.toLowerCase() ?? "";

      const doctorName =
        appointment.doctors?.name?.toLowerCase() ?? "";

      const matchesSearch =
        patientName.includes(search.toLowerCase()) ||
        doctorName.includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        appointment.status === status;

      const matchesDoctor =
        doctor === "all" ||
        appointment.doctor_id === doctor;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDoctor
      );
    });
  }, [
    appointments,
    search,
    status,
    doctor,
  ]);

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.appointment_date ===
      new Date().toISOString().split("T")[0]
  );
  
  return (
  <div className="space-y-6">

    <AppointmentFilters
      search={search}
      onSearchChange={setSearch}
      status={status}
      onStatusChange={setStatus}
      doctor={doctor}
      onDoctorChange={setDoctor}
      doctors={doctors}
    />

    <Card className="border border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-xl shadow-black/20">

      <CardHeader>

        <CardTitle className="text-xl">
          Appointments
        </CardTitle>

      </CardHeader>

      <CardContent>

        {filteredAppointments.length ? (

          <div className="space-y-4">

            {filteredAppointments.map((appointment) => (

              <div
                key={appointment.id}
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
              >

                {/* Left */}

                <div className="flex items-center gap-5">

                  <div
                    className="
                      flex h-14 w-14 shrink-0 items-center justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      via-violet-500
                      to-fuchsia-600
                      text-base
                      font-bold
                      tracking-wide
                      text-white
                    "
                  >
                    {(appointment.patients?.name ?? "")
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      {appointment.patients?.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Patient Appointment
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">

                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300">

                        <UserRound size={14} />

                        {appointment.doctors?.name}

                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300">

                        <Clock size={14} />

                        {formatTime(
                          appointment.appointment_time
                        )}

                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300">

                        <CalendarDays size={14} />

                        {formatDate(
                          appointment.appointment_date
                        )}

                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300">

                        ⏱

                        {appointment.duration_minutes ?? 30}
                        min

                      </div>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-2">

                  <Badge
                    className={`min-w-[120px] justify-center rounded-full border px-4 py-2 text-sm font-semibold ${
                      appointment.status === "Confirmed"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : appointment.status === "Scheduled"
                        ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                        : appointment.status === "Completed"
                        ? "border-zinc-600 bg-zinc-800 text-zinc-300"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}
                  >

                    {appointment.status}

                  </Badge>

                  {appointment.status === "Scheduled" && (

                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500"
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "Confirmed"
                        )
                      }
                    >

                      <CheckCircle2 className="mr-2 h-4 w-4" />

                      Confirm

                    </Button>

                  )}

                  {appointment.status === "Confirmed" && (

                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500"
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "Completed"
                        )
                      }
                    >

                      <ClipboardCheck className="mr-2 h-4 w-4" />

                      Complete

                    </Button>

                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-xl border-white/10 bg-zinc-900 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
                    onClick={() => {
                      setSelectedAppointment(
                        appointment
                      );
                      setEditOpen(true);
                    }}
                  >

                    <Pencil className="h-4 w-4" />

                  </Button>

                  <DeleteAppointmentDialog
                    appointmentId={appointment.id}
                  />

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="py-20 text-center text-zinc-500">
            No appointments found.
          </div>

        )}

      </CardContent>

    </Card>

    {selectedAppointment && (

      <EditAppointmentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        appointment={selectedAppointment}
        patients={patients}
        doctors={doctors}
      />

    )}

  </div>
);
}