"use server";

import { cookies } from "next/headers";

export async function setCookie(
  name: string,
  value: string,
  maxAge: number = 60 * 60 * 24
) {
  (await cookies()).set(name, value, { maxAge });
}

export async function getCookie(name: string): Promise<string | null> {
  const cookieStore = (await cookies()).get(name);
  return cookieStore ? cookieStore.value : null;
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}
