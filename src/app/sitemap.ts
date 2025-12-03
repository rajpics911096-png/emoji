
import { MetadataRoute } from 'next';
import { useEmojiStore, useCategoryStore, usePageStore } from '@/lib/store';
import { i18n } from '@/lib/i18n-config';

// In a real-world scenario, this should be set in your environment variables.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://emojiverse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Directly access the persisted state from Zustand stores.
  // This is a simplified approach for this prototyping environment.
  // In a production app, you might fetch this from a database during the build process.
  const { emojis } = useEmojiStore.getState();
  const { categories } = useCategoryStore.getState();
  const { pages } = usePageStore.getState();

  // Generate routes for all emoji and file posts
  const postRoutes = emojis.flatMap(post =>
    i18n.locales.map(lang => {
      // Differentiate between an emoji post and a file-based post
      const path = post.emoji ? 'emoji' : 'file';
      return {
        url: `${BASE_URL}/${lang}/${path}/${post.id}`,
        lastModified: new Date(post.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    })
  );

  // Generate routes for all emoji categories
  const categoryRoutes = categories.flatMap(category =>
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}/emojis/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // Generate routes for all published static pages
  const staticPageRoutes = pages
    .filter(p => p.status === 'published')
    .flatMap(page =>
      i18n.locales.map(lang => ({
        url: `${BASE_URL}/${lang}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    );
  
  // Generate routes for the homepage of each language
  const homeRoutes = i18n.locales.map(lang => ({
    url: `${BASE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));
  
  // Generate routes for main sections like all categories and all media
  const mainSections = ['/categories', '/media'].flatMap(section => 
    i18n.locales.map(lang => ({
      url: `${BASE_URL}/${lang}${section}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    }))
  );

  // Combine all routes into a single sitemap
  return [
    ...homeRoutes,
    ...mainSections,
    ...staticPageRoutes,
    ...categoryRoutes,
    ...postRoutes,
  ];
}
