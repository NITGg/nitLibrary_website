import { useAtomValue, useSetAtom } from "jotai";
import {
  userAtom,
  tokenAtom,
  isAuthenticatedAtom,
  logoutUserAtom,
  loginUserAtom,
  verifyUserAtom,
} from "@/atoms/userAtom";
import { useEffect } from "react";

// Minimal auth hook with essential functionality only
export const useAuth = () => {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const logoutUser = useSetAtom(logoutUserAtom);
  const loginUser = useSetAtom(loginUserAtom);
  const verifyUser = useSetAtom(verifyUserAtom);

  // Verify user on mount if token exists but no user
  useEffect(() => {
    if (token && !user) {
      verifyUser();
    }
  }, [token, user, verifyUser]);

  const login = async (newToken: string) => {
    try {
      await loginUser(newToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
  };

  const refreshUser = async () => {
    try {
      await verifyUser();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Don't rethrow here as this is for automatic refresh
      // User will simply not be logged in if verification fails
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };
};

// Simple hook to get just the token
export const useToken = () => {
  return useAtomValue(tokenAtom);
};
