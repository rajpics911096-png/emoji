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
} from 'lucide-react';

export const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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
};

export const iconNames = Object.keys(iconMap);

export const socialIconNames = ['github', 'twitter', 'linkedin'];

export const getIconName = (IconComponent: React.ComponentType<{ className?: string }>) => {
    for (const name in iconMap) {
      if (iconMap[name] === IconComponent) {
        return name;
      }
    }
    return 'smile'; 
  };
