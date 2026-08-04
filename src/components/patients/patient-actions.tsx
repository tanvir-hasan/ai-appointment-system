"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog";


interface PatientActionsProps {
  patient: {
    id: string;
    name: string;
    age: number;
    phone: string;
    patient_email: string;
    status: string;
  };
}


export function PatientActions({
  patient,
}: PatientActionsProps) {

  const [editOpen, setEditOpen] = useState(false);


  return (
    <>
      <DropdownMenu>

        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            />
          }
        >
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>


        <DropdownMenuContent
          align="end"
          className="border-zinc-800 bg-zinc-900 text-white"
        >

          <DropdownMenuItem
            onSelect={() => setEditOpen(true)}
          >
            Edit
          </DropdownMenuItem>


          <div className="px-1">

            <DeletePatientDialog
              patientId={patient.id}
              patientName={patient.name}
            />

          </div>


        </DropdownMenuContent>


      </DropdownMenu>



      <EditPatientDialog
        patient={patient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

    </>
  );
}