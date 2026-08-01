"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface AppointmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function AppointmentFilters({
  search,
  onSearchChange,
}: AppointmentFiltersProps) {
  return (
    <div className="relative w-full md:w-96">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        size={18}
      />

      <Input
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search patients..."
        className="pl-10"
      />
    </div>
  );
}