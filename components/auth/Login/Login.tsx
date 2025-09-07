"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import ChangeLanguage from "./ChangeLanguage";
import LoginForm from "./LoginForm";
import ForgotPassword from "../ForgotPassword";
import { Link, useRouter } from "@/i18n/navigation";
import SignInWithGoogle from "../signInWithGoogle";

const Login = () => {
  const t = useTranslations("common.login");
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login");
  const router = useRouter();

  const handleShowForgotPassword = () => {
    setCurrentView("forgot");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };


  const renderContent = () => (
    <div
      className="bg-white w-full max-w-[447px] rounded-[24px] p-8 flex flex-col gap-3"
    >
      <div className="flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="library Logo"
          width={120}
          height={40}
          className="object-contain"
          priority
        />
      </div>
      {currentView === "login" ? (
        <>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold">{t("welcome_login_big")}</h1>
            <p className="text-gray-600">{t("welcome_login_text")}</p>
          </div>
          <LoginForm
            onLoginSuccess={() => {
              if (window.history.length > 1) return router.back();
              router.push("/");
            }}
            onForgotPassword={handleShowForgotPassword}
          />
          <div className="text-center">
            <p className="text-gray-600">
              {t("no_account")}{" "}
              <Link
                href="/register"
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                {t("create_account")}
              </Link>
            </p>
          </div>
        </>
      ) : (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      )}
      <ChangeLanguage />
      <SignInWithGoogle />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#241234] flex justify-center items-center">
      {renderContent()}
    </div>
  );
};

export default Login;
