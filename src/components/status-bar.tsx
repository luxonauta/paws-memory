"use client";

import { useTranslations } from "next-intl";

import { totalPairs } from "@/constants/cat-types";
import { useGameStore } from "@/stores/game";

export const StatusBar = () => {
  const { moves, extraMoves, matchedPairs, currentTurn, gameMessage, initializeGame } = useGameStore();
  const t = useTranslations("game");

  return (
    <div className="flex flex-col justify-between gap-1.5 md:flex-row md:items-center">
      <div>
        <h2 className="text-[.8125rem] font-semibold text-slate-800">
          {t("moves")}: {moves + extraMoves} | {t("pairs")}: {matchedPairs.length}/{totalPairs} | {t("turn")}: {currentTurn}
        </h2>
        {gameMessage && <p>{t(gameMessage.key, gameMessage.values)}</p>}
      </div>
      <button
        type="button"
        onClick={initializeGame}
        className="rounded-md border border-dashed border-indigo-300 bg-indigo-200 p-3 leading-none font-semibold transition-colors duration-200 hover:border-indigo-400"
      >
        {t("newGame")}
      </button>
    </div>
  );
};
