"use client";

import { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  specialty: z.string().min(2, "Specialty is required."),
  availability: z.enum([
    "Available",
    "Busy",
    "On Leave",
  ]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDoctorDialogProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    availability: string;
  };
}

export function EditDoctorDialog({
  doctor,
}: EditDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      specialty: "",
      availability: "Available",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: doctor.name,
      specialty: doctor.specialty ?? "",
      availability:
        doctor.availability === "Busy"
          ? "Busy"
          : doctor.availability === "On Leave"
          ? "On Leave"
          : "Available",
    });
  }, [open, doctor, form]);

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("doctors")
        .update({
          name: values.name,
          specialty: values.specialty,
          availability: values.availability,
        })
        .eq("id", doctor.id);

      if (error) {
        throw error;
      }

      toast.success("Doctor updated successfully", {
        description: `${values.name} has been updated.`,
      });

      setOpen(false);
      router.refresh();

    } catch (error) {
      console.error("Edit doctor error:", error);

      toast.error("Failed to update doctor", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>

          <DialogDescription className="text-zinc-400">
            Update the doctor's information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="John Smith"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Cardiologist"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Availability
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Available">
                        Available
                      </SelectItem>

                      <SelectItem value="Busy">
                        Busy
                      </SelectItem>

                      <SelectItem value="On Leave">
                        On Leave
                      </SelectItem>
                    </SelectContent>
                  </Select>

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

                Update Doctor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}