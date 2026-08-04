"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  settingsId: string;
  logoUrl: string | null;
}

export default function ClinicLogoUpload({
  settingsId,
  logoUrl,
}: Props) {
  const supabase = createClient();

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(logoUrl);

  async function uploadLogo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();

      const fileName =
        `${settingsId}.${fileExt}`;

      const filePath =
        `clinic-logos/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("clinic-assets")
          .upload(filePath, file, {
            upsert: true,
          });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("clinic-assets")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } =
        await supabase
          .from("clinic_settings")
          .update({
            logo_url: publicUrl,
          })
          .eq("id", settingsId);

      if (updateError) throw updateError;

      setImageUrl(publicUrl);

      toast.success("Logo updated successfully");

    } catch (err) {
      console.error(err);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="rounded-3xl border border-white/10 bg-zinc-900">

      <CardHeader>

        <CardTitle>
          Clinic Logo
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        <div className="flex justify-center">

          {imageUrl ? (

            <Image
              src={imageUrl}
              alt="Clinic Logo"
              width={180}
              height={180}
              className="rounded-2xl border border-white/10 object-contain"
            />

          ) : (

            <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-zinc-500">
              No Logo
            </div>

          )}

        </div>

<div className="space-y-4">

  <input
    id="clinic-logo"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={uploadLogo}
  />

  <Button
    type="button"
    className="w-full"
    onClick={() => {
      document
        .getElementById("clinic-logo")
        ?.click();
    }}
    disabled={uploading}
  >
    {uploading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Uploading...
      </>
    ) : (
      <>
        <Upload className="mr-2 h-4 w-4" />
        Upload Logo
      </>
    )}
  </Button>

</div>

      </CardContent>

    </Card>
  );
}