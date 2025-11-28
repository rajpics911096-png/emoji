
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Emoji, EmojiCategory, FooterContent, Page, LinkItem, SocialLink } from './types';
import { emojis as initialEmojis, categories as initialCategories, pages as initialPages, footerContent as initialFooterContent } from './data';

// Emoji Store
interface EmojiState {
  emojis: Emoji[];
  addEmoji: (emoji: Omit<Emoji, 'id' | 'related' | 'views' | 'createdAt'>) => void;
  updateEmoji: (emoji: Emoji) => void;
  deleteEmoji: (emojiId: string) => void;
  getEmojiById: (id: string) => Emoji | undefined;
  getEmojisByCategory: (categoryId: string) => Emoji[];
  getRelatedEmojis: (emojiId: string) => Emoji[];
}

export const useEmojiStore = create<EmojiState>()(
  persist(
    (set, get) => ({
      emojis: initialEmojis,
      addEmoji: (newEmoji) => {
        const emojiToAdd: Emoji = {
            ...newEmoji,
            id: newEmoji.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            related: [],
            views: 0,
            createdAt: Date.now(),
        };
        set((state) => ({ emojis: [emojiToAdd, ...state.emojis] }))
      },
      updateEmoji: (emoji) => set((state) => ({
        emojis: state.emojis.map((e) => (e.id === emoji.id ? emoji : e)),
      })),
      deleteEmoji: (emojiId) => set((state) => ({
        emojis: state.emojis.filter((e) => e.id !== emojiId),
      })),
      getEmojiById: (id) => get().emojis.find((emoji) => emoji.id === id),
      getEmojisByCategory: (categoryId) => {
        if (categoryId === 'all') return get().emojis;
        return get().emojis.filter((emoji) => emoji.category === categoryId);
      },
      getRelatedEmojis: (emojiId: string) => {
        const emoji = get().emojis.find(e => e.id === emojiId);
        if (!emoji || !emoji.related) return [];
        return get().emojis.filter(e => emoji.related.includes(e.id));
      },
    }),
    {
      name: 'emoji-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.emojis = state.emojis.map(emoji => ({
            ...emoji,
            createdAt: emoji.createdAt || new Date('2023-01-01T00:00:00Z').getTime(), // Backfill missing createdAt
          }));
        }
      }
    }
  )
);


// Category Store
interface CategoryState {
    categories: EmojiCategory[];
    addCategory: (category: EmojiCategory) => void;
    updateCategory: (category: EmojiCategory) => void;
    deleteCategory: (categoryId: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            categories: initialCategories,
            addCategory: (category) => set((state) => ({ categories: [category, ...state.categories] })),
            updateCategory: (category) => set((state) => ({
                categories: state.categories.map((c) => (c.id === category.id ? category : c)),
            })),
            deleteCategory: (categoryId) => set((state) => ({
                categories: state.categories.filter((c) => c.id !== categoryId),
            })),
        }),
        {
            name: 'category-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);


// Page Store
interface PageState {
    pages: Page[];
    addPage: (page: Page) => void;
    updatePage: (page: Page) => void;
    deletePage: (pageId: string) => void;
}

export const usePageStore = create<PageState>()(
    persist(
        (set) => ({
            pages: initialPages,
            addPage: (page) => set((state) => ({ pages: [page, ...state.pages] })),
            updatePage: (page) => set((state) => ({
                pages: state.pages.map((p) => (p.id === page.id ? page : p)),
            })),
            deletePage: (pageId) => set((state) => ({
                pages: state.pages.filter((p) => p.id !== pageId),
            })),
        }),
        {
            name: 'page-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);


// Footer Store
interface FooterState extends FooterContent {
    updateLink: (section: 'navigation' | 'legal', index: number, link: LinkItem) => void;
    addLink: (section: 'navigation' | 'legal', link: LinkItem) => void;
    removeLink: (section: 'navigation' | 'legal' | 'social', index: number) => void;
    updateSocial: (index: number, link: SocialLink) => void;
    addSocial: (link: SocialLink) => void;
}

export const useFooterStore = create<FooterState>()(
    persist(
        (set) => ({
            ...initialFooterContent,
            updateLink: (section, index, link) => set(state => {
                const newSection = [...state[section]];
                newSection[index] = link;
                return { [section]: newSection };
            }),
            addLink: (section, link) => set(state => ({
                [section]: [...state[section], link]
            })),
            removeLink: (section, index) => set(state => {
                const newSection = [...state[section]];
                newSection.splice(index, 1);
                return { [section]: newSection };
            }),
             updateSocial: (index, link) => set(state => {
                const newSocial = [...state.social];
                newSocial[index] = link;
                return { social: newSocial };
            }),
            addSocial: (link) => set(state => ({
                social: [...state.social, link]
            })),
        }),
        {
            name: 'footer-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
