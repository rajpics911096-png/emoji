
import type { SiteSettings } from './types';

export const defaultSiteSettings: SiteSettings = {
    name: 'EmojiVerse',
    logo: `<svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_405_2)">
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
          class="fill-primary"
        />
        <path
          d="M17.5 14.5C17.5 14.5 16 16.5 12 16.5C8 16.5 6.5 14.5 6.5 14.5"
          stroke="hsl(var(--primary-foreground))"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
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
    </svg>`,
    favicon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Vercel</title><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"/></svg>`,
    metaTitle: 'EmojiVerse - Your Universe of Emojis',
    metaDescription: 'Discover, copy, and download thousands of emojis in various formats for every occasion.',
    downloadTimer: 10,
    adSettings: [
        { location: 'header', code: `<div style="margin: 20px 0;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/728x90.png?text=Header+Ad+image+Photos" 
         alt="Demo Banner Ad" 
         width="728" 
         height="90" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
        { location: 'footer', code: `<div style="margin: 20px 0;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/728x90.png?text=Footer+Ad+image+Photos" 
         alt="Demo Banner Ad" 
         width="728" 
         height="90" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
        { location: 'sidebar', code: `<div style="margin: 20px 0;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/300x250.png?text=Sidebar+Ad+image+Photos" 
         alt="Demo Banner Ad" 
         width="300" 
         height="250" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
        { location: 'below_emoji', code: `<div style="margin: 20px 0;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/468x60.png?text=Below+Emoji+Ad+image+Photos" 
         alt="Demo Banner Ad" 
         width="468" 
         height="60" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
        { location: 'in_download_grid', code: `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/300x250.png?text=Grid+Ad" 
         alt="Demo Grid Ad" 
         width="300" 
         height="250" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
        { location: 'below_download', code: `<div style="margin: 20px 0;">
  <a href="https://example.com" target="_blank" title="Visit our website demo">
    <img src="https://placehold.co/468x60.png?text=Below+Download+Ad+image+Photos" 
         alt="Demo Banner Ad" 
         width="468" 
         height="60" 
         style="border: 0; max-width: 100%; height: auto; margin: 0 auto;">
  </a>
</div>`, enabled: true, align: 'center' },
    ]
};
