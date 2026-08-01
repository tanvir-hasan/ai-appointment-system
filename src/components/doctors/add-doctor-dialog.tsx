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
	},
  });

	async function onSubmit(values: FormValues) {
	  console.log("SUBMIT VALUES:", values);

	  try {
		setIsSubmitting(true);

		const { error } = await supabase
		  .from("doctors")
		  .insert({
			name: values.name,
			specialty: values.specialty,
			availability: values.availability,
		  });

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
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
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

                Save Doctor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}