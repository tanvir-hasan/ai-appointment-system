"use client";

import { useMemo, useState } from "react";

import {
  CalendarDays,
  Clock,
  UserRound,
} from "lucide-react";

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

interface Props {
  appointments: any[];
  patients: any[];
  doctors: any[];
  children: React.ReactNode;
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

export default function AppointmentsList({
  appointments,
  patients,
  doctors,
  children,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [doctor, setDoctor] = useState("all");

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
	}, [appointments, search, status, doctor]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<AppointmentFilters
		  search={search}
		  onSearchChange={setSearch}
		  status={status}
		  onStatusChange={setStatus}
		  doctor={doctor}
		  onDoctorChange={setDoctor}
		  doctors={doctors}
		/>

        {children}
      </div>

      <Card className="border-zinc-800 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle>
            Appointments
          </CardTitle>
        </CardHeader>

        <CardContent>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 p-5 transition-all hover:border-indigo-500 hover:bg-zinc-800/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-indigo-500/10 p-3">
                      <CalendarDays
                        size={24}
                        className="text-indigo-400"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {appointment.patients?.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-5 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <UserRound size={15} />
                          {appointment.doctors?.name}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={15} />
                          {formatTime(
                            appointment.appointment_time
                          )}
                        </span>

                        <span>
                          📅{" "}
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={badgeColor(
                        appointment.status
                      )}
                    >
                      {appointment.status}
                    </Badge>

                    <EditAppointmentDialog
                      appointment={{
                        id: appointment.id,
                        patient_id: appointment.patient_id,
                        doctor_id: appointment.doctor_id,
                        appointment_date:
                          appointment.appointment_date,
                        appointment_time:
                          appointment.appointment_time,
                        status: appointment.status,
                      }}
                      patients={patients}
                      doctors={doctors}
                    />

                    <DeleteAppointmentDialog
                      appointmentId={appointment.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-400">
              No appointments found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}