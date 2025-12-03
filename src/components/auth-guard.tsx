
"use client";

import { useUser } from "@/firebase/use-user";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      notFound();
    }
  }, [user, loading]);

  if (loading || !user) {
    // Return a loading state or null while checking auth, before notFound() is triggered
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
