import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_405_2)">
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
          className="fill-primary"
        />
        <path
          d="M17.5 14.5C17.5 14.5 16 16.5 12 16.5C8 16.5 6.5 14.5 6.5 14.5"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 11.5C9.05228 11.5 9.5 11.0523 9.5 10.5C9.5 9.94772 9.05228 9.5 8.5 9.5C7.94772 9.5 7.5 9.94772 7.5 10.5C7.5 11.0523 7.94772 11.5 8.5 11.5Z"
          fill="hsl(var(--primary-foreground))"
        />
        <path
          d="M15.5 11.5C16.0523 11.5 16.5 11.0523 16.5 10.5C16.5 9.94772 16.0523 9.5 15.5 9.5C14.9477 9.5 14.5 9.94772 14.5 10.5C14.5 11.0523 14.9477 11.5 15.5 11.5Z"
          fill="hsl(var(--primary-foreground))"
        />
      </g>
      <defs>
        <clipPath id="clip0_405_2">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
