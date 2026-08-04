import { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

import { createClient } from "@/lib/supabase/server";

interface DashboardLayoutProps {
  children: ReactNode;
}

export async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("clinic_settings")
    .select("clinic_name, logo_url")
    .single();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      <Sidebar
        clinicName={settings?.clinic_name}
        logoUrl={settings?.logo_url}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <TopNav />

        <main className="relative flex-1 overflow-y-auto">

          {/* Background */}

          <div className="absolute inset-0">

            <div className="absolute inset-0 bg-zinc-950" />

            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-3xl" />

            <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl" />

          </div>

          {/* Content */}

          <div className="relative z-10 w-full px-8 py-8">

            <div className="mx-auto w-full max-w-[1700px]">

              {children}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}