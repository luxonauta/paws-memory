"use client";

import { useTranslations } from "next-intl";

import { catTypes } from "@/constants/cat-types";
import { useGameStore } from "@/stores/game";

type TFn = (k: string, v?: Record<string, string | number>) => string;

type ActionMessage = { key: string; values?: Record<string, unknown> };
type ActionLogItem = { turn: number; message: ActionMessage };

const translateCat = (t: TFn, type: string) => {
  const entry = catTypes[type as keyof typeof catTypes];
  const name = entry?.name ?? type;

  try {
    return t(`cats.${name}`);
  } catch {
    return name;
  }
};

const resolveValues = (t: TFn, values?: Record<string, unknown>): Record<string, string | number> | undefined => {
  if (!values) return undefined;

  const base: Record<string, string | number> = {};

  for (const [k, val] of Object.entries(values)) {
    if (typeof val === "string" || typeof val === "number") base[k] = val;
  }

  const ct = values.catType;
  const ctA = values.catTypeA;
  const ctB = values.catTypeB;

  if (typeof ct === "string") base.cat = translateCat(t, ct);
  if (typeof ctA === "string") base.a = translateCat(t, ctA);
  if (typeof ctB === "string") base.b = translateCat(t, ctB);

  return base;
};

const hash = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return `${h >>> 0}`;
};

const buildLogKey = (log: ActionLogItem) => {
  const payload = JSON.stringify(log.message.values ?? {});
  return `${log.turn}-${log.message.key}-${hash(payload)}`;
};

const groupLatestTurns = (logs: ActionLogItem[], maxTurns: number) => {
  const seen = new Set<number>();
  const selectedTurns: number[] = [];

  for (let i = logs.length - 1; i >= 0; i--) {
    const turn = logs[i].turn;

    if (!seen.has(turn)) {
      seen.add(turn);
      selectedTurns.push(turn);

      if (selectedTurns.length === maxTurns) break;
    }
  }
  return selectedTurns.map((turn) => ({
    turn,
    items: logs.filter((l) => l.turn === turn)
  }));
};

export const ActionLog = () => {
  const t = useTranslations();
  const logs = useGameStore((s) => s.actionLogs) as ActionLogItem[];
  const groups = groupLatestTurns(logs, 5);

  return (
    <div className="grid max-h-32 gap-1.5 overflow-y-auto rounded-md border border-dashed border-slate-200 p-3">
      <h3 className="text-[.8125rem] font-semibold text-slate-800">{t("game.actionLog")}:</h3>
      <ul className="grid gap-3">
        {groups.map((group) => (
          <li key={`turn-${group.turn}`}>
            <span className="mb-1.5 block w-full font-semibold text-slate-800">#{group.turn + 1}</span>
            <ul className="grid list-disc pl-[1.125rem]">
              {group.items.map((log) => (
                <li key={buildLogKey(log)}>{t(log.message.key, resolveValues(t, log.message.values))}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
