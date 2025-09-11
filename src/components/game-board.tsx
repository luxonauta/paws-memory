"use client";

import { useTranslations } from "next-intl";

import { catTypes } from "@/constants/cat-types";
import { useGameStore } from "@/stores/game";

export const GameBoard = () => {
  const { cards, lazyCards, ovenCards, handleCardClick } = useGameStore();
  const tGame = useTranslations("game");
  const tCats = useTranslations("cats");

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card, index) => {
        const isFaceUp = card.flipped || card.matched;
        const cat = catTypes[card.type];

        return (
          <button
            type="button"
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={[
              "flex aspect-square items-center justify-center rounded-md border border-dashed text-lg font-semibold transition-colors duration-200",
              isFaceUp ? `${cat.color}` : "border-slate-200 bg-slate-50 hover:border-slate-400",
              lazyCards.has(card.id) ? "animate-pulse border-slate-400" : "",
              ovenCards.has(card.id) ? "animate-pulse border-slate-400" : ""
            ].join(" ")}
            title={isFaceUp ? tCats(cat.name) : tGame("clickToReveal")}
            aria-label={isFaceUp ? tCats(cat.name) : tGame("clickToReveal")}
          >
            {isFaceUp ? cat.icon : "?!"}
          </button>
        );
      })}
    </div>
  );
};
