"use client";

import { create } from "zustand";

import { catTypes, totalPairs } from "../constants/cat-types";
import { assignPositions, shuffleArray } from "../lib/shuffle";
import type { CatKey, GameCard, GameLog, I18nMessage, PowerSelectionType } from "../types";

interface GameState {
  cards: GameCard[];
  flippedCards: string[];
  matchedPairs: CatKey[];
  moves: number;
  extraMoves: number;
  gameOver: boolean;
  win: boolean;
  currentTurn: number;
  lazyCards: Map<string, number>;
  ovenCards: Map<string, number>;
  romeoTimer: number | null;
  usedPowers: CatKey[];
  showPowerSelection: boolean;
  powerSelectionType: PowerSelectionType;
  gameMessage: I18nMessage | null;
  actionLogs: GameLog[];
  nextCardToOven: boolean;
}

interface GameActions {
  addLog: (message: I18nMessage) => void;
  initializeGame: () => void;
  checkGameEnd: () => void;
  shuffleBoard: () => void;
  handleLaserPower: () => void;
  executeLaserPower: (pairType: CatKey) => void;
  handleGentlePawPower: () => void;
  executeGentlePawPower: (powerType: CatKey) => void;
  activatePower: (cardType: CatKey, cardId: string) => void;
  handleCardClick: (cardIndex: number) => void;
  closePowerSelection: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  cards: [],
  flippedCards: [],
  matchedPairs: [],
  moves: 35,
  extraMoves: 0,
  gameOver: false,
  win: false,
  currentTurn: 1,
  lazyCards: new Map(),
  ovenCards: new Map(),
  romeoTimer: null,
  usedPowers: [],
  showPowerSelection: false,
  powerSelectionType: null,
  gameMessage: null,
  actionLogs: [],
  nextCardToOven: false,

  addLog: (message) => {
    const state = get();
    set({ actionLogs: [...state.actionLogs, { turn: state.currentTurn, message }] });
  },

  initializeGame: () => {
    const types = Object.keys(catTypes) as CatKey[];
    const rawCards: GameCard[] = types.flatMap((type) => [
      { id: `${type}_1`, type, flipped: false, matched: false, position: 0 },
      { id: `${type}_2`, type, flipped: false, matched: false, position: 0 }
    ]);

    const shuffled = assignPositions(shuffleArray(rawCards), (card, index) => ({ ...card, position: index }));

    set({
      cards: shuffled,
      flippedCards: [],
      matchedPairs: [],
      moves: 35,
      extraMoves: 0,
      gameOver: false,
      win: false,
      currentTurn: 1,
      lazyCards: new Map(),
      ovenCards: new Map(),
      romeoTimer: null,
      usedPowers: [],
      nextCardToOven: false,
      gameMessage: { key: "messages.start" },
      actionLogs: [{ turn: 0, message: { key: "logs.gameStarted" } }],
      showPowerSelection: false,
      powerSelectionType: null
    });
  },

  checkGameEnd: () => {
    const state = get();

    if (state.matchedPairs.length === totalPairs) {
      set({ win: true, gameOver: true, gameMessage: { key: "messages.victory" } });
      get().addLog({ key: "logs.victory" });
      return;
    }

    if (state.moves + state.extraMoves <= 0) {
      set({ gameOver: true, gameMessage: { key: "messages.gameOver" } });
      get().addLog({ key: "logs.gameOver" });
    }
  },

  shuffleBoard: () => {
    const state = get();
    const unmatched = state.cards.filter((c) => !c.matched);
    const matched = state.cards.filter((c) => c.matched);

    const shuffledUnmatched = assignPositions(shuffleArray(unmatched), (card, index) => ({ ...card, position: index }));
    const reassembled = [...shuffledUnmatched, ...matched].sort((a, b) => a.position - b.position);

    set({ cards: reassembled });
    get().addLog({ key: "logs.shuffleBoard" });
  },

  handleLaserPower: () => {
    const state = get();

    if (state.matchedPairs.length === 0) {
      set({ gameMessage: { key: "messages.noMatchedToReturn" } });
      get().addLog({ key: "logs.laserNoPairs" });
      return;
    }

    set({ powerSelectionType: "laser", showPowerSelection: true });
  },

