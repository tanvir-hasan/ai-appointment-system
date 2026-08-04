"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Pencil,
  CalendarDays,
  Clock3,
  User,
  Stethoscope,
} from "lucide-react";

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  appointment: {
    id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;

    patients: {
      name: string;
    } | null;

    doctors: {
      name: string;
    } | null;
  } | null;

  onEdit?: () => void;
}

function badgeColor(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";

    case "Scheduled":
      return "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20";

    case "Completed":
      return "bg-zinc-700/50 text-zinc-300 border border-zinc-700";

    case "Cancelled":
      return "bg-red-500/15 text-red-400 border border-red-500/20";

    default:
      return "bg-zinc-700 text-white";
  }
}

export default function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onEdit,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black text-white shadow-2xl">

        <DialogHeader className="pb-4 border-b border-white/10">

          <DialogTitle className="text-2xl font-bold">
            Appointment Details
          </DialogTitle>

          <p className="text-sm text-zinc-400">
            Review appointment information.
          </p>

        </DialogHeader>

        <div className="space-y-5 py-2">

          {/* Patient */}

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600">

              <User className="h-5 w-5 text-white" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Patient
              </p>

              <p className="font-semibold text-white">
                {appointment.patients?.name}
              </p>

            </div>

          </div>

          {/* Doctor */}

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">

              <Stethoscope className="h-5 w-5 text-white" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Doctor
              </p>

              <p className="font-semibold text-white">
                Dr. {appointment.doctors?.name}
              </p>

            </div>

          </div>

          {/* Date + Time */}

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

              <div className="mb-3 flex items-center gap-2">

                <CalendarDays className="h-4 w-4 text-indigo-400" />

                <span className="text-sm text-zinc-400">
                  Date
                </span>

              </div>

              <p className="font-semibold text-white">
                {new Date(
                  appointment.appointment_date
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

              <div className="mb-3 flex items-center gap-2">

                <Clock3 className="h-4 w-4 text-indigo-400" />

                <span className="text-sm text-zinc-400">
                  Time
                </span>

              </div>

              <p className="font-semibold text-white">
                {new Date(
                  `2000-01-01T${appointment.appointment_time}`
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

            </div>

          </div>

          {/* Status */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="mb-3 text-sm text-zinc-400">
              Appointment Status
            </p>

            <Badge
              className={`${badgeColor(
                appointment.status
              )} rounded-full px-4 py-1 text-sm font-medium`}
            >
              {appointment.status}
            </Badge>

          </div>

        </div>

        <DialogFooter className="mt-2 flex gap-3 border-t border-white/10 pt-5">

          <DialogClose asChild>

            <Button
              variant="outline"
              className="border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
            >
              Close
            </Button>

          </DialogClose>

          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500"
          >
            <Pencil className="mr-2 h-4 w-4" />

            Edit Appointment

          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}