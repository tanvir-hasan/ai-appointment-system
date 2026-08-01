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


interface DeletePatientDialogProps {
  patientId: string;
  patientName: string;
}


export function DeletePatientDialog({
  patientId,
  patientName,
}: DeletePatientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const supabase = createClient();


  async function handleDelete() {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientId);


      if (error) {
        throw error;
      }


      toast.success("Patient deleted", {
        description: `${patientName} has been removed.`,
      });


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
    <AlertDialog>

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
            Delete Patient?
          </AlertDialogTitle>


          <AlertDialogDescription className="text-zinc-400">
            This will permanently delete{" "}
            <span className="font-medium text-white">
              {patientName}
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