// lib/authCookies.ts
import { cookies } from "next/headers"; // server
    import Cookies from 'js-cookie';


const TOKEN_KEY = "token";

// client: set cookie
export function setTokenClient(token: string) {
  Cookies.set(TOKEN_KEY, token, { path: "/" });
}

// client: get cookie
export function getTokenClient(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

// client: clear cookie
export function clearTokenClient() {
  Cookies.remove(TOKEN_KEY);
}

// server: get cookie
export async function getTokenServer(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_KEY)?.value;
}
export async function setTokenServer(token: string, maxAge: number) {
  (await cookies()).set(TOKEN_KEY, token, { maxAge });
}
export async function deleteTokenServer(){
  return (await cookies()).delete(TOKEN_KEY);
}




