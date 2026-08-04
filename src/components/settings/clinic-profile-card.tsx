"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Building2, Save } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

interface ClinicProfileCardProps {
  settings: {
    id: string;
    clinic_name: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
  };
}

export default function ClinicProfileCard({
  settings,
}: ClinicProfileCardProps) {
  const supabase = createClient();

  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    clinic_name: settings.clinic_name ?? "",
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    website: settings.website ?? "",
    address: settings.address ?? "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveSettings() {
    startTransition(async () => {
      const { error } = await supabase
        .from("clinic_settings")
        .update({
          clinic_name: form.clinic_name,
          phone: form.phone,
          email: form.email,
          website: form.website,
          address: form.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) {
        toast.error("Failed to save settings");
        return;
      }

      toast.success("Clinic settings updated");
    });
  }
const inputClass =
  "h-12 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 text-sm text-white placeholder:text-zinc-500 transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
  return (
    <Card className="border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl shadow-black/20">

      <CardHeader>

		<div className="mb-8 flex items-center gap-4">

		  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">

			<Building2 className="h-7 w-7 text-white" />

		  </div>

		  <div>

			<h2 className="text-2xl font-bold text-white">
			  Clinic Information
			</h2>

			<p className="text-zinc-400">
			  Basic clinic information
			</p>

		  </div>

		</div>

      </CardHeader>

      <CardContent className="space-y-5 p-8">

		<Input
		  className={inputClass}
		  placeholder="Clinic Name"
		  value={form.clinic_name}
		  onChange={(e) => updateField("clinic_name", e.target.value)}
		/>

		<Input
		  className={inputClass}
		  placeholder="Phone Number"
		  value={form.phone}
		  onChange={(e) => updateField("phone", e.target.value)}
		/>

		<Input
		  className={inputClass}
		  placeholder="Email Address"
		  value={form.email}
		  onChange={(e) => updateField("email", e.target.value)}
		/>

		<Input
		  className={inputClass}
		  placeholder="Website"
		  value={form.website}
		  onChange={(e) => updateField("website", e.target.value)}
		/>

		<Input
		  className={inputClass}
		  placeholder="Clinic Address"
		  value={form.address}
		  onChange={(e) => updateField("address", e.target.value)}
		/>

        <Button
  onClick={saveSettings}
  disabled={isPending}
  className="
    h-12
    w-full
    rounded-2xl
    bg-gradient-to-r
    from-indigo-600
    to-violet-600
    text-white
    shadow-lg
    shadow-indigo-500/20
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:from-indigo-500
    hover:to-violet-500
    hover:shadow-indigo-500/40
  "
>
  <Save className="mr-2 h-4 w-4" />

  {isPending ? "Saving..." : "Save Changes"}
</Button>

      </CardContent>

    </Card>
  );
}