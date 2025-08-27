"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import ChangeLanguage from "./ChangeLanguage";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import { Link, useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Login = ({ type }: { type?: "model" }) => {
  const t = useTranslations("common.login");
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login");
  const [open, setOpen] = useState(type === "model");
  const router = useRouter();

  const handleShowForgotPassword = () => {
    setCurrentView("forgot");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleModalClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && type === "model") {
      // Navigate back to previous page when modal closes
      router.back();
    }
  };

  const renderContent = () => (
    <div
      className={`bg-white w-full max-w-[447px] rounded-[24px] p-8 flex flex-col gap-3 ${
        type === "model" ? "border-0 shadow-none bg-transparent" : ""
      }`}
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
              if (type === "model") {
                handleModalClose(false);
              } else {
                if (window.history.length > 1) return router.back();
                router.push("/");
              }
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
      {type !== "model" && <ChangeLanguage />}
    </div>
  );

  if (type === "model") {
    return (
      <Dialog open={open} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-[500px]">
          <div className="sr-only">
            <DialogTitle>{t("welcome_login_big")}</DialogTitle>
            <DialogDescription>{t("welcome_login_text")}</DialogDescription>
          </div>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#241234] flex justify-center items-center">
      {renderContent()}
    </div>
  );
};

export default Login;
