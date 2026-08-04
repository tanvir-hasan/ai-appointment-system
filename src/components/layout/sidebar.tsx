"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  Stethoscope,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  clinicName?: string | null;
  logoUrl?: string | null;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    href: "/appointments",
  },
  {
    name: "Patients",
    icon: Users,
    href: "/patients",
  },
  {
    name: "Doctors",
    icon: Stethoscope,
    href: "/doctors",
  },
  {
    name: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar({
  clinicName,
  logoUrl,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black md:flex">

      {/* Logo */}

      <div className="border-b border-white/5 px-7 py-7">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">

            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Clinic Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <Sparkles className="h-7 w-7 text-white" />
            )}

          </div>

          <div>

            <h1 className="line-clamp-1 text-xl font-bold text-white">
              {clinicName || "MediAI"}
            </h1>

            <p className="text-xs text-zinc-400">
              Clinic Management System
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-zinc-400 hover:translate-x-1 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </div>

              {active ? (
                <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_white]" />
              ) : (
                <ChevronRight
                  size={16}
                  className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}

      <div className="mx-5 mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

        <div className="flex items-center gap-3">

          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

          <div>

            <p className="text-sm font-semibold text-white">
              System Online
            </p>

            <p className="text-xs text-zinc-400">
              All services operational
            </p>

          </div>

        </div>

      </div>

      {/* User */}

      <div className="border-t border-white/5 p-5">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
              T
            </div>

            <div className="flex-1">

              <p className="font-semibold text-white">
                Tanvir
              </p>

              <p className="text-xs text-zinc-400">
                Administrator
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs text-zinc-500">
                  Online
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}