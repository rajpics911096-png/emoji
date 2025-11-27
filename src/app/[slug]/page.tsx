import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { pages } from '@/app/admin/pages/page'; // This is a temporary import path, should be from a central data source.

// In a real app, this would be fetched from a database or CMS
const getPageBySlug = (slug: string) => {
    // This is a temporary solution. In a real app, you'd fetch this from a persistent data source.
    // For now, we'll simulate it by importing initialPages from the admin page component.
    const allPages: Array<{id: string, title: string, slug: string, status: 'published' | 'draft', content?:string}> = [
        { id: 'about-us', title: 'About Us', slug: 'about-us', status: 'published', content: '<h1>About Us</h1><p>This is the about us page. Welcome!</p>' },
        { id: 'contact-us', title: 'Contact Us', slug: 'contact-us', status: 'draft', content: '<h1>Contact Us</h1><p>This is the contact us page. Get in touch!</p>' },
        { id: 'privacy-policy', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published', content: '<h1>Privacy Policy</h1><p>This is the privacy policy page. We respect your privacy.</p>' },
    ];
    return allPages.find((page) => page.slug === slug);
}

export async function generateStaticParams() {
    const allPages = getPageBySlug('') ? [] : []; // Temporary to satisfy build
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
