
"use client";

import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import Image from 'next/image';
import { useTranslations } from '@/context/translations-context';
import { useEmojiStore } from '@/lib/store';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MediaPage() {
    const { t } = useTranslations();
    const { emojis } = useEmojiStore();
    const params = useParams();
    const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
    const router = useRouter();

    const filePosts = useMemo(() => emojis.filter(emoji => !emoji.emoji), [emojis]);

    const PostCard = ({ post }: { post: Emoji }) => {
        const allFiles = (Object.entries(post.formats) as [keyof Emoji['formats'], any[]][])
            .flatMap(([format, files]) => files.map(file => ({ ...file, format })));
        
        const firstFile = allFiles[0];
        const totalFiles = allFiles.length;

        const availableFormats = [...new Set(allFiles.map(f => {
            if (!f.format) return null;
            if (f.format === 'image' && f.type?.includes('png')) return 'PNG';
            if (f.format === 'image' && f.type?.includes('gif')) return 'GIF';
            if (f.format === 'image') return 'IMAGE';
            return f.format.toUpperCase();
        }).filter(Boolean))];

        const formatsString = availableFormats.join(', ');

        const postUrl = `/${lang}/file/${post.id}`;

        return (
             <Link href={postUrl} className="group block relative overflow-hidden rounded-xl">
                <Card className="w-full h-full transition-shadow duration-300 group-hover:shadow-2xl">
                    <div className="aspect-square w-full h-full">
                    {firstFile?.url && (
                        <Image 
                        src={firstFile.url} 
                        alt={t(post.title)} 
                        layout="fill" 
                        objectFit="cover" 
                        className="transition-transform duration-300 group-hover:scale-110"
                        unoptimized={firstFile.format === 'gif'}
                        />
                    )}
                    </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </Card>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-headline font-bold text-lg leading-tight truncate">{t(post.title)}</h3>
                    <p className="text-sm text-white/80">{`${totalFiles} Files (${formatsString})`}</p>
                </div>
            </Link>
        );
    };

    return (
        <>
        <Header lang={lang} />
        <main className="flex-1 container mx-auto py-8 px-4">
            <div className="text-center mb-8 md:mb-10">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
                    {t('media_title')}
                </h1>
                <p className="mt-3 text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                    {t('media_description')}
                </p>
            </div>

            {filePosts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {filePosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-xl text-muted-foreground">{t('media_empty_library_title')}</p>
                    <p className="text-muted-foreground">{t('media_empty_library_desc')}</p>
                </div>
            )}
        </main>
        <Footer lang={lang} />
        </>
    );
}
