import type { Emoji, EmojiCategory } from './types';
import {
  Smile,
  Cat,
  Pizza,
  Swords,
  Plane,
  Lamp,
  Sigma,
  Flag,
} from 'lucide-react';

export const categories: EmojiCategory[] = [
  { id: 'all', name: 'All Emojis', icon: Smile },
  {
    id: 'smileys-and-people',
    name: 'Smileys & People',
    icon: Smile,
  },
  { id: 'animals-and-nature', name: 'Animals & Nature', icon: Cat },
  { id: 'food-and-drink', name: 'Food & Drink', icon: Pizza },
  { id: 'activities', name: 'Activities', icon: Swords },
  { id: 'travel-and-places', name: 'Travel & Places', icon: Plane },
  { id: 'objects', name: 'Objects', icon: Lamp },
  { id: 'symbols', name: 'Symbols', icon: Sigma },
  { id: 'flags', name: 'Flags', icon: Flag },
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
          name: 'grinning-face-128.png',
          size: '15 KB',
          url: '/placeholder.png',
        },
      ],
      gif: [],
      image: [],
      video: [],
    },
    related: ['rolling-on-the-floor-laughing', 'winking-face'],
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
    related: ['pizza', 'hamburger']
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
    related: ['airplane', 'statue-of-liberty']
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
    related: ['rocket', 'statue-of-liberty']
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
    related: ['rocket', 'airplane']
  }
];

export function getEmojiById(id: string) {
  return emojis.find((emoji) => emoji.id === id);
}

export function getEmojisByCategory(categoryId: string) {
  if (categoryId === 'all') return emojis;
  return emojis.filter((emoji) => emoji.category === categoryId);
}

export function getRelatedEmojis(emoji: Emoji) {
    return emojis.filter(e => emoji.related.includes(e.id));
}

export const downloadTimer = 15; // default 15 seconds
