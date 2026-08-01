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
    <AlertDialog
	  open={open}
	  onOpenChange={setOpen}
	>

      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>


      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Doctor?
          </AlertDialogTitle>


          <AlertDialogDescription className="text-zinc-400">
            This will permanently delete{"Dr. "}
            <span className="font-medium text-white">
              {doctorName}
            </span>
            {" "}from the system.
          </AlertDialogDescription>

        </AlertDialogHeader>


        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>


          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>


        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}