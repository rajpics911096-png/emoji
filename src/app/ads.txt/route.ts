
import { useSiteSettings } from '@/context/site-settings-context';
import { defaultSiteSettings } from '@/lib/site-settings';

// This route handler generates the ads.txt file dynamically.
// In a real app, you might fetch this from a persistent store.
// For this prototype, we'll use the settings from context/local storage.

export async function GET() {
  // Since this is a server-side route, we can't use the hook directly.
  // We'll rely on the default settings for this prototype. A real implementation
  // would fetch from a database or a shared configuration source.
  const adsTxtContent = defaultSiteSettings.adsTxtContent || '';
  
  return new Response(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
