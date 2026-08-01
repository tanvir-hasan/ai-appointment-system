"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient."),
  doctor_id: z.string().min(1, "Please select a doctor."),
  appointment_date: z.string().min(1, "Please select a date."),
  appointment_time: z.string().min(1, "Please select a time."),
  status: z.enum([
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled",
  ]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAppointmentDialogProps {
  appointment: {
    id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
  };

  patients: {
    id: string;
    name: string;
  }[];

  doctors: {
    id: string;
    name: string;
  }[];
}

export default function EditAppointmentDialog({
  appointment,
  patients,
  doctors,
}: EditAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
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

		const { error } = await supabase
		  .from("appointments")
		  .update({
			patient_id: values.patient_id,
			doctor_id: values.doctor_id,
			appointment_date: values.appointment_date,
			appointment_time: values.appointment_time,
			status: values.status,
		  })
		  .eq("id", appointment.id);

      if (error) {
	  console.log("Supabase Error:", error);
	  alert(JSON.stringify(error, null, 2));
	  return;
	}

      toast.success("Appointment updated successfully.");

      form.reset();

      setOpen(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
		<DialogTrigger asChild>
		  <Button
			variant="outline"
			size="icon"
		  >
			<Pencil className="h-4 w-4" />
		  </Button>
		</DialogTrigger>

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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
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