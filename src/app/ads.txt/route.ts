
import { useSiteSettings } from '@/context/site-settings-context';
import { defaultSiteSettings } from '@/lib/site-settings';

// This is a workaround for accessing settings on the server.
// In a real app, this would come from a database.
const getAdsTxtContent = () => {
    try {
        // This is a non-standard way to access zustand state outside of React.
        // It relies on the persist middleware having written to localStorage.
        // This is NOT a recommended pattern for production apps.
        if (typeof localStorage !== 'undefined') {
            const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
            return settings.state?.settings?.adsTxtContent || defaultSiteSettings.adsTxtContent || '';
        }
    } catch (e) {
        // Fallback if localStorage is not available or JSON is malformed
    }
    return defaultSiteSettings.adsTxtContent || '';
};

export async function GET() {
  const adsTxtContent = getAdsTxtContent();
  
  return new Response(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
