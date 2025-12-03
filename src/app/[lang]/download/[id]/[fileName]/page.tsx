
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SvgIcon } from '@/components/svg-icon';
import { Download, ArrowLeft } from 'lucide-react';
import { useEmojiStore, useCategoryStore } from '@/lib/store';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { SocialShareButtons } from '@/components/social-share-buttons';
import { AdSlot } from '@/components/ad-slot';

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const fileName = Array.isArray(params.fileName) ? decodeURIComponent(params.fileName[0]) : decodeURIComponent(params.fileName);
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const { getEmojiById } = useEmojiStore();
  const { categories } = useCategoryStore();
  const { settings } = useSiteSettings();
  const { t } = useTranslations();

  const [timer, setTimer] = useState(settings.downloadTimer || 10);
  const [isDownloading, setIsDownloading] = useState(false);

  const { post, file } = useMemo(() => {
    const post = getEmojiById(id);
    if (!post) return { post: null, file: null };
    
    const file = (Object.values(post.formats) as EmojiFormatFile[][])
                 .flat()
                 .find(f => f.name === fileName);

    return { post, file };
  }, [id, fileName, getEmojiById]);

  useEffect(() => {
    if (!file || !isDownloading) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
        const fileId = `${post?.id}-${file.name}`;
        const downloads = JSON.parse(localStorage.getItem('fileDownloads') || '{}');
        downloads[fileId] = (downloads[fileId] || 0) + 1;
        localStorage.setItem('fileDownloads', JSON.stringify(downloads));

        const downloadLink = document.createElement('a');
        downloadLink.href = file.url;
        downloadLink.download = file.name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
  }, [timer, file, post, isDownloading]);
  

  if (!post || !file) {
    notFound();
  }

  const postUrl = post.emoji ? `/${lang}/emoji/${post.id}` : `/${lang}/file/${post.id}`;
  const relatedFiles = (Object.values(post.formats) as EmojiFormatFile[][])
                       .flat()
                       .filter(f => f.name !== file.name)
                       .slice(0, 3);
  const isVideo = file.type?.startsWith('video/');

  const handleDownloadClick = () => {
    setIsDownloading(true);
  };

  return (
    <>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-12">
          <div className="flex justify-start">
            <Button variant="outline" asChild>
              <Link href={postUrl}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {t(post.title)}
              </Link>
            </Button>
          </div>
          
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">{file.name}</h1>
            
            <div className="max-w-xl mx-auto border rounded-lg p-4 bg-card">
              {isVideo ? (
                <video src={file.url} controls autoPlay muted loop playsInline className="w-full h-auto max-h-[60vh] object-contain" />
              ) : (
                <Image src={file.url} alt={file.name} width={500} height={500} className="w-full h-auto object-contain" unoptimized={file.type?.includes('gif')} />
              )}
            </div>

            <div className="flex justify-center items-center gap-4 text-muted-foreground text-sm">
                <span>Format: <span className="font-semibold text-foreground">{file.type?.split('/')[1]?.toUpperCase() || 'File'}</span></span>
                <span>Size: <span className="font-semibold text-foreground">{file.size}</span></span>
            </div>

            <Button size="lg" disabled={isDownloading} onClick={handleDownloadClick}>
                <Download className="mr-2 h-5 w-5" />
                {isDownloading && timer > 0 ? `Downloading in ${timer}s...` : 'Download Now'}
            </Button>
            
            <div className="mt-4">
              <SocialShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={`Download ${file.name} from ${settings.name}`} />
            </div>
            
            <AdSlot location="below_download" />
          </div>

          {relatedFiles.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold text-center mb-8">Related Files</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {relatedFiles.map(relatedFile => (
                  <Link key={relatedFile.name} href={`/${lang}/download/${post.id}/${encodeURIComponent(relatedFile.name)}`}>
                    <Card className="group overflow-hidden">
                      <CardContent className="p-2">
                        <div className="aspect-square bg-muted flex items-center justify-center rounded-md overflow-hidden">
                          {relatedFile.type?.startsWith('video/') ? (
                             <video src={relatedFile.url} muted loop playsInline className="w-full h-full object-contain" />
                          ) : (
                             <Image src={relatedFile.url} alt={relatedFile.name} width={150} height={150} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" unoptimized={relatedFile.type?.includes('gif')} />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-headline font-bold text-center mb-8">Explore Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
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
          </section>
        </div>
      </main>
    </>
  );
}
