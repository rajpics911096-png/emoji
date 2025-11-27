import { cn } from "@/lib/utils";

interface SvgIconProps {
  svg: string;
  className?: string;
}

export function SvgIcon({ svg, className }: SvgIconProps) {
  return (
    <div
      className={cn("inline-block", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
