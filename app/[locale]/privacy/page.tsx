import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} - مستثمر`,
      description: t("subtitle"),
    },
  };
}

function PrivacyPolicyContent() {
  const t = useTranslations("privacyPolicy");

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl">
      <div className="grid gap-4 sm:gap-6 text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
          {t("title")}
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Effective Date */}
        <div className="text-center">
          <p className="text-base sm:text-lg font-medium text-gray-700">
            {t("effectiveDate")}
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("welcome")}
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🔐 {t("section1.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            {t("section1.subtitle")}
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section1.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section1.items.1")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section1.items.2")}
            </li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            📋 {t("section2.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            {t("section2.subtitle")}
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section2.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section2.items.1")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section2.items.2")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section2.items.3")}
            </li>
          </ul>
        </div>

        {/* Section 3: Sharing Your Information */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            📤 {t("section3.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            {t("section3.subtitle")}
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section3.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section3.items.1")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section3.items.2")}
            </li>
          </ul>
        </div>

        {/* Section 4: Data Security */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🔒 {t("section4.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("section4.content")}
          </p>
        </div>

        {/* Section 5: Your Rights */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            ⚖️ {t("section5.title")}
          </h3>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section5.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section5.items.1")}
            </li>
          </ul>
        </div>

        {/* Section 6: Policy Updates */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🔄 {t("section6.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("section6.content")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Hero />
      <PrivacyPolicyContent />
    </>
  );
}
