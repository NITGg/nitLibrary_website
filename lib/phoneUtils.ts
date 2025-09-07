import libphonenumber from "libphonenumber-js";

export function formatPhoneForApi(phone: string): string {
  return phone.startsWith("+2") ? phone : "+2" + phone;
}

export function validatePhone(phone: string): string | boolean {
  const formattedPhone = formatPhoneForApi(phone);
  const phoneNumber = libphonenumber(formattedPhone);
  if (!phoneNumber?.isValid()) return false;
  return formattedPhone;
}

export function validatePhoneOrEmail(
  value: string,
  errorMessages: {
    invalidFormat: string;
    invalidEmail: string;
    invalidPhone: string;
  }
): true | string {
  if (!value || typeof value !== "string") {
    return errorMessages.invalidFormat;
  }

  // Check if it's an email
  if (value.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? true : errorMessages.invalidEmail;
  }

  // Format phone number
  const phone = validatePhone(value);

  // Only validate with libphonenumber if we have a country code
  if (!phone) {
    return errorMessages.invalidPhone;
  }

  return true;
}
