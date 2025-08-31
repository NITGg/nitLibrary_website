"use client";
import { OutlineInput } from "@/components/formInputs/OutlineInputs";
import ShowPasswordBtn from "@/components/formInputs/ShowPasswordBtn";
import { Button } from "@/components/ui/button";
import { LoadingIcon, PasswordIcon, PhoneIcon } from "@/components/ui/icons";
import { clientApiFetch } from "@/lib/clientApiFetch";
import libphonenumber from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { isApiError } from "@/lib/isApiError";

interface LoginFormProps {
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onLoginSuccess,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const t = useTranslations("common.login");
  const onSubmit = async (formData: { password: string; phone: string }) => {
    try {
      setLoading(true);

      // Format phone number for Saudi numbers
      let formattedPhone = formData.phone;
      if (formData.phone.startsWith("05")) {
        formattedPhone = formData.phone.substring(1); // Remove leading 0 for Saudi numbers
      }

      const data = await clientApiFetch<{
        token: string;
        message: string;
      }>(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          phone: formattedPhone,
          password: formData.password,
        }),
      });
      await login(null, data.token);
      toast.success(data.message);
      onLoginSuccess();
    } catch (error: unknown) {
      console.error("Login Error:", error);
      toast.error(
        isApiError(error)
          ? error.response.data.message
          : (error as Error).message ?? "There is an Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const [callCode, setCallCode] = useState("");
  const phone = watch("phone");

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };
  useEffect(() => {
    if (
      phone.startsWith("010") ||
      phone.startsWith("011") ||
      phone.startsWith("012") ||
      phone.startsWith("015")
    ) {
      setCallCode("+2");
    } else if (phone.startsWith("05") || phone.startsWith("5")) {
      setCallCode("+966");
    }
  }, [phone]);
  const validatePhone = (phone: string | boolean): true | string => {
    if (typeof phone !== "string") {
      return t("error.invalidPhoneFormat");
    }

    if (phone.includes("@")) {
      return isValidEmail(phone) ? true : t("error.invalidEmail");
    }

    // Format Saudi phone numbers: remove leading 0 if starts with 05
    let formattedPhone = phone;
    if (phone.startsWith("05")) {
      formattedPhone = phone.substring(1); // Remove the leading 0
    }

    if (!libphonenumber(`${callCode}${formattedPhone}`)?.isValid()) {
      return t("error.invalidPhone");
    }

    return true;
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <OutlineInput
        id="login-phone"
        {...register("phone", {
          required: t("error.emailOrPhoneIsRequired"),
          validate: validatePhone,
        })}
        label={t("emailOrPhone")}
        error={errors.phone?.message}
        iconStart={<PhoneIcon />}
      />
      <OutlineInput
        id="login-password"
        {...register("password", {
          required: t("error.passwordIsRequired"),
          minLength: { value: 6, message: t("error.passwordLength") },
        })}
        error={errors.password?.message}
        iconStart={<PasswordIcon />}
        label={t("password")}
        type={showPassword ? "text" : "password"}
        iconEnd={{
          child: (
            <ShowPasswordBtn
              showNewPassword={showPassword}
              setShowNewPassword={setShowPassword}
            />
          ),
        }}
      />
      {/* Forgot Password Link */}{" "}
      <div className="text-center">
        <Button
          variant={"link"}
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-secondary hover:text-secondary/80 transition-colors"
        >
          {t("forgotPassword")}
        </Button>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <LoadingIcon className="size-5 animate-spin" /> : t("btn")}
      </Button>
    </form>
  );
};

export default LoginForm;
