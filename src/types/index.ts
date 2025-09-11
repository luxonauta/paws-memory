export type I18nMessage = { key: string; values?: Record<string, string | number> };

export interface GameLog {
  turn: number;
  message: I18nMessage;
}

export interface GameCard {
  id: string;
  type: CatKey;
  flipped: boolean;
  matched: boolean;
  position: number;
}

export interface CatVisual {
  name: keyof typeof catsNames;
  icon: string;
  color: string;
}

export type PowerSelectionType = "laser" | "gentle" | null;

/**
 * Names map for translation keys used by cats.
 * This is declared to allow CatVisual.name type-safety in constants.
 */
export const catsNames = {
  "purr-plexer": "purr-plexer",
  "cat-atonic": "cat-atonic",
  "whisk-ers": "whisk-ers",
  "paws-sible": "paws-sible",
  "mew-two": "mew-two",
  "cat-astrophe": "cat-astrophe",
  "purr-omeo": "purr-omeo",
  "lucky-paws": "lucky-paws",
  "paw-some": "paw-some",
  "re-paws": "re-paws"
} as const;

export type CatsNamesKey = keyof typeof catsNames;

/**
 * CatKey is derived from the constant object in constants/cat-types.
 * Declared here to avoid circular imports at compile-time.
 */
export type CatKey = "cucumber" | "lazy" | "baker" | "laser" | "copy" | "death" | "romeo" | "maneki" | "normal" | "gentle";
