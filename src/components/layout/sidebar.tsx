import Link from "next/link";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Settings,
} from "lucide-react";

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
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-950 p-6 md:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          MediAI
        </h1>

        <p className="text-sm text-zinc-400">
          Appointment System
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link href={item.href}
              key={item.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}