export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur', 'id', 'ja', 'pa', 'de', 'jv', 'te', 'vi', 'ko', 'ta', 'mr', 'it', 'tr'],
} as const

export type Locale = (typeof i18n)['locales'][number]
