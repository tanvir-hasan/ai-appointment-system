"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CalendarPlus } from "lucide-react";

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

  duration_minutes: z.coerce
    .number()
    .min(5, "Duration must be at least 5 minutes"),

  notes: z.string().optional(),
});


type FormValues = z.infer<typeof formSchema>;


export default function AddAppointmentDialog() {

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patients, setPatients] = useState<
    { id: string; name: string }[]
  >([]);

  const [doctors, setDoctors] = useState<
    { id: string; name: string }[]
  >([]);


  const router = useRouter();
  const supabase = createClient();


  useEffect(() => {

    if (!open) return;


    async function loadData() {

      const [
        { data: patients },
        { data: doctors },
      ] = await Promise.all([

        supabase
          .from("patients")
          .select("id,name")
          .order("name"),

        supabase
          .from("doctors")
          .select("id,name")
          .eq("availability", "Available")
          .order("name"),

      ]);


      setPatients(patients ?? []);
      setDoctors(doctors ?? []);

    }


    loadData();

  }, [open, supabase]);



  const form = useForm<FormValues>({

    resolver: zodResolver(formSchema),

    defaultValues: {

      patient_id: "",
      doctor_id: "",

      appointment_date: "",
      appointment_time: "",

      duration_minutes: 30,

      status: "Scheduled",

      notes: "",

    },

  });



  async function onSubmit(values: FormValues) {

    try {

      setIsSubmitting(true);


      const time =
        values.appointment_time.length === 5
          ? `${values.appointment_time}:00`
          : values.appointment_time;


      const start = new Date(
        `${values.appointment_date}T${time}`
      );


      const end = new Date(start);

      end.setMinutes(
        end.getMinutes() + values.duration_minutes
      );


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
        );


      if (fetchError) throw fetchError;



      const hasConflict =
        existingAppointments?.some(
          (appointment) => {

            const existingStart = new Date(
              `${values.appointment_date}T${appointment.appointment_time}`
            );


            const existingEnd = new Date(existingStart);


            existingEnd.setMinutes(
              existingEnd.getMinutes() +
              (appointment.duration_minutes ?? 30)
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



      const { error } = await supabase
        .from("appointments")
        .insert({

          patient_id: values.patient_id,
          doctor_id: values.doctor_id,
          appointment_date: values.appointment_date,
          appointment_time: time,
          duration_minutes: values.duration_minutes,
          status: values.status,
          notes: values.notes,

        });


      if (error) throw error;


      toast.success(
        "Appointment created successfully."
      );


      form.reset();

      setOpen(false);

      router.refresh();


    } catch (error) {

      console.error(
        "SUPABASE ERROR:",
        error
      );


      toast.error(
        "Failed to create appointment",
        {
          description:
            error instanceof Error
              ? error.message
              : JSON.stringify(error),
        }
      );


    } finally {

      setIsSubmitting(false);

    }

  }



  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger
        className="inline-flex h-12 items-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40"
      >

        <CalendarPlus className="mr-2 h-5 w-5" />

        New Appointment

      </DialogTrigger>


      <DialogContent className="border-zinc-800 bg-zinc-900 text-white">

        <DialogHeader>

          <DialogTitle>
            Schedule Appointment
          </DialogTitle>


          <DialogDescription className="text-zinc-400">

            Create a new appointment.

          </DialogDescription>

        </DialogHeader>



        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >


            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Patient
                  </FormLabel>


                  <FormControl>

                    <select
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >

                      <option value="">
                        Select patient
                      </option>


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



            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Doctor
                  </FormLabel>


                  <FormControl>

                    <select
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >

                      <option value="">
                        Select doctor
                      </option>


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



            <FormField
              control={form.control}
              name="appointment_date"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Date
                  </FormLabel>


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



            <FormField
              control={form.control}
              name="appointment_time"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Time
                  </FormLabel>


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



            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Duration
                  </FormLabel>


                  <FormControl>

                    <select
                      value={String(field.value ?? 30)}
                      onChange={(e) =>
                        field.onChange(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >

                      <option value="15">
                        15 Minutes
                      </option>

                      <option value="30">
                        30 Minutes
                      </option>

                      <option value="45">
                        45 Minutes
                      </option>

                      <option value="60">
                        60 Minutes
                      </option>

                    </select>

                  </FormControl>


                  <FormMessage />

                </FormItem>

              )}
            />



            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Status
                  </FormLabel>


                  <FormControl>

                    <select
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >

                      <option value="Scheduled">
                        Scheduled
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </FormControl>


                  <FormMessage />

                </FormItem>

              )}
            />



            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>
                    Notes
                  </FormLabel>


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
                onClick={() => setOpen(false)}
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