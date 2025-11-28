
"use client";

import { useState } from 'react';
import type { Emoji } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';

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
        // In a real scenario, you might want to fetch image dimensions.
        // For this prototype, we'll use a standard size.
        const svgString = `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image href="${window.location.origin}${imageUrl}" height="128" width="128"/></svg>`;
        navigator.clipboard.writeText(svgString);
        setIsSvgCopied(true);
        setTimeout(() => setIsSvgCopied(false), 2000);
    }
  };

  const canCopySvg = !!(emoji.formats.png[0] || emoji.formats.image[0]);

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
            </div>
      </div>
    </article>
  );
}
