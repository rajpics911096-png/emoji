
'use client';

import { SvgIcon } from './svg-icon';
import { Button } from './ui/button';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function SocialShareButtons({ url, title, className }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90',
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      className: 'bg-[#25D366] hover:bg-[#25D366]/90',
    },
    {
      name: 'Pinterest',
      icon: 'pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedUrl}&description=${encodedTitle}`,
      className: 'bg-[#E60023] hover:bg-[#E60023]/90',
    },
    {
      name: 'Reddit',
      icon: 'reddit',
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      className: 'bg-[#FF4500] hover:bg-[#FF4500]/90',
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      className: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90',
    },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      {socialPlatforms.map((platform) => (
        <Button
          key={platform.name}
          asChild
          variant="default"
          size="icon"
          className={`text-white ${platform.className}`}
        >
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${platform.name}`}
          >
            <SvgIcon svg={platform.icon} className="h-5 w-5" />
          </a>
        </Button>
      ))}
    </div>
  );
}
