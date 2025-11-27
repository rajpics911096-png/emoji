
"use client";

import { useSiteSettings } from "@/context/site-settings-context";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  location: string;
  className?: string;
}

export function AdSlot({ location, className }: AdSlotProps) {
  const { settings } = useSiteSettings();
  
  // Ensure settings and adSettings are available before trying to find an ad
  const ad = settings?.adSettings?.find(
    (ad) => ad.location === location && ad.enabled
  );

  if (!ad) {
    return null;
  }

  return <div className={cn(className)} dangerouslySetInnerHTML={{ __html: ad.code }} />;
}
