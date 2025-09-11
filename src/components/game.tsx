"use client";

import { useEffect } from "react";

import { useGameStore } from "@/stores/game";

import { ActionLog } from "./action-log";
import { GameBoard } from "./game-board";
import { PowerSelection } from "./power-selection";
import { PowersGuide } from "./powers-guide";
import { StatusBar } from "./status-bar";

export const MemoryGame = () => {
  useEffect(() => {
    useGameStore.getState().initializeGame();
  }, []);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prev) => {
      const moved = state.moves !== prev.moves || state.extraMoves !== prev.extraMoves;
      const matched = state.matchedPairs.length !== prev.matchedPairs.length;

      if (moved || matched) {
        useGameStore.getState().checkGameEnd();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="grid w-full gap-3 rounded-md border border-dashed border-slate-200 p-3">
      <StatusBar />
      <GameBoard />
      <ActionLog />
      <PowersGuide />
      <PowerSelection />
    </div>
  );
};
