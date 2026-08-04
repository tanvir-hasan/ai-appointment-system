"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type {
  Appointment,
  Patient,
  Doctor,
  AppointmentStatus,
} from "@/types/database";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient."),
  doctor_id: z.string().min(1, "Please select a doctor."),
  appointment_date: z.string().min(1, "Please select a date."),
  appointment_time: z.string().min(1, "Please select a time."),
  duration_minutes: z.coerce.number(),
	status: z.enum([
	  "Scheduled",
	  "Confirmed",
	  "Completed",
	  "Cancelled",
	]) as z.ZodType<AppointmentStatus>,
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

	appointment: Appointment;
	patients: Patient[];
	doctors: Doctor[];
}

export default function EditAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  patients,
  doctors,
}: EditAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
	defaultValues: {
	  patient_id: appointment.patient_id,
	  doctor_id: appointment.doctor_id,
	  appointment_date: appointment.appointment_date,
	  appointment_time: appointment.appointment_time,
	  duration_minutes: appointment.duration_minutes,
	  status: appointment.status,
	},
  });

async function onSubmit(values: FormValues) {
  try {
    setIsSubmitting(true);

    // Convert 10:30 -> 10:30:00 for PostgreSQL
    const time =
      values.appointment_time.length === 5
        ? `${values.appointment_time}:00`
        : values.appointment_time;

    // Calculate appointment start/end
    const start = new Date(
      `${values.appointment_date}T${time}`
    );

    const end = new Date(start);
    end.setMinutes(
      end.getMinutes() + values.duration_minutes
    );

    // Get other appointments for this doctor on the same date
    const {
      data: existingAppointments,
      error: fetchError,
    } = await supabase
      .from("appointments")
      .select(
        "id, appointment_time, duration_minutes"
      )
      .eq("doctor_id", values.doctor_id)
      .eq(
        "appointment_date",
        values.appointment_date
      )
      .neq("id", appointment.id);

    if (fetchError) throw fetchError;

    // Check for overlapping appointments
    const hasConflict = existingAppointments?.some(
      (existing) => {
        const existingStart = new Date(
          `${values.appointment_date}T${existing.appointment_time}`
        );

        const existingEnd = new Date(existingStart);
        existingEnd.setMinutes(
          existingEnd.getMinutes() +
            (existing.duration_minutes ?? 30)
        );

        return (
          start < existingEnd &&
          end > existingStart
        );
      }
    );

    if (hasConflict) {
      toast.error(
        "This doctor already has an appointment during that time."
      );
      return;
    }

    // Update appointment
    const { error } = await supabase
      .from("appointments")
      .update({
        patient_id: values.patient_id,
        doctor_id: values.doctor_id,
        appointment_date: values.appointment_date,
        appointment_time: time,
        duration_minutes: values.duration_minutes,
        status: values.status,
        notes: values.notes,
      })
      .eq("id", appointment.id);

    if (error) throw error;

    toast.success("Appointment updated successfully.");

    form.reset();
    onOpenChange(false);
    router.refresh();
  } catch (error) {
    console.error("SUPABASE ERROR:", error);

    toast.error("Failed to update appointment", {
      description:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    });
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <Dialog open={open}  onOpenChange={onOpenChange}>

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>

          <DialogDescription className="text-zinc-400">
            Update the appointment information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Patient */}
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>

                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >
                      <option value="">Select patient</option>

                      {patients.map((patient) => (
                        <option
                          key={patient.id}
                          value={patient.id}
                        >
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctor */}
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>

                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >
                      <option value="">Select doctor</option>

                      {doctors.map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="appointment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>

                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="appointment_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>

                  <FormControl>
                    <Input
                      type="time"
                      step="60"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
			
			{/* Duration */}
			<FormField
			  control={form.control}
			  name="duration_minutes"
			  render={({ field }) => (
				<FormItem>
				  <FormLabel>Duration</FormLabel>

				  <FormControl>
					<select
					  value={field.value}
					  onChange={(e) =>
						field.onChange(Number(e.target.value))
					  }
					  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
					>
					  <option value={15}>15 Minutes</option>
					  <option value={30}>30 Minutes</option>
					  <option value={45}>45 Minutes</option>
					  <option value={60}>60 Minutes</option>
					</select>
				  </FormControl>

				  <FormMessage />
				</FormItem>
			  )}
			/>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Optional notes..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
				className="border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
				className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Save Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}