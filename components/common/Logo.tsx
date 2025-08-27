import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const Logo = ({ className = "flex-shrink-0" }: { className?: string }) => {
  const t = useTranslations("common");
  return (
    <div className={className}>
      <Link
        href="/"
        className="flex items-center gap-2 size-full relative"
      >
        <Image className="hover:scale-95 transition-transform ease-in-out duration-200" src="/images/logo.svg" alt={t("logoAlt")} priority fill />
      </Link>
    </div>
  );
};

export default Logo;
