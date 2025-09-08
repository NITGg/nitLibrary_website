"use client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ErrorEx extends Error {
  status?: number;
  error?: unknown;
}

export async function clientApiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  locale?: string
): Promise<T> {
  // Get locale from document or default to 'en'
  const currentLocale = locale || document.documentElement.lang || "en";

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "accept-language": currentLocale,
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await res.json();
      } catch {
        // If response is not JSON, use default error
        errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
      }

      const errorMessage =
        (errorData.message as string) ||
        (errorData.response &&
        typeof errorData.response === "object" &&
        "data" in errorData.response &&
        typeof errorData.response.data === "object" &&
        errorData.response.data &&
        "message" in errorData.response.data
          ? (errorData.response.data.message as string)
          : undefined) ||
        `HTTP ${res.status}: ${res.statusText}`;

      const error: ErrorEx = {
        name: "APIError",
        message: errorMessage,
        status: res.status,
        error: errorData,
      };
      throw error;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in API fetch:", error);
    throw error;
  }
}
