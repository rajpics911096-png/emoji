import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEmojiById, getRelatedEmojis, emojis } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { EmojiCard } from '@/components/emoji-card';
import { EmojiView } from './components/emoji-view';

export async function generateStaticParams() {
    return emojis.map((emoji) => ({
      id: emoji.id,
    }));
  }

export default function EmojiPage({ params }: { params: { id: string } }) {
  const emoji = getEmojiById(params.id);

  if (!emoji) {
    notFound();
  }

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
            <aside>
                <div>
                    <h3 className="font-headline text-2xl font-semibold mb-2 text-primary">Description</h3>
                    <p className="text-lg text-foreground/80 leading-relaxed">{emoji.description}</p>
                </div>
            </aside>
          </div>
          {related.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                Related Emojis
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
