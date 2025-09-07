import {
  validatePhone,
  formatPhoneForApi,
  validatePhoneOrEmail,
} from "@/lib/phoneUtils";
import { z } from "zod";

export const registerSchema = z
  .object({
    fullname: z.string().min(2, "error.fullnameRequired").max(100),
    // Changed max length for phone to accommodate international formats
    phone: z
      .string()
      .min(1, "error.phoneRequired")
      .max(15)
      .refine((value) => {
        const formattedPhone = validatePhone(value);
        return formattedPhone;
      }, "error.invalidPhone")
      .transform((value) => formatPhoneForApi(value)),
    email: z
      .string()
      .min(1, "error.emailRequired")
      .max(100)
      .email("error.invalidEmail"),
    password: z.string().min(6, "error.passwordRequired").max(12),
    confirmPassword: z.string().min(6, "error.confirmPasswordRequired").max(12),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "error.passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "error.emailOrPhoneIsRequired")
    .max(100)
    .refine((value) => {
      return validatePhoneOrEmail(value, {
        invalidFormat: "error.invalidEmailOrPhone",
        invalidEmail: "error.invalidEmail",
        invalidPhone: "error.invalidPhone",
      });
    })
    .transform((value) =>
      value.includes("@") ? value : formatPhoneForApi(value)
    ),
  password: z.string().min(1, "error.passwordIsRequired").min(6, "error.passwordLength").max(12),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
