import Cookies from "js-cookie";

const TOKEN_KEY = "token";

// client: set cookie
export function setTokenClient(token: string, expires: number = 360) {
  Cookies.set(TOKEN_KEY, token, { path: "/", expires: expires * 24 * 60 * 60 * 1000 });
}

// client: get cookie
export function getTokenClient(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

// client: clear cookie
export function clearTokenClient() {
  Cookies.remove(TOKEN_KEY);
}
