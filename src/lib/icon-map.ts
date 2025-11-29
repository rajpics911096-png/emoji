
import {
  Smile,
  Cat,
  Pizza,
  Swords,
  Plane,
  Lamp,
  Sigma,
  Flag,
  Tags,
  Palette,
  Component,
  Bus,
  Heart,
  Gamepad2,
  Bell,
  Sun,
  Moon,
  Github, 
  Twitter, 
  Linkedin,
  FileText,
  Library,
  PlusCircle,
  ArrowRight,
  Shapes,
  Trees,
  Utensils,
  Globe,
  Award,
  Book,
  AtSign,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import type React from 'react';

// Raw SVG for Pinterest Icon
const pinterestIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M12.5 12c0-2.3.9-4.2 2.6-5.5C13.3 5.4 10.9 5 8.5 5c-4.7 0-7.3 3.4-7.3 7.2 0 3.1 2 5.5 5 5.5 1 0 1.8-.4 2.2-1 .3-.6.4-1.3.3-1.8-.2-.8-.7-1.8-.7-1.8s-.2-.8.6-1.5c.8-.7 1.5.2 1.5 1.5 0 .8-.5 2.1-1.3 3.1-.9 1.2-2.9 2.5-5.3 2.5-6.2 0-9.8-5.1-9.8-9.4 0-4.4 3.4-8.5 8.9-8.5 4.7 0 7.3 2.8 7.3 6.3 0 2.4-1.1 5.1-2.7 5.1-1.1 0-2-.9-2-2.1z"></path></svg>`;

// Raw SVG for Reddit Icon
const redditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.41 8.32c.39 0 .71.32.71.71s-.32.71-.71.71-.71-.32-.71-.71.32-.71.71-.71zm-9.43 0c.39 0 .71.32.71.71s-.32.71-.71.71-.71-.32-.71-.71.32-.71.71-.71zM12 18c-2.39 0-4.39-1.53-5.1-3.61.09-.01.18-.02.28-.02.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05c-.1 0-.19-.01-.28-.02C7.61 16.47 9.61 18 12 18s4.39-1.53 5.1-3.61c-.09.01-.18.02-.28.02-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05c.1 0 .19.01.28.02C16.39 16.47 14.39 18 12 18zm-5.1-4.74c.09-.01.18-.02.28-.02.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05c-.1 0-.19-.01-.28-.02-.19-.92-.3-1.88-.3-2.88 0-.99.11-1.95.3-2.88.09-.01.18-.02.28-.02.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05c-.1 0-.19-.01-.28-.02-.09.47-.14.95-.14 1.44s.05.97.14 1.44zM12 6.5c-2.39 0-4.39 1.53-5.1 3.61.09.01.18.02.28.02.58 0 1.05-.47 1.05-1.05S7.77 8.03 7.19 8.03c-.1 0-.19.01-.28.02C7.61 9.97 9.61 8.5 12 8.5s4.39 1.47 5.1 3.54c-.09-.01-.18-.02-.28-.02-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05c.1 0 .19-.01.28-.02C16.39 11.03 14.39 6.5 12 6.5zm5.1 6.76c-.09.01-.18.02-.28.02-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05c.1 0 .19.01.28.02.19.93.3 1.89.3 2.89s-.11 1.96-.3 2.89c-.09.01-.18.02-.28.02-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05c.1 0 .19-.01.28.02.92-.19 1.77-.52 2.52-.97l-1.66-2.02c.03.02.06.03.1.05.39.23.83.35 1.3.35.75 0 1.41-.35 1.84-.9.44-.55.6-1.25.43-1.95-.17-.7-.66-1.3-1.32-1.64-.66-.34-1.42-.4-2.12-.22l2.02-1.66c-.75-.45-1.6-.78-2.52-.97z"/></svg>`;

// Raw SVG for LinkedIn Icon
const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;

const whatsappIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.099l-1.39 5.095 5.187-1.359z"/></svg>`;

const facebookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>`;

const twitterIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.432.23-2.184.087.623 1.953 2.434 3.374 4.588 3.415-1.718 1.341-3.882 2.053-6.228 1.73A12.523 12.523 0 0 0 8.817 21c7.3 0 11.284-6.043 10.9-11.522.88-.634 1.637-1.42 2.257-2.342z"/></svg>`;

export const iconMap: { [key: string]: React.ComponentType<{ className?: string }> | string } = {
  'smile': Smile,
  'cat': Cat,
  'pizza': Pizza,
  'swords': Swords,
  'plane': Plane,
  'lamp': Lamp,
  'sigma': Sigma,
  'flag': Flag,
  'tags': Tags,
  'palette': Palette,
  'component': Component,
  'bus': Bus,
  'heart': Heart,
  'gamepad-2': Gamepad2,
  'bell': Bell,
  'sun': Sun,
  'moon': Moon,
  'github': Github,
  'twitter': twitterIcon,
  'linkedin': linkedinIcon,
  'file-text': FileText,
  'library': Library,
  'plus-circle': PlusCircle,
  'arrow-right': ArrowRight,
  'shapes': Shapes,
  'trees': Trees,
  'utensils': Utensils,
  'globe': Globe,
  'award': Award,
  'book': Book,
  'at-sign': AtSign,
  'facebook': facebookIcon,
  'whatsapp': whatsappIcon,
  'reddit': redditIcon,
  'pinterest': pinterestIcon,
};

export const iconNames = Object.keys(iconMap);

export const socialIconNames = ['github', 'twitter', 'linkedin', 'facebook', 'whatsapp', 'reddit', 'pinterest'];

export const getIconName = (IconComponent: React.ComponentType<{ className?: string }>) => {
    for (const name in iconMap) {
      if (iconMap[name] === IconComponent) {
        return name;
      }
    }
    return 'smile'; 
  };
