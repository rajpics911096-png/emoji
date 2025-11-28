import type { Emoji, EmojiCategory, FooterContent, Page } from './types';

export const categories: EmojiCategory[] = [
    { id: 'all', name: 'category_all', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>' },
    { id: 'smileys-and-people', name: 'category_smileys_and_people', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>' },
    { id: 'animals-and-nature', name: 'category_animals_and_nature', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cat"><path d="M12 5c.67 0 1.35.09 2 .26 1.78.46 3.1 1.42 4.02 2.74.3.42.58.9.58 1.42v2.24c0 .42-.1.83-.3 1.2-.42.8-1.02 1.5-1.7 2.06-.88.74-2.15 1.2-3.6 1.2s-2.72-.46-3.6-1.2c-.68-.56-1.28-1.26-1.7-2.06-.2-.37-.3-.78-.3-1.2V9.42c0-.52.28-1 .58-1.42.92-1.32 2.24-2.28 4.02-2.74.65-.17 1.33-.26 2-.26m0-4c-2.29 0-4.5.54-6.4 1.6-2.18 1.2-3.6 3.2-3.6 5.4v2.4c0 1.38.45 2.73 1.28 3.82.88 1.14 2.1 2 3.52 2.5 2.13.75 4.47.75 6.6 0 1.42-.5 2.64-1.36 3.52-2.5.83-1.09 1.28-2.44 1.28-3.82V9c0-2.2-1.42-4.2-3.6-5.4C16.5 1.54 14.29 1 12 1z"/><path d="M12 16c-1.66 0-3-1.34-3-3"/><path d="M12.5 8.5A.5.5 0 0 1 12 9a.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5"/><path d="M15.5 9.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5"/><path d="M8.5 9.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5"/></svg>' },
    { id: 'food-and-drink', name: 'category_food_and_drink', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pizza"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 2.2-1.2a1 1 0 0 1 1.32 1.08l-1.5 5.5A1 1 0 0 1 3 22H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><path d="M22 14.2V16a1 1 0 0 1-1 1h-1a1 1 0 0 1-1.08-1.32L20 16l-5.5-3.08a1 1 0 0 1-1.08-1.32L14.8 6l-1.12-2.3A1 1 0 0 1 14.6 2h0a1 1 0 0 1 .92.68L17 6.6l3.4 1.9a2 2 0 0 1 1.6 1.8v.2a2 2 0 0 1-1.6 1.8Z"/></svg>' },
    { id: 'activities', name: 'category_activities', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords"><g><path d="M14.5 3.5c3 0 5.5 2.5 5.5 5.5 0 2.2-1.3 4-3 5-1.7 1-3.8 1-5.5 0-1.7-1-3-2.8-3-5 0-3 2.5-5.5 5.5-5.5Z"/><path d="m2 22 4.5-4.5"/><path d="m10.5 10.5 4.5 4.5"/><path d="m16.5 3.5 4.5 4.5"/><path d="m3.5 16.5 4.5-4.5"/></g></svg>' },
    { id: 'travel-and-places', name: 'category_travel_and_places', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1.5-1.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>' },
    { id: 'objects', name: 'category_objects', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lamp"><path d="m13 18-3 4h10l-3-4Z"/><path d="M14 14.056V3.6a.4.4 0 0 0-.64-.32l-5.2 3.9a.4.4 0 0 0 0 .64l5.2 3.9a.4.4 0 0 0 .64-.32Z"/><path d="M10.7 14h6.6"/><path d="M14 18.01V22"/></svg>' },
    { id: 'symbols', name: 'category_symbols', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sigma"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>' },
    { id: 'flags', name: 'category_flags', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>' },
];

export const emojis: Emoji[] = [
  {
    id: 'grinning-face',
    emoji: '😀',
    title: 'Grinning Face',
    description:
      'A yellow face with simple, open eyes and a broad, open smile, showing upper teeth and tongue on some platforms. Often conveys general pleasure and good cheer or humor.',
    category: 'smileys-and-people',
    formats: {
      png: [
        {
          name: 'grinning-face.png',
          size: '15 KB',
          url: '/placeholder.png',
        },
      ],
      gif: [
        {
          name: 'grinning-face.gif',
          size: '1.1 MB',
          url: '/placeholder.gif',
        },
      ],
      image: [
        {
          name: 'grinning-face.jpg',
          size: '85 KB',
          url: '/placeholder.jpg',
        },
      ],
      video: [
        {
          name: 'grinning-face.mp4',
          size: '3.8 MB',
          url: '/placeholder.mp4',
        },
      ],
    },
    related: ['rolling-on-the-floor-laughing', 'winking-face'],
    views: 1234,
    createdAt: new Date('2023-01-15T09:30:00Z').getTime(),
  },
  {
    id: 'rolling-on-the-floor-laughing',
    emoji: '🤣',
    title: 'Rolling on the Floor Laughing',
    description:
      'A yellow face with a big grin and scrunched, X-shaped eyes, tilted on its side as if rolling on the floor laughing. Shedding two tears and widely used to show something is hilarious.',
    category: 'smileys-and-people',
    formats: {
      png: [],
      gif: [{ name: 'rofl.gif', size: '1.2 MB', url: '/placeholder.gif' }],
      image: [],
      video: [],
    },
    related: ['grinning-face', 'winking-face'],
    views: 5678,
    createdAt: new Date('2023-02-20T14:00:00Z').getTime(),
  },
  {
    id: 'winking-face',
    emoji: '😉',
    title: 'Winking Face',
    description:
      'A yellow face with a slight smile or smirk and one eye winking, usually the left. May signal a joke, flirtation, hidden meaning, or general positivity. Tone varies, including playful, affectionate, or ironic.',
    category: 'smileys-and-people',
    formats: {
      png: [
        { name: 'wink-128.png', size: '14 KB', url: '/placeholder.png' },
        { name: 'wink-256.png', size: '32 KB', url: '/placeholder.png' },
      ],
      gif: [],
      image: [],
      video: [],
    },
    related: ['grinning-face', 'rolling-on-the-floor-laughing'],
    views: 9101,
    createdAt: new Date('2023-03-10T11:20:00Z').getTime(),
  },
  {
    id: 'cat-face',
    emoji: '🐱',
    title: 'Cat Face',
    description:
      'A cartoon-styled face of a cat. Generally depicted as a yellowish-orange cat face with pointed ears and whiskers. May be used with a more affectionate tone than the full-bodied 🐈 Cat, though their applications generally overlap.',
    category: 'animals-and-nature',
    formats: {
      png: [],
      gif: [],
      image: [{ name: 'cat-face.jpg', size: '88 KB', url: '/placeholder.jpg' }],
      video: [],
    },
    related: ['dog-face', 'lion-face'],
    views: 1121,
    createdAt: new Date('2023-04-05T18:00:00Z').getTime(),
  },
  {
    id: 'dog-face',
    emoji: '🐶',
    title: 'Dog Face',
    description:
      'A cartoon-styled face of a dog. Generally depicted as a generic, light-brown dog face with perky ears and its tongue hanging out. Often used with an affectionate or friendly tone.',
    category: 'animals-and-nature',
    formats: {
      png: [],
      gif: [],
      image: [{ name: 'dog-face.jpg', size: '92 KB', url: '/placeholder.jpg' }],
      video: [],
    },
    related: ['cat-face', 'lion-face'],
    views: 3141,
    createdAt: new Date('2023-05-01T08:00:00Z').getTime(),
  },
  {
    id: 'lion-face',
    emoji: '🦁',
    title: 'Lion Face',
    description: 'The face of a lion, the king of the jungle. Depicted as a male lion with a golden-brown mane. May be used to represent the Leo astrological sign.',
    category: 'animals-and-nature',
    formats: {
      png: [],
      gif: [],
      image: [],
      video: [{ name: 'lion.mp4', size: '4.5 MB', url: '/placeholder.mp4' }],
    },
    related: ['cat-face', 'dog-face'],
    views: 5161,
    createdAt: new Date('2023-06-22T22:00:00Z').getTime(),
  },
  {
    id: 'pizza',
    emoji: '🍕',
    title: 'Pizza',
    description: 'A slice of pizza, topped with cheese and pepperoni. A universal symbol of fast food and a favorite dish for many.',
    category: 'food-and-drink',
    formats: {
      png: [{ name: 'pizza-slice.png', size: '22 KB', url: '/placeholder.png' }],
      gif: [],
      image: [],
      video: [],
    },
    related: ['hamburger', 'french-fries'],
    views: 7181,
    createdAt: new Date('2023-07-14T12:00:00Z').getTime(),
  },
  {
    id: 'hamburger',
    emoji: '🍔',
    title: 'Hamburger',
    description: 'A hamburger, a sandwich consisting of a cooked patty of ground meat usually placed inside a sliced bread roll or bun.',
    category: 'food-and-drink',
    formats: {
      png: [],
      gif: [],
      image: [{ name: 'burger.jpg', size: '101 KB', url: '/placeholder.jpg' }],
      video: [],
    },
    related: ['pizza', 'french-fries'],
    views: 9191,
    createdAt: new Date('2023-08-18T19:45:00Z').getTime(),
  },
  {
    id: 'french-fries',
    emoji: '🍟',
    title: 'French Fries',
    description: 'A serving of french fries, or chips, as served at a fast-food restaurant. Held in a red carton, as at McDonald’s.',
    category: 'food-and-drink',
    formats: {
        png: [],
        gif: [],
        image: [],
        video: []
    },
    related: ['pizza', 'hamburger'],
    views: 2123,
    createdAt: new Date('2023-09-03T16:15:00Z').getTime(),
  },
  {
    id: 'rocket',
    emoji: '🚀',
    title: 'Rocket',
    description: 'A rocket, used to travel into space. Commonly used to represent speed, progress, and launching new projects.',
    category: 'travel-and-places',
    formats: {
        png: [{name: 'rocket_128.png', size: '18kb', url: '/placeholder.png'}],
        gif: [{name: 'rocket_anim.gif', size: '2.1MB', url: '/placeholder.gif'}],
        image: [],
        video: []
    },
    related: ['airplane', 'statue-of-liberty'],
    views: 4252,
    createdAt: new Date('2023-10-29T10:00:00Z').getTime(),
  },
    {
    id: 'airplane',
    emoji: '✈️',
    title: 'Airplane',
    description: 'An airplane, a fixed-wing aircraft that is propelled forward by thrust from a jet engine, propeller, or rocket engine.',
    category: 'travel-and-places',
    formats: {
        png: [],
        gif: [],
        image: [],
        video: []
    },
    related: ['rocket', 'statue-of-liberty'],
    views: 6272,
    createdAt: new Date('2023-11-11T11:11:00Z').getTime(),
  },
  {
    id: 'statue-of-liberty',
    emoji: '🗽',
    title: 'Statue of Liberty',
    description: 'The Statue of Liberty, a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States.',
    category: 'travel-and-places',
    formats: {
        png: [],
        gif: [],
        image: [],
        video: []
    },
    related: ['rocket', 'airplane'],
    views: 8292,
    createdAt: new Date('2023-12-25T00:00:00Z').getTime(),
  }
];

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
