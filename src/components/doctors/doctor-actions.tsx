"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


interface DoctorActionsProps {
  doctor: {
    id: string;
    name: string;
  };

  onEdit: () => void;
  onDelete: () => void;
}


export default function DoctorActions({
  doctor,
  onEdit,
  onDelete,
}: DoctorActionsProps) {

  const [open, setOpen] = useState(false);


  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white"
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>


      <DropdownMenuContent
        align="end"
        className="border-white/10 bg-zinc-900 text-white"
      >

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="cursor-pointer hover:bg-zinc-800"
        >

          <Pencil className="mr-2 h-4 w-4" />

          Edit Doctor

        </DropdownMenuItem>



        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >

          <Trash2 className="mr-2 h-4 w-4" />

          Delete Doctor

        </DropdownMenuItem>


      </DropdownMenuContent>

    </DropdownMenu>
  );
}