import { Metadata } from "next";
import Register from "@/components/auth/register/Register";

export const metadata: Metadata = {
  title: "إنشاء حساب | المكتبة الوطنية",
  description: "إنشاء حساب جديد في المكتبة الوطنية",
};

export default function RegisterModalPage() {
  return <Register type="model" />;
}
