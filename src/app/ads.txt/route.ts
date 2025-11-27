
import { NextResponse } from 'next/server';
import { defaultSiteSettings } from '@/lib/site-settings';

// This is a simplified approach to serving ads.txt content.
// In a real application, you might fetch this from a database or a more robust
// settings management system that doesn't rely on a single default object.
// For the purpose of this prototype, we directly use the imported settings.

export async function GET() {
  const adsTxtContent = defaultSiteSettings.adsTxtContent || '';

  return new NextResponse(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