  executeLaserPower: (pairType) => {
    const state = get();
    const dematched = state.cards.map((c) => (c.type === pairType ? { ...c, matched: false, flipped: false } : c));

    const returned = dematched.filter((c) => c.type === pairType);
    const others = dematched.filter((c) => c.type !== pairType);

    const total = state.cards.length;
    const occupied = new Set(others.map((c) => c.position));
    const availablePositions: number[] = [];

    for (let i = 0; i < total; i++) if (!occupied.has(i)) availablePositions.push(i);

    const randomized = shuffleArray(availablePositions);
    const relocated = [...others, ...returned.map((c, i) => ({ ...c, position: randomized[i] }))].sort(
      (a, b) => a.position - b.position
    );

    set({
      cards: relocated,
      matchedPairs: state.matchedPairs.filter((p) => p !== pairType),
      showPowerSelection: false,
      powerSelectionType: null
    });

    get().addLog({ key: "logs.laserReturnedPair", values: { catType: pairType } });
  },

  handleGentlePawPower: () => {
    const state = get();

    if (state.usedPowers.length === 0) {
      set({ gameMessage: { key: "messages.noPowersUsedYet" } });
      get().addLog({ key: "logs.gentleNoPowersYet" });
      return;
    }

    set({ powerSelectionType: "gentle", showPowerSelection: true });
  },

  executeGentlePawPower: (powerType) => {
    const api = get();

    switch (powerType) {
      case "cucumber":
        api.shuffleBoard();
        api.addLog({ key: "logs.gentleReactivated.cucumber" });
        break;
      case "death":
        set((s) => ({ extraMoves: s.extraMoves + 7 }));
        api.addLog({ key: "logs.gentleReactivated.death", values: { moves: 7 } });
        break;
      case "maneki":
        set((s) => ({ extraMoves: s.extraMoves + 1 }));
        api.addLog({ key: "logs.gentleReactivated.maneki", values: { moves: 1 } });
        break;
      case "laser":
        api.handleLaserPower();
        api.addLog({ key: "logs.gentleReactivated.laser" });
        return;
      case "baker":
        set({ nextCardToOven: true });
        api.addLog({ key: "logs.gentleReactivated.baker" });
        break;
      default:
        set({ gameMessage: { key: "messages.powerCannotBeReused" } });
        api.addLog({ key: "logs.gentleCannotReactivate", values: { catType: powerType } });
        return;
    }

    set({ showPowerSelection: false, powerSelectionType: null });
  },

  activatePower: (cardType, cardId) => {
    const state = get();
    const api = get();

    switch (cardType) {
      case "cucumber":
        if (!state.usedPowers.includes(cardType)) {
          api.shuffleBoard();
          set({ usedPowers: [...state.usedPowers, cardType] });
        }
        break;

      case "baker":
        if (!state.usedPowers.includes(cardType)) {
          set({ nextCardToOven: true, usedPowers: [...state.usedPowers, cardType] });
          api.addLog({ key: "logs.whiskersNextCardOven" });
        }
        break;

      case "laser":
        if (!state.usedPowers.includes(cardType)) {
          api.handleLaserPower();
          set({ usedPowers: [...state.usedPowers, cardType] });
        }
        break;

      case "death":
        if (!state.usedPowers.includes(cardType)) {
          set({ extraMoves: state.extraMoves + 7, usedPowers: [...state.usedPowers, cardType] });
          api.addLog({ key: "logs.catastropheExtraMoves", values: { moves: 7 } });
        }
        break;

      case "maneki":
        if (!state.usedPowers.includes(cardType)) {
          set({ extraMoves: state.extraMoves + 1, usedPowers: [...state.usedPowers, cardType] });
          api.addLog({ key: "logs.luckyPawsExtraMove", values: { moves: 1 } });
        }
        break;

      case "gentle":
        if (!state.usedPowers.includes(cardType)) {
          api.handleGentlePawPower();
          set({ usedPowers: [...state.usedPowers, cardType] });
        }
        break;

      case "copy": {
        const twoFlipped = state.flippedCards.length === 2;
        if (!twoFlipped) break;

        const otherId = state.flippedCards.find((id) => id !== cardId);
        const other = state.cards.find((c) => c.id === otherId);

        if (other && other.type !== "copy" && other.type !== "normal") {
          api.activatePower(other.type, other.id);
          api.addLog({ key: "logs.copy.copied", values: { catType: other.type } });
        } else {
          api.addLog({ key: "logs.copy.nothing" });
        }

        break;
      }
      default:
        break;
    }
  },

