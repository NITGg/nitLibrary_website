import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

const ExploreBtns = ({ className }: { className?: string }) => {
  const t = useTranslations("home");

  return (
    <div className={`flex gap-4 ${className || ""}`}>
      <Button variant="outline" className="rounded-lg">{t("hero.explore")}</Button>
      <Button className="rounded-lg">{t("hero.orderNow")}</Button>
    </div>
  );
};

export default ExploreBtns;
