
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icon-map";
import { Smile } from "lucide-react";
import type React from 'react';

interface SvgIconProps {
  svg: string; // Can be an icon name or raw SVG
  className?: string;
}

export function SvgIcon({ svg, className }: SvgIconProps) {
  const IconSource = iconMap[svg];

  // If IconSource is a string, it's raw SVG
  if (typeof IconSource === 'string') {
    return (
      <div
        className={cn("inline-block", className)}
        dangerouslySetInnerHTML={{ __html: IconSource }}
      />
    );
  }

  // If IconSource is a component
  if (IconSource) {
    const IconComponent = IconSource as React.ComponentType<{ className?: string }>;
    return <IconComponent className={className} />;
  }
  
  // If svg is not in map, assume it's raw SVG
  if (svg.trim().startsWith('<svg')) {
    return (
      <div
        className={cn("inline-block", className)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  // Fallback to a default icon
  return <Smile className={className} />;
}
