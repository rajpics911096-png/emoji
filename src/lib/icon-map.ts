
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
const pinterestIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #E60023;"><path d="M12.5 12c0-2.3.9-4.2 2.6-5.5C13.3 5.4 10.9 5 8.5 5c-4.7 0-7.3 3.4-7.3 7.2 0 3.1 2 5.5 5 5.5 1 0 1.8-.4 2.2-1 .3-.6.4-1.3.3-1.8-.2-.8-.7-1.8-.7-1.8s-.2-.8.6-1.5c.8-.7 1.5.2 1.5 1.5 0 .8-.5 2.1-1.3 3.1-.9 1.2-2.9 2.5-5.3 2.5-6.2 0-9.8-5.1-9.8-9.4 0-4.4 3.4-8.5 8.9-8.5 4.7 0 7.3 2.8 7.3 6.3 0 2.4-1.1 5.1-2.7 5.1-1.1 0-2-.9-2-2.1z"></path></svg>`;

// Raw SVG for Reddit Icon
const redditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #FF4500;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.6 12.3c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0c.3.3.3.8 0 1.1zm-4.7-1.1c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1s-.8-.3-1.1 0c-.3.3-.3.8 0 1.1zm3.1 3.8c-1.1 0-2.1-.5-2.8-1.2l-2.4 1.7c.4.4.9.7 1.5.9.6.2 1.2.3 1.8.3s1.2-.1 1.8-.3c.6-.2 1.1-.5 1.5-.9l-2.4-1.7c-.7.7-1.7 1.2-2.8 1.2z"></path><path d="M16.2 10.9c-.3-.3-.8-.3-1.1 0s-.3.8 0 1.1c.3.3.8.3 1.1 0s.3-.8 0-1.1z"></path><path d="M9.8 11.2c0-.5-.4-.9-.9-.9s-.9.4-.9.9.4.9.9.9.9-.4.9-.9zm8.4 0c0-.5-.4-.9-.9-.9s-.9.4-.9.9.4.9.9.9.9-.4.9-.9zm-4.2-2.4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-4.2 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path><path d="M18 14.7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></svg>`;

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
  'twitter': Twitter,
  'linkedin': Linkedin,
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
  'facebook': Facebook,
  'whatsapp': MessageCircle,
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

