"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSetAtom } from "jotai";
import { initAuthAtom } from "@/atoms/userAtom";
import { useEffect } from "react";

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { refreshUser } = useAuth();
  const initAuth = useSetAtom(initAuthAtom);

  useEffect(() => {
    // Initialize auth state from cookies first
    initAuth();
    
    // Then verify user
    refreshUser();
  }, [initAuth, refreshUser]);

  return children;
}
