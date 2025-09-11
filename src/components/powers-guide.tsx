"use client";

import { useTranslations } from "next-intl";

import { catTypes } from "@/constants/cat-types";

export const PowersGuide = () => {
  const tGame = useTranslations("game");
  const tCats = useTranslations("cats");
  const tPowers = useTranslations("powers");

  return (
    <div className="grid gap-3 overflow-hidden rounded-md border border-dashed border-slate-200">
      <h4 className="px-3 pt-3 text-[.8125rem] font-semibold text-slate-800">{tGame("powersGuide")}:</h4>
      <div className="grid">
        {Object.entries(catTypes).map(([type, data]) => (
          <div
            key={type}
            className="flex items-center gap-3 border-y border-dashed border-transparent p-2 transition-colors duration-200 last:border-b-0 hover:border-slate-200 hover:bg-slate-50"
          >
            <span
              className={`rounded border border-dashed px-3 py-1 font-semibold transition-colors duration-200 ${data.color} flex-shrink-0`}
            >
              {data.icon} {tCats(data.name)}
            </span>
            <span className="text-gray-800">{tPowers(type)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
