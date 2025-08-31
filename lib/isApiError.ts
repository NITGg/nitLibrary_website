type ApiErrorResponse = {
  message?: string;
};

export function isApiError(error: unknown): error is { response: { data: ApiErrorResponse } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response: { data: ApiErrorResponse } }).response?.data === "object"
  );
}
