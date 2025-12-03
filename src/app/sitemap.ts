
import { MetadataRoute } from 'next';
import { useEmojiStore, useCategoryStore, usePageStore } from '@/lib/store';
import { i18n } from '@/lib/i18n-config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emojiverse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Directly access the persisted state. This is a simplified approach for this environment.
  // In a real-world scenario with a proper backend, you would fetch this data from your database.
  const { emojis } = useEmojiStore.getState();
  const { categories } = useCategoryStore.getState();
  const { pages } = usePageStore.getState();

  const emojiRoutes = emojis.flatMap(emoji =>
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/emoji/${emoji.id}`,
      lastModified: new Date(emoji.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const categoryRoutes = categories.flatMap(category =>
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/emojis/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  const staticPageRoutes = pages.filter(p => p.status === 'published').flatMap(page =>
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  );
  
  const homeRoutes = i18n.locales.map(lang => ({
    url: `${BASE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return [
    ...homeRoutes,
    ...staticPageRoutes,
    ...categoryRoutes,
    ...emojiRoutes,
  ];
}
