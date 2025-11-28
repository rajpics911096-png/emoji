
'use client';

import { notFound, useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { getRelatedEmojis } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { EmojiCard } from '@/components/emoji-card';
import { EmojiView } from './components/emoji-view';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiDownloads } from './components/emoji-downloads';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslations } from '@/context/translations-context';
import { useSiteSettings } from '@/context/site-settings-context';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';
import type { Thing } from 'schema-dts';
import { useCategoryStore, useEmojiStore } from '@/lib/store';

export default function EmojiPage() {
  const params = useParams<{ id: string, lang: string }>();
  const { id, lang } = params;
  
  const { getEmojiById } = useEmojiStore();
  const { categories } = useCategoryStore();
  const emoji = getEmojiById(id);

  const effectRan = useRef(false);
  const { t } = useTranslations();
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && effectRan.current) return;
    if (emoji) {
      const views = JSON.parse(localStorage.getItem('emojiViews') || '{}');
      views[emoji.id] = (views[emoji.id] || emoji.views || 0) + 1;
      localStorage.setItem('emojiViews', JSON.stringify(views));
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        effectRan.current = true;
      }
    };
  }, [emoji]);

  const jsonLdData: Thing = useMemo(() => {
    if (!emoji) return {};
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const emojiImage = emoji.formats.png[0] || emoji.formats.image[0];

    return {
        '@context': 'https://schema.org',
        '@type': 'Thing',
        name: emoji.metaTitle || emoji.title,
        description: emoji.metaDescription || emoji.description,
        image: emojiImage ? `${baseUrl}${emojiImage.url}` : undefined,
        url: `${baseUrl}/${lang}/emoji/${emoji.id}`,
    };
  }, [emoji, lang]);


  if (!emoji) {
    notFound();
  }

  const category = categories.find(c => c.id === emoji.category);
  const related = getRelatedEmojis(emoji.id);

  const metaTitle = emoji.metaTitle || emoji.title;
  const metaDescription = emoji.metaDescription || settings.metaDescription;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
      </Head>
      <JsonLd data={jsonLdData} />
      <Header lang={lang} />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <EmojiView emoji={emoji} />
                <div className="my-8">
                  <AdSlot location="below_emoji" />
                </div>
                <EmojiDownloads emoji={emoji} lang={lang} />
            </div>
            <aside className="space-y-8">
              <AdSlot location="sidebar" />
              <div className="space-y-4">
                <h3 className="font-headline text-2xl font-semibold text-primary">
                  {t('descriptionTitle')}
                </h3>
                <div className="prose dark:prose-invert max-w-none text-foreground/80" dangerouslySetInnerHTML={{ __html: emoji.description }} />
              </div>

              {category && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('categoryTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/${lang}/emojis/${category.id}`} className="group flex items-center gap-4">
                        <SvgIcon svg={category.icon} className="w-10 h-10 text-primary" />
                        <div>
                            <p className="font-semibold text-lg group-hover:text-primary transition-colors">{t(`category_${category.id}`)}</p>
                            <p className="text-sm text-muted-foreground">{t('viewAllInCategory')}</p>
                        </div>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
          
          {related.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                {t('relatedEmojisTitle')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {related.map((relatedEmoji) => (
                  <EmojiCard key={relatedEmoji.id} emoji={relatedEmoji} lang={lang} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
