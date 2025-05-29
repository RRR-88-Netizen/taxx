
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth as firebaseAuthService, isFirebaseInitialized } from "@/lib/firebase"; // Renamed to avoid conflict

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseEnabled: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseInitialized && firebaseAuthService) {
      const unsubscribe = onAuthStateChanged(firebaseAuthService, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If Firebase is not initialized or auth service is null,
      // there's no auth state to load.
      setLoading(false);
      if (typeof window !== 'undefined' && !isFirebaseInitialized) {
        console.warn("AuthProvider: Firebase is not initialized. User authentication will be unavailable.");
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseEnabled: isFirebaseInitialized && !!firebaseAuthService }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
