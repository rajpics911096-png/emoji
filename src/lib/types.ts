
export type EmojiFormatFile = {
  url: string;
  size: string;
  name: string;
  type?: string;
};

export type Emoji = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: string;
  formats: {
    png: EmojiFormatFile[];
    gif: EmojiFormatFile[];
    image: EmojiFormatFile[];
    video: EmojiFormatFile[];
  };
  related: string[];
  views: number;
  createdAt: number;
  metaTitle?: string;
  metaDescription?: string;
};

export type EmojiCategory = {
  id: string;
  name: string;
  icon: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  icon: string;
  'aria-label': string;
  href: string;
};

export type FooterContent = {
  navigation: LinkItem[];
  legal: LinkItem[];
  social: SocialLink[];
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  content?: string; // Content will be markdown or HTML
  metaTitle?: string;
  metaDescription?: string;
}

export type AdSetting = {
  location: string;
  code: string;
  enabled: boolean;
  align?: 'left' | 'center' | 'right';
};

export type HSLColor = {
  h: number;
  s: number;
  l: number;
};

export type ColorSettings = {
  background?: HSLColor;
  foreground?: HSLColor;
  card?: HSLColor;
  primary?: HSLColor;
  secondary?: HSLColor;
  muted?: HSLColor;
  accent?: HSLColor;
}

export type SiteSettings = {
  name: string;
  logo: string; // SVG code as a string
  favicon: string; // SVG code as a string
  metaTitle?: string;
  metaDescription?: string;
  downloadTimer: number;
  adSettings: AdSetting[];
  adsTxtContent?: string;
  colors?: ColorSettings;
};
