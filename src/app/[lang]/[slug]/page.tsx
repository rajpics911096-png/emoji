
'use client';

import { notFound, useParams } from 'next/navigation';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useSiteSettings } from '@/context/site-settings-context';
import { usePageStore } from '@/lib/store';

const getPageBySlug = (slug: string, pages: any[]) => {
    return pages.find((page) => page.slug === slug);
}

export default function GenericPage() {
  const params = useParams<{ slug: string, lang: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const { pages } = usePageStore();
  const page = getPageBySlug(slug, pages);
  const { settings } = useSiteSettings();

  if (!page || page.status === 'draft') {
    notFound();
  }
  
  const metaTitle = page.metaTitle || page.title;
  const metaDescription = page.metaDescription || settings.metaDescription;


  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
      </Head>
      <Header lang={lang} />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
            <div className="prose lg:prose-xl dark:prose-invert max-w-4xl mx-auto">
                <h1>{page.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
            </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
