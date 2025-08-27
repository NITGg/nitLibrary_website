export const setCookie = (name: string, value: string, days: number) => {
  // Only access document on client-side
  if (typeof window === "undefined") {
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};
export const getCookie = (name: string): string | null => {
  // Only access document on client-side
  if (typeof window === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const deleteCookie = (name: string) => {
  // Only access document on client-side
  if (typeof window === "undefined") {
    return;
  }
  setCookie(name, "", -1);
};
