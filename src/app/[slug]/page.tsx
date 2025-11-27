import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { pages as allPages } from '@/lib/data'; // This is a temporary import path, should be from a central data source.

// In a real app, this would be fetched from a database or CMS
const getPageBySlug = (slug: string) => {
    // This is a temporary solution. In a real app, you'd fetch this from a persistent data source.
    return allPages.find((page) => page.slug === slug);
}

export async function generateStaticParams() {
    return allPages.filter(p => p.status === 'published').map((page) => ({
      slug: page.slug,
    }));
  }

export default function GenericPage({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(params.slug);

  if (!page || page.status === 'draft') {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
            <div className="prose lg:prose-xl dark:prose-invert max-w-4xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
