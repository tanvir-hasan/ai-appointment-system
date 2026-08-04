"use client";

import {
  Search,
  Filter,
  Stethoscope,
} from "lucide-react";

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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-xl shadow-black/20">

      <div className="grid gap-5 lg:grid-cols-[1fr_220px_260px]">

        {/* Search */}

        <div>

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Search
          </label>

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patient or doctor..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-900/80 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

          </div>

        </div>

        {/* Status */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">

            <Filter size={13} />

            Status

          </label>

          <Select
            value={status}
            onValueChange={onStatusChange}
          >

			<SelectTrigger
			  className="
				h-12
				w-full
				rounded-2xl
				border-white/10
				bg-zinc-900
				px-4
				text-white
				shadow-none
				focus:border-indigo-500
				focus:ring-4
				focus:ring-indigo-500/10
				[&>span]:text-white
			  "
			>
			  <SelectValue placeholder="All Status" />
			</SelectTrigger>

            <SelectContent className="border-white/10 bg-zinc-900 text-white">

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

        </div>

        {/* Doctor */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">

            <Stethoscope size={13} />

            Doctor

          </label>

          <Select
            value={doctor}
            onValueChange={onDoctorChange}
          >

			<SelectTrigger
			  className="
				h-12
				w-full
				rounded-2xl
				border-white/10
				bg-zinc-900
				px-4
				text-white
				shadow-none
				focus:border-indigo-500
				focus:ring-4
				focus:ring-indigo-500/10
				[&>span]:text-white
			  "
			>
			  <SelectValue placeholder="All Doctors" />
			</SelectTrigger>

            <SelectContent className="border-white/10 bg-zinc-900 text-white">

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

      </div>

    </div>
  );
}