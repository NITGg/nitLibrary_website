import Cookies from "js-cookie";

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
