"use server";

import { deleteTokenServer } from "@/lib/serverCookie";

export default async function logout() {
  await deleteTokenServer();
}
