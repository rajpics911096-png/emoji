
"use client";

import { useState } from 'react';
import type { Emoji } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';

interface EmojiViewProps {
  emoji: Emoji;
}

export function EmojiView({ emoji }: EmojiViewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslations();

  const handleCopy = () => {
    navigator.clipboard.writeText(emoji.emoji);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <article>
        <div className="flex flex-col items-center text-center p-4 sm:p-8 border rounded-lg bg-card shadow-sm">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">{emoji.title}</h1>
            <div className="my-6 sm:my-8 text-7xl sm:text-8xl md:text-9xl break-words">{emoji.emoji}</div>
            <Button onClick={handleCopy} size="lg" className="w-48 transition-all">
                {isCopied ? (
                <>
                    <Check className="mr-2 h-5 w-5" /> {t('copyButtonCopied')}
                </>
                ) : (
                <>
                    <Copy className="mr-2 h-5 w-5" /> {t('copyButton')}
                </>
                )}
            </Button>
      </div>
    </article>
  );
}
