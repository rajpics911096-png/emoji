
"use client";

import { useState } from 'react';
import type { Emoji } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code, Share2 } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { SvgIcon } from '@/components/svg-icon';

interface EmojiViewProps {
  emoji: Emoji;
}

export function EmojiView({ emoji }: EmojiViewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSvgCopied, setIsSvgCopied] = useState(false);
  const { t } = useTranslations();

  const handleCopy = () => {
    navigator.clipboard.writeText(emoji.emoji);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleCopySvg = () => {
    const imageUrl = emoji.formats.png[0]?.url || emoji.formats.image[0]?.url;
    if (imageUrl) {
        const svgString = `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image href="${window.location.origin}${imageUrl}" height="128" width="128"/></svg>`;
        navigator.clipboard.writeText(svgString);
        setIsSvgCopied(true);
        setTimeout(() => setIsSvgCopied(false), 2000);
    }
  };

  const canCopySvg = !!(emoji.formats.png[0] || emoji.formats.image[0]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = encodeURIComponent(emoji.title);
  const shareImage = typeof window !== 'undefined' && (emoji.formats.png[0]?.url || emoji.formats.image[0]?.url)
    ? encodeURIComponent(window.location.origin + (emoji.formats.png[0]?.url || emoji.formats.image[0]?.url))
    : '';

  const socialShares = [
    { name: 'facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: 'twitter', url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` },
    { name: 'whatsapp', url: `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}` },
    { name: 'pinterest', url: `https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImage}&description=${shareTitle}` },
    { name: 'reddit', url: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}` },
  ];

  return (
    <article>
        <div className="flex flex-col items-center text-center p-4 sm:p-8 border rounded-lg bg-card shadow-sm">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">{emoji.title}</h1>
            <div className="my-6 sm:my-8 text-8xl sm:text-9xl md:text-[10rem] break-words">{emoji.emoji}</div>
            <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={handleCopy} size="default" className="transition-all">
                    {isCopied ? (
                    <>
                        <Check className="mr-2 h-4 w-4" /> {t('copyButtonCopied')}
                    </>
                    ) : (
                    <>
                        <Copy className="mr-2 h-4 w-4" /> {t('copyButton')}
                    </>
                    )}
                </Button>
                {canCopySvg && (
                    <Button onClick={handleCopySvg} size="default" variant="secondary" className="transition-all">
                         {isSvgCopied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" /> SVG Copied
                            </>
                            ) : (
                            <>
                                <Code className="mr-2 h-4 w-4" /> Copy SVG
                            </>
                        )}
                    </Button>
                )}
                 <Popover>
                    <PopoverTrigger asChild>
                       <Button size="default" variant="outline" className="transition-all">
                            <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                        <div className="flex gap-2">
                            {socialShares.map(social => (
                                <Button key={social.name} asChild variant="outline" size="icon" title={`Share on ${social.name}`}>
                                    <Link href={social.url} target="_blank" rel="noopener noreferrer">
                                        <SvgIcon svg={social.name} className="h-5 w-5" />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
      </div>
    </article>
  );
}
