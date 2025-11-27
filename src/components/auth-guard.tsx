"use client";

import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "@/context/translations-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const { language } = useTranslations();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${language}/login`);
    }
  }, [user, loading, router, language]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
