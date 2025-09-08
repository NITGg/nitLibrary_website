"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LoadingIcon } from "../ui/icons";

export default function SignInWithGoogle() {
  const t = useTranslations("common");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This effect handles the communication from the pop-up window.
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin for security (adjust to match your domain)
      const allowedOrigin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3100";
      
      if (event.origin !== allowedOrigin && !allowedOrigin.includes(event.origin)) {
        console.warn("Received message from unauthorized origin:", event.origin);
        return;
      }
      
      if (
        event.data &&
        event.data.message === "Login successful" &&
        event.data.token
      ) {
        setIsLoading(false);
        login(null, event.data.token);
        toast.success(t("loginSuccess"));
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [login, t]);

  const signInWithGoogle = () => {
    setIsLoading(true);
    const googleLoginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`;
    
    // Open the popup centered in the screen
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const authPopup = window.open(
      googleLoginUrl,
      "authPopup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (authPopup) {
      const checkPopup = setInterval(() => {
        if (authPopup.closed) {
          clearInterval(checkPopup);
          setIsLoading(false);
        }
      }, 1000);
    } else {
      // Popup was blocked
      setIsLoading(false);
      toast.error(t("popupBlocked"));
    }
  };

  return (
    <Button 
      onClick={signInWithGoogle} 
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        {/* SVG paths */}
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {isLoading ? <LoadingIcon className="size-5 animate-spin" /> : t("signInWithGoogle")}
    </Button>
  );
}