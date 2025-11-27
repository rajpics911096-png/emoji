
"use client";

import Link from 'next/link';
import { SvgIcon } from './svg-icon';
import { footerContent } from '@/lib/data';
import { iconMap } from '@/lib/icon-map';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { AdSlot } from './ad-slot';

const SocialIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  const IconComponent = iconMap[iconName] || iconMap.twitter;
  return <IconComponent className={className} />;
};

export default function Footer({ lang }: { lang: string }) {
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const { navigation, legal, social } = footerContent;
  return (
    <>
    <AdSlot location="footer" />
    <footer className="bg-primary/5 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center space-x-2 mb-4">
              <SvgIcon svg={settings.logo} className="h-8 w-8" />
              <span className="font-bold text-xl font-headline">{settings.name}</span>
            </Link>
            <p className="text-sm text-foreground/70">
              {t('footerTagline')}
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">{t('footerNavigation')}</h3>
            <ul className="space-y-2">
              {navigation.map((item, index) => (
                 <li key={index}><Link href={item.href.startsWith('/') ? `/${lang}${item.href}`: item.href} className="text-sm hover:text-primary transition-colors">{t(item.label)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">{t('footerLegal')}</h3>
            <ul className="space-y-2">
              {legal.map((item, index) => (
                  <li key={index}><Link href={item.href.startsWith('/') ? `/${lang}${item.href}`: item.href} className="text-sm hover:text-primary transition-colors">{t(item.label)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">{t('footerConnect')}</h3>
            <div className="flex space-x-4">
              {social.map((item, index) => (
                <Link key={index} href={item.href} aria-label={item['aria-label']}>
                  <SocialIcon iconName={item.icon} className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-foreground/60">
            © {new Date().getFullYear()} {settings.name}. {t('footerRights')}
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
