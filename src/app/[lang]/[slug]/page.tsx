
'use client';

import { notFound, useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { pages as allPages } from '@/lib/data';

const getPageBySlug = (slug: string) => {
    return allPages.find((page) => page.slug === slug);
}

export default function GenericPage() {
  const params = useParams<{ slug: string, lang: string }>();
  const { slug, lang } = params;
  const page = getPageBySlug(slug);

  if (!page || page.status === 'draft') {
    notFound();
  }

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
            <div className="prose lg:prose-xl dark:prose-invert max-w-4xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
            </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
