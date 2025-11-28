import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icon-map";
import { Smile } from "lucide-react";

interface SvgIconProps {
  svg: string; // Can be an icon name or raw SVG
  className?: string;
}

export function SvgIcon({ svg, className }: SvgIconProps) {
  // Check if svg is a key in iconMap
  if (svg in iconMap) {
    const IconComponent = iconMap[svg] || Smile;
    return <IconComponent className={className} />;
  }

  // Otherwise, assume it's raw SVG and render it
  return (
    <div
      className={cn("inline-block", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
