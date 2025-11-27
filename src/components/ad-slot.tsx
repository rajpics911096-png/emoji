
"use client";

import { useSiteSettings } from "@/context/site-settings-context";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  location: string;
  className?: string;
}

export function AdSlot({ location, className }: AdSlotProps) {
  const { settings } = useSiteSettings();
  
  const ad = settings?.adSettings?.find(
    (ad) => ad.location === location && ad.enabled
  );

  if (!ad) {
    return null;
  }

  const alignmentStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const alignClass = alignmentStyles[ad.align || 'center'];

  return <div className={cn(alignClass, className)} dangerouslySetInnerHTML={{ __html: ad.code }} />;
}
