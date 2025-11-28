
"use client";

import { useEffect } from 'react';
import { useSiteSettings } from '@/context/site-settings-context';

export function DynamicTheme() {
    const { settings } = useSiteSettings();

    useEffect(() => {
        const root = document.documentElement;
        if (settings.colors) {
            for (const [name, hsl] of Object.entries(settings.colors)) {
                if (hsl) {
                    root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
                }
            }
        }
    }, [settings.colors]);

    return null;
}
