
'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEmojiById, getRelatedEmojis, emojis, categories } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { EmojiCard } from '@/components/emoji-card';
import { EmojiView } from './components/emoji-view';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiDownloads } from './components/emoji-downloads';
import { useEffect, useRef } from 'react';
import { useTranslations } from '@/context/translations-context';

export default function EmojiPage({ params }: { params: { id: string } }) {
  const emoji = getEmojiById(params.id);
  const effectRan = useRef(false);
  const { t } = useTranslations();

  useEffect(() => {
    if (emoji && !effectRan.current) {
      const views = JSON.parse(localStorage.getItem('emojiViews') || '{}');
      views[emoji.id] = (views[emoji.id] || emoji.views || 0) + 1;
      localStorage.setItem('emojiViews', JSON.stringify(views));
      
      return () => {
        effectRan.current = true;
      };
    }
  }, [emoji]);


  if (!emoji) {
    notFound();
  }

  const category = categories.find(c => c.id === emoji.category);
  const related = getRelatedEmojis(emoji);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <EmojiView emoji={emoji} />
            </div>
            <aside className="space-y-8">
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
                    <Link href={`/emojis/${category.id}`} className="group flex items-center gap-4">
                        <SvgIcon svg={category.icon} className="w-10 h-10 text-primary" />
                        <div>
                            <p className="font-semibold text-lg group-hover:text-primary transition-colors">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{t('viewAllInCategory')}</p>
                        </div>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
          
          <EmojiDownloads emoji={emoji} />

          {related.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                {t('relatedEmojisTitle')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {related.map((relatedEmoji) => (
                  <EmojiCard key={relatedEmoji.id} emoji={relatedEmoji} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
