"use server";
import { cookies } from "next/headers"; // server

const TOKEN_KEY = "token";

// server: get cookie
export async function getTokenServer(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_KEY)?.value;
}
export async function setTokenServer(token: string, maxAge: number = 360) {
  (await cookies()).set(TOKEN_KEY, token, { maxAge });
}
export async function deleteTokenServer() {
  return (await cookies()).delete(TOKEN_KEY);
}
