
"use client";

import { useEffect } from 'react';
import { useSiteSettings } from '@/context/site-settings-context';

export function DynamicFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const favicon = settings.favicon;
    if (!favicon) return;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(favicon)}`;
  }, [settings.favicon]);

  return null;
}
