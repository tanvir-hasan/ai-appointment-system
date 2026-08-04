import { createClient } from "@/lib/supabase/server";

import ClinicProfileCard from "@/components/settings/clinic-profile-card";
import ClinicLogoUpload from "@/components/settings/clinic-logo-upload";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

const { data, error } = await supabase
  .from("clinic_settings")
  .select("*");

console.log("Clinic settings:", data);
console.log("Clinic settings error:", error);

const settings = data?.[0];

console.log("Settings:", settings);
console.log("Error:", error);

if (error) {
  return (
    <pre className="p-10 text-red-500">
      {JSON.stringify(error, null, 2)}
    </pre>
  );
}

if (!settings) {
  return (
    <div className="p-10 text-white">
      No settings found.
    </div>
  );
}

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Header */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
          System Settings
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Configure your clinic information and application settings.
        </p>

      </div>

		<div className="grid gap-6 lg:grid-cols-3">

		  <div className="lg:col-span-2">

			<ClinicProfileCard
			  settings={settings}
			/>

		  </div>

		  <ClinicLogoUpload
			settingsId={settings.id}
			logoUrl={settings.logo_url}
		  />

		</div>

    </div>
  );
}