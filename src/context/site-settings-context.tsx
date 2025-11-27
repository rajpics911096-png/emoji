"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SiteSettings } from '@/lib/types';
import { defaultSiteSettings } from '@/lib/site-settings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettingsState] = useState<SiteSettings>(defaultSiteSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('siteSettings');
      if (storedSettings) {
        setSettingsState(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    } finally {
        setIsInitialized(true);
    }
  }, []);

  const setSettings = (newSettings: SiteSettings) => {
    try {
      localStorage.setItem('siteSettings', JSON.stringify(newSettings));
      setSettingsState(newSettings);
    } catch (error) {
       console.error("Failed to save settings to localStorage", error);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('siteSettings');
    setSettingsState(defaultSiteSettings);
  };

  if (!isInitialized) {
      return null;
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
