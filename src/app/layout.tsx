import { redirect } from 'next/navigation';

// This is the root layout of the application.
// It redirects the user to the default language.
export default function RootLayout() {
  redirect('/en');
}
