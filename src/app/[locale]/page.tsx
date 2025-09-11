import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { MemoryGame } from "@/components/game";

const HomePage = ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("game");

  return (
    <main className="mx-auto mt-12 grid w-full gap-3 px-3 py-6 md:max-w-xl">
      <div>
        <h1 className="text-[.8125rem] font-semibold text-slate-800">PawsMemory</h1>
        <p>{t("subtitle")}</p>
      </div>
      <MemoryGame />
    </main>
  );
};

export default HomePage;
