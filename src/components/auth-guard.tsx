
"use client";

import { useUser } from "@/firebase/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "@/context/translations-context";
import { useAuth } from "@/firebase/provider";

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
