import { MetadataRoute } from 'next';
import { emojis, categories, pages } from '@/lib/data';
import { i18n } from '@/lib/i18n-config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emojiverse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  
  const emojiRoutes = emojis.flatMap(emoji => 
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/emoji/${emoji.id}`,
      lastModified: new Date(),
    }))
  );

  const categoryRoutes = categories.flatMap(category => 
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/emojis/${category.id}`,
      lastModified: new Date(),
    }))
  );

  const staticPageRoutes = pages.filter(p => p.status === 'published').flatMap(page => 
    i18n.locales.map(lang => ({
        url: `${BASE_URL}/${lang}/${page.slug}`,
        lastModified: new Date(),
    }))
  );
  
  const homeRoutes = i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
  }));

  return [
    ...homeRoutes,
    ...staticPageRoutes,
    ...categoryRoutes,
    ...emojiRoutes,
  ];
}
