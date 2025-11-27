import { redirect } from 'next/navigation';

export default function RootLayout() {
  // This is a temporary redirect to the default language.
  // In a real app, you might want to detect the user's language
  // and redirect them to the appropriate locale.
  redirect('/en');
}
