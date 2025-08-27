import { Metadata } from "next";
import Login from "@/components/auth/Login/Login";

export const metadata: Metadata = {
  title: "تسجيل الدخول | المكتبة الوطنية",
  description: "تسجيل الدخول إلى حسابك في المكتبة الوطنية",
};

export default function LoginPage() {
  return <Login type="model" />;
}
