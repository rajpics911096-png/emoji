import Link from 'next/link';
import { Logo } from './icons';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl font-headline">EmojiVerse</span>
            </Link>
            <p className="text-sm text-foreground/70">
              The ultimate collection of emojis for every occasion.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/emojis/all" className="text-sm hover:text-primary transition-colors">All Emojis</Link></li>
              <li><Link href="/emojis/smileys-and-people" className="text-sm hover:text-primary transition-colors">Smileys & People</Link></li>
              <li><Link href="/emojis/animals-and-nature" className="text-sm hover:text-primary transition-colors">Animals & Nature</Link></li>
              <li><Link href="/emojis/food-and-drink" className="text-sm hover:text-primary transition-colors">Food & Drink</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-foreground/60">
            © {new Date().getFullYear()} EmojiVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
