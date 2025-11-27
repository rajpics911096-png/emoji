"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import firebaseConfig from "./config";
import { useUser } from "./use-user";

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const appInstance =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    setApp(appInstance);
    setAuth(getAuth(appInstance));
  }, []);

  if (!app || !auth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Initializing Firebase...</p>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ app, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error("useAuth must be used within a FirebaseProvider");
    }
    return context.auth;
}
