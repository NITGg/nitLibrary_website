"use client";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OutlineInput } from "@/components/formInputs/OutlineInputs";
import { Button } from "@/components/ui/button";
import ShowPasswordBtn from "@/components/formInputs/ShowPasswordBtn";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { useAuth } from "@/hooks/useAuth";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import { ArrowLeft } from "lucide-react";
import Logo from "@/components/common/Logo";
import { isApiError } from "@/lib/isApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/schemas/auth";

const Register = () => {
  const t = useTranslations("common.register");
  const lang = useLocale();
  const router = useRouter();
  const { login } = useAuth();

  // const [currentStep, setCurrentStep] = useState<"register" | "otp">(
  //   "register"
  // );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [contactInfo, setContactInfo] = useState("");
  // const [registrationToken, setRegistrationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  // const [otpInput, setOtpInput] = useState("");

  const onSubmitRegister = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error(t("error.passwordMismatch"));
      return;
    }
    console.log(data);
    console.log(data.phone);

    try {
      setIsLoading(true);
      const response = await clientApiFetch<{
        message: string;
        token: string;
        id: string;
      }>(
        "/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            password: data.password,
          }),
        },
        lang
      );

      // setContactInfo(data.email || data.phone);
      // setRegistrationToken(response.token);
      // setCurrentStep("otp");
      // toast.success(response.message);
      await login(null, response.token);
      toast.success(response.message);
      router.push("/");
    } catch (error: unknown) {
      console.error("Registration Error:", error);

      toast.error(
        isApiError(error)
          ? error.response.data.message
          : (error as Error).message ?? "حدث خطأ في التسجيل"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const onSubmitOtp = async () => {
  //   try {
  //     setIsLoading(true);

  //     const response = await clientApiFetch<{
  //       message: string;
  //     }>(
  //       "/api/auth/confirm-user",
  //       {
  //         method: "POST",
  //         headers: {
  //           authorization: `Bearer ${registrationToken}`,
  //         },
  //         body: JSON.stringify({
  //           code: otpInput,
  //         }),
  //       },
  //       lang
  //     );

  //     await login(null, registrationToken);
  //     toast.success(response.message);
  //     router.push("/");
  //   } catch (error: unknown) {
  //     console.error("OTP Verification Error:", error);
  //     toast.error(
  //       isApiError(error)
  //         ? error.response.data.message
  //         : (error as Error).message ?? "رمز التفعيل غير صحيح"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleBackToRegister = () => {
  //   setCurrentStep("register");
  //   setOtpInput("");
  // };

  // const handleResendOtp = async () => {
  //   try {
  //     setIsLoading(true);

  //     await clientApiFetch(
  //       `/api/auth/resend-otp`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           phone: contactInfo,
  //         }),
  //       },
  //       lang
  //     );

  //     toast.success("تم إعادة إرسال رمز التفعيل");
  //   } catch (error: unknown) {
  //     console.error("Resend OTP Error:", error);
  //     toast.error(
  //       isApiError(error)
  //         ? error.response.data.message
  //         : (error as Error).message ?? "فشل في إعادة إرسال الرمز"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderRegisterForm = () => (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("welcome_register_big")}</h1>
      <p className="text-gray-600">{t("welcome_register_text")}</p>

      <form
        onSubmit={handleSubmit(onSubmitRegister)}
        className="flex flex-col gap-3 p-2"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <OutlineInput
            id="register-fullname"
            label={t("fullname")}
            {...register("fullname")}
            error={
              errors.fullname?.message ? t(errors.fullname?.message) : undefined
            }
          />

          <OutlineInput
            id="register-phone"
            label={t("phone")}
            type="tel"
            {...register("phone")}
            error={errors.phone?.message ? t(errors.phone?.message) : undefined}
          />
        </div>

        <OutlineInput
          id="register-email"
          label={t("email")}
          type="email"
          {...register("email")}
          error={errors.email?.message ? t(errors.email?.message) : undefined}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <OutlineInput
            id="register-password"
            label={t("password")}
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={
              errors.password?.message ? t(errors.password?.message) : undefined
            }
            iconEnd={{
              child: (
                <ShowPasswordBtn
                  showNewPassword={showPassword}
                  setShowNewPassword={setShowPassword}
                />
              ),
            }}
          />

          <OutlineInput
            id="register-confirmPassword"
            label={t("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            error={
              errors.confirmPassword?.message
                ? t(errors.confirmPassword?.message)
                : undefined
            }
            iconEnd={{
              child: (
                <ShowPasswordBtn
                  showNewPassword={showConfirmPassword}
                  setShowNewPassword={setShowConfirmPassword}
                />
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? t("btn_loading") : t("btn")}
        </Button>
      </form>

      <div className="text-center flex-1">
        <p className="text-gray-600">
          {t("have_account")}{" "}
          <Link
            href="/login"
            className="text-secondary hover:text-secondary/80 font-medium"
          >
            {t("login_link")}
          </Link>
        </p>
      </div>
    </div>
  );

  // const renderOtpForm = () => (
  //   <>
  //     <div className="flex items-center gap-3 mb-3">
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         onClick={handleBackToRegister}
  //         className="shrink-0"
  //       >
  //         <ArrowLeft size={20} />
  //       </Button>
  //       <div>
  //         <h1 className="text-2xl font-bold">{t("otp_title")}</h1>
  //         <p className="text-gray-600">
  //           {t("otp_text")} {contactInfo}
  //         </p>
  //       </div>
  //     </div>

  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         if (otpInput.length === 6) {
  //           onSubmitOtp();
  //         } else {
  //           toast.error(t("error.otpRequired"));
  //         }
  //       }}
  //       className="space-y-6"
  //     >
  //       <div className="space-y-2">
  //         <label htmlFor="otp-input" className="text-sm font-medium">
  //           رمز التفعيل
  //         </label>
  //         <div className="flex justify-center">
  //           <InputOTP
  //             maxLength={6}
  //             value={otpInput}
  //             onChange={(value) => setOtpInput(value)}
  //           >
  //             <InputOTPGroup>
  //               <InputOTPSlot index={0} />
  //               <InputOTPSlot index={1} />
  //               <InputOTPSlot index={2} />
  //               <InputOTPSlot index={3} />
  //               <InputOTPSlot index={4} />
  //               <InputOTPSlot index={5} />
  //             </InputOTPGroup>
  //           </InputOTP>
  //         </div>
  //         {otpInput.length > 0 && otpInput.length < 6 && (
  //           <p className="text-sm text-red-600">{t("error.otpLength")}</p>
  //         )}
  //       </div>

  //       <div className="flex flex-col gap-3">
  //         <Button
  //           type="submit"
  //           className="w-full"
  //           disabled={isLoading || otpInput.length !== 6}
  //         >
  //           {isLoading ? t("verify_loading") : t("verify_btn")}
  //         </Button>

  //         <Button
  //           type="button"
  //           variant="outline"
  //           className="w-full"
  //           onClick={handleResendOtp}
  //           disabled={isLoading}
  //         >
  //           {t("resend_otp")}
  //         </Button>
  //       </div>
  //     </form>
  //   </>
  // );

  const renderContent = () => (
    <div className="bg-white w-full max-w-[447px] rounded-[24px] p-8">
      <div className="flex justify-center relative">
        <Logo className="size-20" />
      </div>

      {renderRegisterForm()}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#241234] flex-center">
      {renderContent()}
    </div>
  );
};

export default Register;
