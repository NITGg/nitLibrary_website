"use client";
import { useLocale, useTranslations } from "next-intl";
import ExploreBtns from "./ExploreBtns";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";

export default function Footer() {
  const t = useTranslations("common.footer");
  const locale = useLocale();
  const pathname = usePathname();
  const footerLinks = [
    "categories",
    "teachers",
    "contact",
    "privacy",
    "terms",
  ];

  return (
    <footer className="bg-primary-darker p-container">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 justify-items-center content-center">
        <div className="flex flex-col items-start gap-4">
          <Logo className="size-20" />
          <SocialLinks iconsClassName="text-white" />
        </div>

        <div className="flex flex-col items-start gap-4">
          <h4 className="text-lg font-semibold text-white">
            {t("linksTitle")}
          </h4>
          <div className="flex flex-col gap-2 ps-4">
            {footerLinks.map((link) => (
              <Link
                className={clsx(
                  "hover:text-secondary w-max hover:before:scale-x-100 transition-colors relative text-sm font-semibold text-secondary-foreground",
                  "before:content-[''] before:absolute before:-bottom-1.5 before:right-0 before:w-full before:h-[2px]",
                  "before:bg-secondary before:scale-x-0 before:transition-transform before:duration-300 before:origin-center",
                  pathname === `/${link}` && "!text-secondary before:scale-x-100"
                )}
                key={link}
                href={`/${link}`}
              >
                {t(link)}
              </Link>
            ))}
          </div>
        </div>

          <ExploreBtns className="flex-col w-max justify-center" />
      </div>

      {/* Copyright */}
      <div className="border-t border-white py-6 mt-3 text-center text-sm text-white">
        {t("copyright", { year: new Date().getFullYear().toLocaleString(locale === "ar" ? "ar-EG" : "en-US") })}
        <a
          href="https://www.nitg-eg.com/"
          target="_blank"
          className="underline"
        >
          NIT
        </a>
      </div>
    </footer>
  );
}
