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
  const t = await getTranslations({ locale, namespace: "termsAndConditions" });

  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} - مستثمر`,
      description: t("subtitle"),
    },
  };
}

function TermsContent() {
  const t = useTranslations("termsAndConditions");

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

        {/* Section 1: Acceptance of Terms */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            📋 {t("section1.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("section1.content")}
          </p>
        </div>

        {/* Section 2: Personal Accounts */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            👤 {t("section2.title")}
          </h3>
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
          </ul>
        </div>

        {/* Section 3: Reward Points and Point-Back */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🎁 {t("section3.title")}
          </h3>
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
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section3.items.3")}
            </li>
          </ul>
        </div>

        {/* Section 4: Membership Levels */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🏆 {t("section4.title")}
          </h3>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section4.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section4.items.1")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section4.items.2")}
            </li>
          </ul>
        </div>

        {/* Section 5: Payment and Transactions */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            💳 {t("section5.title")}
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

        {/* Section 6: Restrictions and Prohibited Activities */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🚫 {t("section6.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            {t("section6.subtitle")}
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section6.items.0")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section6.items.1")}
            </li>
            <li className="text-gray-600 text-sm sm:text-base lg:text-lg">
              {t("section6.items.2")}
            </li>
          </ul>
        </div>

        {/* Section 7: Terms Modifications */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            🔄 {t("section7.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("section7.content")}
          </p>
        </div>

        {/* Section 8: Limitation of Liability */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
            ⚖️ {t("section8.title")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t("section8.content")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <Hero />
      <TermsContent />
    </>
  );
}
