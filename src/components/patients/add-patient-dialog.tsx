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

  age: z.string()
    .min(1, "Age is required.")
    .refine(
      (value) => !isNaN(Number(value)),
      "Age must be a valid number."
    ),

  phone: z.string().min(5, "Please enter a valid phone number."),

  email: z.string().email("Please enter a valid email address."),

  status: z.enum([
    "Active",
    "Inactive",
  ]),
});


type FormValues = z.infer<typeof formSchema>;


export function AddPatientDialog() {

  const [open, setOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  const router = useRouter();

  const supabase = createClient();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      age: "",
      phone: "",
      email: "",
      status: "Active",
    },
  });



  async function onSubmit(values: FormValues) {

    try {

      setIsSubmitting(true);


      const { error } = await supabase
        .from("patients")
        .insert({

          name: values.name,

          age: Number(values.age),

          phone: values.phone,

          patient_email: values.email,

          status: values.status,

        });



      if (error) {
        throw error;
      }



      toast.success(
        "Patient added successfully",
        {
          description:
            `${values.name} has been added.`,
        }
      );


      form.reset();

      setOpen(false);

      router.refresh();



    } catch (error) {

      console.error(error);


      toast.error(
        "Failed to add patient",
        {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
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

      <DialogTrigger asChild>

        <Button
          className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
        >

          <UserPlus className="mr-2 h-4 w-4" />

          New Patient

        </Button>

      </DialogTrigger>



      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">

        <DialogHeader>

          <DialogTitle>
            Add New Patient
          </DialogTitle>


          <DialogDescription className="text-zinc-400">
            Register a new patient in the system.
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
              name="age"

              render={({ field }) => (

                <FormItem>

                  <FormLabel>Age</FormLabel>

                  <FormControl>

                    <Input
                      type="number"
                      placeholder="25"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>

              )}

            />



            <FormField
              control={form.control}
              name="phone"

              render={({ field }) => (

                <FormItem>

                  <FormLabel>Phone</FormLabel>

                  <FormControl>

                    <Input
                      placeholder="+880..."
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>

              )}

            />



            <FormField
              control={form.control}
              name="email"

              render={({ field }) => (

                <FormItem>

                  <FormLabel>Email</FormLabel>

                  <FormControl>

                    <Input
                      type="email"
                      placeholder="patient@email.com"
                      {...field}
                    />

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

                  <FormLabel>Status</FormLabel>


                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >

                    <FormControl>

                      <SelectTrigger>

                        <SelectValue placeholder="Select status" />

                      </SelectTrigger>

                    </FormControl>


                    <SelectContent>

                      <SelectItem value="Active">
                        Active
                      </SelectItem>


                      <SelectItem value="Inactive">
                        Inactive
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

                Save Patient

              </Button>


            </DialogFooter>


          </form>


        </Form>


      </DialogContent>


    </Dialog>

  );
}