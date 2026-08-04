"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";


interface DeleteDoctorDialogProps {
  doctorId: string;
  doctorName: string;
}


export function DeleteDoctorDialog({
  doctorId,
  doctorName,
}: DeleteDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const supabase = createClient();


  async function handleDelete() {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from("doctors")
        .delete()
        .eq("id", doctorId);


      if (error) {
        throw error;
      }


		toast.success("Doctor deleted", {
		  description: `${doctorName} has been removed.`,
		});

		setOpen(false);
		router.refresh();


    } catch (error) {
      console.error(error);

      toast.error("Delete failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });

    } finally {
      setIsDeleting(false);
    }
  }


return (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="rounded-xl border-white/10 bg-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent className="max-w-md rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <AlertDialogHeader className="items-center text-center">

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>

        <AlertDialogTitle className="text-2xl font-bold">
          Delete Doctor
        </AlertDialogTitle>

        <AlertDialogDescription className="mt-2 text-base leading-7 text-zinc-400">
          This action cannot be undone.
          <br />
          Dr.
          <span className="font-semibold text-white">
            {" "}
            {doctorName}
          </span>{" "}
          will be permanently removed from the system.
        </AlertDialogDescription>

      </AlertDialogHeader>

      <AlertDialogFooter className="mt-6 flex gap-3">

        <AlertDialogCancel className="rounded-2xl border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white">
          Cancel
        </AlertDialogCancel>

        <AlertDialogAction
          disabled={isDeleting}
          onClick={handleDelete}
          className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500"
        >
          {isDeleting ? (
            "Deleting..."
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Doctor
            </>
          )}
        </AlertDialogAction>

      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
}