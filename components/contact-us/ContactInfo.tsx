import { PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";
import { WhatsAppIcon } from "../ui/icons";
import SocialLinks from "../common/SocialLinks";
import { useTranslations } from "next-intl";

const ContactInfo = () => {
  const t = useTranslations("contact");
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
        <p className="text-gray-600">
          {t("description")}
        </p>
      </div>

      <p className="text-gray-600">
        {t("contact_info")}
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <PhoneIcon className="text-primary size-5" />
          <a
            href="tel:+966543688054"
            target="_blank"
            dir="ltr"
            className="text-gray-600 hover:text-primary"
          >
            201091568240
          </a>{" "}
          -{" "}
          <a
            href="tel:+966543688054"
            target="_blank"
            dir="ltr"
            className="text-gray-600 hover:text-primary"
          >
            201149830855
          </a>
        </div>

        <div className="flex items-center gap-4">
          <MailIcon className="text-primary size-5" />
          <a
            href="mailto:mostasmerapp@gmail.com"
            target="_blank"
            className="text-gray-600 hover:text-primary"
          >
            nationalLibrary@email.com{" "}
          </a>
        </div>

        <div className="flex items-center gap-4">
          <MapPinIcon className="text-primary size-5" />
          <p className="text-gray-600 capitalize">
            {t("address")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <WhatsAppIcon className="text-primary size-5" />
        <a
          href="https://wa.me/201091568240"
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="text-gray-600 hover:text-primary"
        >
          201091568240
        </a>{" "}
        -{" "}
        <a
          href="https://wa.me/201149830855"
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="text-gray-600 hover:text-primary"
        >
          201149830855
        </a>
      </div>

      <SocialLinks darkMode  />
    </div>
  );
};

export default ContactInfo;
