"use client";

import { useSiteSettings } from "@/context/site-settings-context";

interface AdSlotProps {
  location: string;
}

export function AdSlot({ location }: AdSlotProps) {
  const { settings } = useSiteSettings();
  
  // Ensure settings and adSettings are available before trying to find an ad
  const ad = settings?.adSettings?.find(
    (ad) => ad.location === location && ad.enabled
  );

  if (!ad) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: ad.code }} />;
}
