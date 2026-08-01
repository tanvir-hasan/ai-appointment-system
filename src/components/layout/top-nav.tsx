"use client";

import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function TopNav() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
        <Search size={18} className="text-zinc-400" />

        <input
          type="text"
          placeholder="Search appointments..."
          className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-zinc-800">
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold">
            T
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium">
              Tanvir
            </p>

            <p className="text-xs text-zinc-400">
              Administrator
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-3 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}