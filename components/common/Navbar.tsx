"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { clsx } from "clsx";
import { Menu, X, User, LogOut } from "lucide-react";
import { GlobalIcon } from "../ui/icons";
import CartDropdown from "./CartDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname as useNextPathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoutServer from "@/app/actions/logout";
import WishlistDropdown from "./WishlistDropdown";

const links = [
  { href: "/", label: "home" },
  { href: "/categories", label: "categories" },
  { href: "/contact", label: "contact" },
];

const Navbar = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const nextPathname = useNextPathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    logout();
    await logoutServer();
    closeMenu();
  };

  const handleLanguageChange = (newLocale: "en" | "ar") => {
    if (locale === newLocale) {
      closeMenu();
      return;
    }
    // Only check and change if the new locale is different
    const pathWithoutLocale = nextPathname.replace(/^\/[a-z]{2}/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
    closeMenu();
  };

  return (
    <header className="flex items-center justify-between p-4 h-20 sticky top-0 shadow-md bg-primary-darker z-50">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Logo className="w-24 h-16" />
        <ul className="flex items-center gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                className={clsx(
                  "hover:text-secondary hover:before:scale-x-100 transition-colors relative text-lg font-semibold text-secondary-foreground",
                  "before:content-[''] before:absolute before:-bottom-1.5 before:right-0 before:w-full before:h-[2px]",
                  "before:bg-secondary before:scale-x-0 before:transition-transform before:duration-300 before:origin-center",
                  pathname === link.href && "!text-secondary before:scale-x-100"
                )}
                href={link.href}
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Logo */}
      <Logo className="w-20 h-12 md:hidden flex-center" />

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <GlobalIcon className="w-4 h-4" />
              <span>{t("language.current")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleLanguageChange("en")}
              className={locale === "en" ? "bg-primary text-white" : ""}
            >
              {t("language.english")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange("ar")}
              className={locale === "ar" ? "bg-primary text-white" : ""}
            >
              {t("language.arabic")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User size={16} />
                <span className="max-w-[100px] truncate">{user?.fullname}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t("user.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("user.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">{t("loginText")}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t("registerText")}</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <WishlistDropdown />
        <CartDropdown />
        <Button
          variant="ghost"
          size={"icon"}
          onClick={toggleMenu}
          className="md:hidden p-2 text-secondary-foreground hover:text-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "fixed top-20 start-0 end-0 bg-primary-darker shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-[150%]"
        )}
      >
        <nav className="p-4">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={clsx(
                    "block py-2 px-4 rounded-lg transition-colors text-lg font-semibold",
                    pathname === link.href
                      ? "text-secondary bg-secondary/10"
                      : "text-secondary-foreground hover:text-secondary hover:bg-secondary/5"
                  )}
                  href={link.href}
                  onClick={closeMenu}
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-secondary/20">
            {/* Language Dropdown Mobile */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-secondary-foreground px-4">
                {t("language.switch")}
              </span>
              <div className="flex gap-2">
                <Button
                  variant={locale === "en" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("en")}
                  className="flex-1 flex items-center gap-2"
                  size="sm"
                >
                  <GlobalIcon className="w-4 h-4" />
                  {t("language.english")}
                </Button>
                <Button
                  variant={locale === "ar" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("ar")}
                  className="flex-1 flex items-center gap-2"
                  size="sm"
                >
                  <GlobalIcon className="w-4 h-4" />
                  {t("language.arabic")}
                </Button>
              </div>
            </div>

            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-secondary-foreground">
                  <User size={16} />
                  <span className="truncate">{user?.fullname}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("user.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={closeMenu}>
                    {t("loginText")}
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={closeMenu}>
                    {t("registerText")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