  handleCardClick: (cardIndex) => {
    const state = get();
    const api = get();

    if (state.gameOver || state.flippedCards.length >= 2) return;

    const card = state.cards[cardIndex];
    if (card.flipped || card.matched) return;

    if (state.lazyCards.has(card.id)) {
      const attempts = state.lazyCards.get(card.id) || 0;

      if (attempts < 2) {
        const map = new Map(state.lazyCards);
        map.set(card.id, attempts + 1);
        set({ lazyCards: map });
        api.addLog({ key: "logs.lazy.sleepingAttempt", values: { attempt: attempts + 1, max: 2 } });
        return;
      }

      const map = new Map(state.lazyCards);
      map.delete(card.id);
      set({ lazyCards: map });
      api.addLog({ key: "logs.lazy.wokeUp" });
    }

    if (state.ovenCards.has(card.id)) {
      const turnsLeft = state.ovenCards.get(card.id) || 0;

      if (turnsLeft > 0) {
        api.addLog({ key: "logs.oven.stillBaking", values: { turnsLeft } });
        return;
      }

      const ovenMap = new Map(state.ovenCards);
      ovenMap.delete(card.id);
      set({ ovenCards: ovenMap });
      api.addLog({ key: "logs.oven.ready" });
    }

    if (card.type === "lazy" && !state.lazyCards.has(card.id)) {
      const map = new Map(state.lazyCards);
      map.set(card.id, 1);
      set({ lazyCards: map });
      api.addLog({ key: "logs.lazy.needsAnotherAttempt" });
      return;
    }

    if (state.nextCardToOven && !state.ovenCards.has(card.id)) {
      const ovenMap = new Map(state.ovenCards);
      ovenMap.set(card.id, 2);
      set({ ovenCards: ovenMap, nextCardToOven: false });
      api.addLog({ key: "logs.oven.sent" });
      return;
    }

    const newFlipped = [...state.flippedCards, card.id];
    const updatedCards = state.cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));

    set({ flippedCards: newFlipped, cards: updatedCards });
    api.addLog({ key: "logs.revealed", values: { catType: card.type } });

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const current = get();
        const [aId, bId] = newFlipped;
        const a = current.cards.find((c) => c.id === aId);
        const b = current.cards.find((c) => c.id === bId);
        if (!a || !b) return;

        if (a.type === b.type) {
          const allMatched = current.cards.map((c) => (c.type === a.type ? { ...c, matched: true } : c));
          set({ cards: allMatched, matchedPairs: [...current.matchedPairs, a.type] });
          api.addLog({ key: "logs.foundPair", values: { catType: a.type } });
          api.activatePower(a.type, a.id);

          if (a.type === "romeo") {
            set({ romeoTimer: null });
            api.addLog({ key: "logs.romeo.pairFound" });
          }
        } else {
          const turnedDown = current.cards.map((c) => (newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          set({ cards: turnedDown });
          api.addLog({ key: "logs.mismatch", values: { catTypeA: a.type, catTypeB: b.type } });

          if (a.type === "copy") api.activatePower("copy", a.id);
          if (b.type === "copy") api.activatePower("copy", b.id);

          if (a.type === "romeo" || b.type === "romeo") {
            if (current.romeoTimer === null) {
              set({ romeoTimer: current.currentTurn });
              api.addLog({ key: "logs.romeo.revealed" });
            } else {
              const withoutRomeo = current.cards.filter((c) => c.type !== "romeo");
              set({ cards: withoutRomeo, romeoTimer: null });
              api.addLog({ key: "logs.romeo.left" });
            }
          }
        }

        set((prev) => ({
          flippedCards: [],
          moves: prev.moves - 1,
          currentTurn: prev.currentTurn + 1
        }));

        set((prev) => {
          const next = new Map<string, number>();
          for (const [id, t] of prev.ovenCards) if (t > 1) next.set(id, t - 1);
          return { ovenCards: next };
        });

        api.checkGameEnd();
      }, 1200);
    }
  },

  closePowerSelection: () => set({ showPowerSelection: false, powerSelectionType: null })
}));
