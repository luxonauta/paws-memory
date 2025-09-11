"use client";

import { useTranslations } from "next-intl";

import { useGameStore } from "@/stores/game";

import { catTypes } from "../constants/cat-types";

export const PowerSelection = () => {
  const {
    showPowerSelection,
    powerSelectionType,
    matchedPairs,
    usedPowers,
    executeLaserPower,
    executeGentlePawPower,
    closePowerSelection
  } = useGameStore();

  const tCats = useTranslations("cats");
  const tPowers = useTranslations("powers");

  if (!showPowerSelection) return null;

  if (powerSelectionType === "laser") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="grid w-full max-w-md gap-3 rounded-md bg-white p-3">
          <h3 className="text-[.8125rem] font-semibold text-slate-800">🔴 Paws-sible Power: Choose a pair to return</h3>
          <div className="grid gap-1.5">
            {matchedPairs.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => executeLaserPower(type)}
                className={`rounded-md border border-dashed p-3 font-semibold transition-colors duration-200 ${catTypes[type].color}`}
              >
                {catTypes[type].icon} {tCats(catTypes[type].name)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={closePowerSelection}
            className="w-full rounded-md border border-dashed border-indigo-300 bg-indigo-200 p-3 leading-none font-semibold transition-colors duration-200 hover:border-indigo-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (powerSelectionType === "gentle") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="grid w-full max-w-md gap-3 rounded-md bg-white p-3">
          <h3 className="text-[.8125rem] font-semibold text-slate-800">🐾 Re-paws Power: Choose a power to reuse</h3>
          <div className="grid gap-1.5">
            {usedPowers.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => executeGentlePawPower(type)}
                className={`grid justify-start rounded-md border border-dashed p-3 text-left font-semibold transition-colors duration-200 ${catTypes[type].color}`}
              >
                <span>
                  {catTypes[type].icon} {tCats(catTypes[type].name)}
                </span>
                <span>{tPowers(type)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={closePowerSelection}
            className="w-full rounded-md border border-dashed border-indigo-300 bg-indigo-200 p-3 leading-none font-semibold transition-colors duration-200 hover:border-indigo-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
};
