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

export const emojis: Emoji[] = [
  {
    id: 'grinning-face',
    emoji: '😀',
    title: 'emoji_grinning_face_title',
    description: 'emoji_grinning_face_desc',
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
    title: 'emoji_rofl_title',
    description: 'emoji_rofl_desc',
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
    title: 'emoji_winking_face_title',
    description: 'emoji_winking_face_desc',
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
    title: 'emoji_cat_face_title',
    description: 'emoji_cat_face_desc',
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
    title: 'emoji_dog_face_title',
    description: 'emoji_dog_face_desc',
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
    title: 'emoji_lion_face_title',
    description: 'emoji_lion_face_desc',
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
    title: 'emoji_pizza_title',
    description: 'emoji_pizza_desc',
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
    title: 'emoji_hamburger_title',
    description: 'emoji_hamburger_desc',
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
    title: 'emoji_french_fries_title',
    description: 'emoji_french_fries_desc',
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
    title: 'emoji_rocket_title',
    description: 'emoji_rocket_desc',
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
    title: 'emoji_airplane_title',
    description: 'emoji_airplane_desc',
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
    title: 'emoji_statue_of_liberty_title',
    description: 'emoji_statue_of_liberty_desc',
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
