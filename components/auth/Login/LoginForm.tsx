"use client";
import { OutlineInput } from "@/components/formInputs/OutlineInputs";
import ShowPasswordBtn from "@/components/formInputs/ShowPasswordBtn";
import { Button } from "@/components/ui/button";
import { LoadingIcon, PasswordIcon, PhoneIcon } from "@/components/ui/icons";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { isApiError } from "@/lib/isApiError";
import { LoginFormValues, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const t = useTranslations("common.login");
  const onSubmit = async (formData: LoginFormValues) => {
    try {
      setLoading(true);
      const data = await clientApiFetch<{
        token: string;
        message: string;
      }>(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          phone: !formData.phone.includes("@") && formData.phone,
          email: formData.phone.includes("@") && formData.phone,
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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <OutlineInput
        id="login-phone"
        {...register("phone")}
        label={t("emailOrPhone")}
        error={errors.phone?.message ? t(errors.phone?.message) : undefined}
        iconStart={<PhoneIcon />}
      />
      <OutlineInput
        id="login-password"
        {...register("password")}
        error={
          errors.password?.message ? t(errors.password?.message) : undefined
        }
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
