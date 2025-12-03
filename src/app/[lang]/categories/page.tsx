
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { SvgIcon } from '@/components/svg-icon';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore } from '@/lib/store';
import { useMemo } from 'react';

export default function CategoriesPage() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const { t } = useTranslations();
  const { categories } = useCategoryStore();

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return t(a.name).localeCompare(t(b.name));
    });
  }, [categories, t]);

  return (
      <main className="flex-1">
        <section id="categories" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
              {t('exploreCategories')}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/${lang}/emojis/${category.id}`}>
                  <Card className="group transform hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-xl h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <SvgIcon svg={category.icon} className="w-14 h-14 mb-3 text-primary transition-colors group-hover:text-accent-foreground" />
                      <h3 className="text-base font-headline font-semibold leading-tight">
                        {t(category.name)}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
  );
}
