// This is the root layout of the application.
// It immediately renders its children, which will be the language-specific layouts.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
