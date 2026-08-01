"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Doctor {
  id: string;
  name: string;
}

interface AppointmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  doctor: string;
  onDoctorChange: (value: string) => void;

  doctors: Doctor[];
}

export default function AppointmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  doctor,
  onDoctorChange,
  doctors,
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />

        <Input
          className="pl-10"
          placeholder="Search patient or doctor..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      {/* Status */}
      <Select
        value={status}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Status
          </SelectItem>

          <SelectItem value="Scheduled">
            Scheduled
          </SelectItem>

          <SelectItem value="Confirmed">
            Confirmed
          </SelectItem>

          <SelectItem value="Completed">
            Completed
          </SelectItem>

          <SelectItem value="Cancelled">
            Cancelled
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Doctor */}
      <Select
        value={doctor}
        onValueChange={onDoctorChange}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Doctor" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Doctors
          </SelectItem>

          {doctors.map((doc) => (
            <SelectItem
              key={doc.id}
              value={doc.id}
            >
              {doc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}