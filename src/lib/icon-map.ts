
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
} from 'lucide-react';
import type React from 'react';

const pinterestIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.027-.655 2.56-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.117.223.084.345l-.239.938c-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.782 2.75-7.25 7.929-7.25 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.627 0 11.983-5.373 11.983-12.013S18.644 0 12.017 0z"/></svg>`;
const redditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0zm5.64 13.911c-.195.636-.675 1.131-1.383 1.296-.138.033-.276.048-.411.048-.795 0-1.488-.495-1.782-1.233-1.053.6-2.337.954-3.705.954-1.368 0-2.652-.354-3.705-.954-.294.738-.987 1.233-1.782 1.233-.135 0-.273-.015-.411-.048-.708-.165-1.188-.66-1.383-1.296-.12-.393-.105-.819.039-1.203.144-.384.426-.705.792-.894.369-.192.789-.255 1.194-.183.045.51.159 1.002.333 1.467.753.27 1.566.42 2.415.441V11.25h-1.44c-.345 0-.663-.225-.771-.549-.108-.324-.015-.69.231-.918l3.159-2.925c.195-.18.459-.279.729-.279.27 0 .534.1.729.279l3.159 2.925c.246.228.339.594.231.918-.108.324-.426.549-.771.549h-1.44v2.733c.849-.021 1.662-.171 2.415-.441.174-.465.288-.957.333-1.467.405-.072.825-.009 1.194.183.366.189.648.51.792.894.141.381.156.807.036 1.2zM9.9 10.551l1.539 1.422 1.539-1.422h1.56v1.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.5h1.5c.312 0 .588-.183.711-.459.123-.276.075-.6-.126-.822-.201-.222-1.623-1.83-1.623-3.255 0-.414-.336-.75-.75-.75s-.75.336-.75.75c0 1.026 1.059 2.1 1.221 2.274h-1.773c-.414 0-.75.336-.75.75s.336.75.75.75z"/></svg>`;
const whatsappIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.099l-1.39 5.095 5.187-1.359z"/></svg>`;
const facebookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>`;
const xIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM16.91 20.644h2.039L6.486 3.24H4.298l12.612 17.404z"/></svg>`;
const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;


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
  'twitter': xIcon,
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
