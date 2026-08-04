"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AddAppointmentDialog from "@/components/appointments/add-appointment-dialog";
import { GlobalSearch } from "@/components/dashboard/global-search";

import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function TopNav() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl">

      <div className="flex h-[72px] items-center justify-between px-8">

        {/* Left */}

        <div className="flex items-center gap-6">

          {/* Search */}

			<div className="hidden lg:block">
			  <GlobalSearch />
			</div>

          {/* Date */}

          <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">

            <CalendarDays className="h-4 w-4 text-indigo-400" />

            <span className="text-sm text-white font-medium">
              {today}
            </span>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* New Appointment */}

			<AddAppointmentDialog />

          {/* Notifications */}

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/10">

            <Bell className="h-5 w-5 text-white" />

            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />

          </button>

          {/* Profile */}

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/10">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/25">

              T

            </div>

            <div className="hidden md:block">

              <p className="text-xs font-medium text-zinc-300">
                Tanvir
              </p>

              <p className="text-xs text-zinc-400">
                Administrator
              </p>

            </div>

            <ChevronDown className="h-4 w-4 text-zinc-300" />

          </div>

          {/* Logout */}

          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>

        </div>

      </div>

    </header>
  );
}