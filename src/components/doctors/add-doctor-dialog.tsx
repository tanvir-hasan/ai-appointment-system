"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

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

console.log({
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
});

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

console.log({
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
});

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

console.log({
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  specialty: z.string().min(2, "Specialty is required."),
  work_start: z.string().min(1, "Required"),
  work_end: z.string().min(1, "Required"),
  availability: z.enum([
    "Available",
    "Busy",
    "On Leave",
  ]),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddDoctorDialog() {
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
	  work_start: "09:00",
	  work_end: "17:00",
	},
  });

	async function onSubmit(values: FormValues) {
	  console.log("SUBMIT VALUES:", values);

	  try {
		setIsSubmitting(true);

		const { data, error } = await supabase
		  .from("doctors")
		  .insert({
			name: values.name,
			specialty: values.specialty,
			availability: values.availability,
			work_start: values.work_start,
			work_end: values.work_end,
		  })
		  .select();

		console.log("Inserted doctor:", data);

		if (error) {
		  throw error;
		}

		toast.success("Doctor added successfully", {
		  description: `${values.name} has been added.`,
		});

		setOpen(false);
		router.refresh();

	  } catch (error) {
		console.error("Add doctor error:", error);

		toast.error("Failed to add doctor", {
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
        <Button className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/50">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>

          <DialogDescription className="text-zinc-400">
            Register a new Doctor in the system.
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
					  className="bg-zinc-900 border-white/10"
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
					  className="bg-zinc-900 border-white/10"
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
					  <SelectTrigger className="h-11 border-white/10 bg-zinc-900">
						<SelectValue placeholder="Select availability" />
					  </SelectTrigger>
					</FormControl>

					<SelectContent className="border-white/10 bg-zinc-900 text-white">
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
			
			<div className="grid grid-cols-2 gap-4">

			  <FormField
				control={form.control}
				name="work_start"
				render={({ field }) => (
				  <FormItem>
					<FormLabel>Work Start</FormLabel>

					<FormControl>
					  <Input
						type="time"
						{...field}
						className="bg-zinc-900 border-white/10"
					  />
					</FormControl>

					<FormMessage />
				  </FormItem>
				)}
			  />

			  <FormField
				control={form.control}
				name="work_end"
				render={({ field }) => (
				  <FormItem>
					<FormLabel>Work End</FormLabel>

					<FormControl>
					  <Input
						type="time"
						{...field}
						className="bg-zinc-900 border-white/10"
					  />
					</FormControl>

					<FormMessage />
				  </FormItem>
				)}
			  />

			</div>

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

                Save Doctor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}