import { atom } from "jotai";
import { User } from "@/types/user";
import { deleteCookie, getCookie, setCookie } from "@/lib/handelCookie";
import { clientApiFetch } from "@/lib/clientApiFetch";

// User atom in memory only (no localStorage, no token storage)
export const userAtom = atom<User | null>(null);

// Internal token state atom (in memory)
const _tokenAtom = atom<string | null>(null);

// Atom to track cookie sync
const _cookieSyncAtom = atom<number>(0);

// Public token atom that syncs with cookies and internal state
export const tokenAtom = atom<string | null, [string | null], void>(
  (get) => {
    // Trigger recomputation when cookie sync changes
    get(_cookieSyncAtom);
    
    // First check internal state
    const internalToken = get(_tokenAtom);
    if (internalToken) {
      return internalToken;
    }
    
    // Fall back to cookies on client-side
    if (typeof window !== 'undefined') {
      const cookieToken = getCookie("token");
      if (cookieToken && cookieToken !== internalToken) {
        // Sync internal state with cookie (but don't set here to avoid loops)
        return cookieToken;
      }
    }
    
    return null;
  },
  (get, set, newToken) => {
    // Update internal state
    set(_tokenAtom, newToken);
    
    // Update cookie on client-side
    if (typeof window !== 'undefined') {
      if (newToken) {
        setCookie("token", newToken, 360);
      } else {
        deleteCookie("token");
      }
    }
    
    // Trigger sync update
    set(_cookieSyncAtom, (prev) => prev + 1);
  }
);

// Derived atom to check if user is authenticated
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  const token = get(tokenAtom);
  return Boolean(user && token);
});

// Action atom to verify user with token from cookies
export const verifyUserAtom = atom(null, async (get, set) => {
  const token = get(tokenAtom);

  if (!token) {
    set(userAtom, null);
    return null;
  }

  try {
    const userData = await clientApiFetch<{ user: User }>("/api/verify-me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    set(userAtom, userData.user);
    return userData.user;
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear invalid token
    set(userAtom, null);
    set(tokenAtom, null);
    return null;
  }
});

// Action atom to login user (sets token and automatically verifies)
export const loginUserAtom = atom(
  null,
  async (get, set, token: string) => {
    try {
      // Set the token (this will trigger cookie update)
      set(tokenAtom, token);
      
      // Automatically verify user with the new token
      const user = await set(verifyUserAtom);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      // Clear token if verification fails
      set(tokenAtom, null);
      throw error;
    }
  }
);

// Action atom to logout user
export const logoutUserAtom = atom(null, (get, set) => {
  set(userAtom, null);
  set(tokenAtom, null); // This will automatically clear the cookie
});

// Initialization atom to sync token from cookies on app start
export const initAuthAtom = atom(null, (get, set) => {
  if (typeof window !== 'undefined') {
    const cookieToken = getCookie("token");
    if (cookieToken) {
      // Set internal token from cookie
      set(_tokenAtom, cookieToken);
      // Force token atom to recompute
      set(_cookieSyncAtom, (prev) => prev + 1);
    }
  }
});
