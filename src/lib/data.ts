import type { Emoji, EmojiCategory, FooterContent, Page } from './types';

export const categories: EmojiCategory[] = [
    { id: 'all', name: 'category_all', icon: 'shapes' },
    { id: 'smileys-and-people', name: 'category_smileys_and_people', icon: 'smile' },
    { id: 'animals-and-nature', name: 'category_animals_and_nature', icon: 'trees' },
    { id: 'food-and-drink', name: 'category_food_and_drink', icon: 'utensils' },
    { id: 'activities', name: 'category_activities', icon: 'award' },
    { id: 'travel-and-places', name: 'category_travel_and_places', icon: 'globe' },
    { id: 'objects', name: 'category_objects', icon: 'lamp' },
    { id: 'symbols', name: 'category_symbols', icon: 'at-sign' },
    { id: 'flags', name: 'category_flags', icon: 'flag' },
];

export const emojis: Emoji[] = [];

export const pages: Page[] = [
    { id: 'about-us', title: 'About Us', slug: 'about-us', status: 'published', content: '<h1>About Us</h1><p>This is the about us page. Welcome!</p>' },
    { id: 'contact-us', title: 'Contact Us', slug: 'contact-us', status: 'draft', content: '<h1>Contact Us</h1><p>This is the contact us page. Get in touch!</p>' },
    { id: 'privacy-policy', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published', content: '<h1>Privacy Policy</h1><p>This is the privacy policy page. We respect your privacy.</p>' },
];

export function getEmojiById(id: string) {
  return emojis.find((emoji) => emoji.id === id);
}

export function getEmojisByCategory(categoryId: string) {
  if (categoryId === 'all') return emojis;
  return emojis.filter((emoji) => emoji.category === categoryId);
}

export function getRelatedEmojis(emojiId: string) {
    const emoji = emojis.find(e => e.id === emojiId);
    if (!emoji) return [];
    return emojis.filter(e => emoji.related.includes(e.id));
}


export const footerContent: FooterContent = {
  navigation: [
    { label: 'category_all', href: '/emojis/all' },
    { label: 'category_smileys_and_people', href: '/emojis/smileys-and-people' },
    { label: 'category_animals_and_nature', href: '/emojis/animals-and-nature' },
    { label: 'category_food_and_drink', href: '/emojis/food-and-drink' },
  ],
  legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  social: [
    { icon: 'twitter', 'aria-label': 'Twitter', href: '#' },
    { icon: 'github', 'aria-label': 'GitHub', href: '#' },
    { icon: 'linkedin', 'aria-label': 'LinkedIn', href: '#' },
  ],
};
