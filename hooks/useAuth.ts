import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import {
  clearTokenClient,
  getTokenClient,
  setTokenClient,
} from "@/lib/clientCookie";
import { User } from "@/types/user";
import { setTokenServer } from "@/lib/serverCookie";

// Minimal auth hook with essential functionality only
export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const token = getTokenClient();
  const logout = () => {
    setUser(null);
    clearTokenClient();
  };

  const login = async (newUser: User | null, token: string) => {
    setTokenClient(token);
    setUser(newUser);
    await setTokenServer(token);
  };

  return {
    user,
    token,
    login,
    logout,
  };
};
