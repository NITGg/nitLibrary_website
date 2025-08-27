import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const common = (await import(`./messages/${locale}/common.json`)).default;
  const home = (await import(`./messages/${locale}/home.json`)).default;
  const teachers = (await import(`./messages/${locale}/teachers.json`)).default;
  const categories = (await import(`./messages/${locale}/categories.json`))
    .default;
  const products = (await import(`./messages/${locale}/products.json`)).default;
  const contact = (await import(`./messages/${locale}/contact.json`)).default;
  const privacyPolicy = (
    await import(`./messages/${locale}/privacyPolicy.json`)
  ).default;
  const termsAndConditions = (await import(`./messages/${locale}/terms.json`))
    .default;

  return {
    locale,
    messages: {
      common,
      home,
      teachers,
      categories,
      products,
      contact,
      privacyPolicy,
      termsAndConditions,
    },
  };
});
