import type { CatVisual } from "@/types";

/**
 * Visual constants for each cat type (icon and Tailwind color classes).
 */
export const catTypes: Record<
  "cucumber" | "lazy" | "baker" | "laser" | "copy" | "death" | "romeo" | "maneki" | "normal" | "gentle",
  CatVisual
> = {
  cucumber: { name: "purr-plexer", icon: "🥒", color: "border-green-200 bg-green-50 hover:border-green-400" },
  lazy: { name: "cat-atonic", icon: "😴", color: "border-blue-200 bg-blue-50 hover:border-blue-400" },
  baker: { name: "whisk-ers", icon: "👨‍🍳", color: "border-orange-200 bg-orange-50 hover:border-orange-400" },
  laser: { name: "paws-sible", icon: "🔴", color: "border-red-200 bg-red-50 hover:border-red-400" },
  copy: { name: "mew-two", icon: "📋", color: "border-purple-200 bg-purple-50 hover:border-purple-400" },
  death: { name: "cat-astrophe", icon: "💀", color: "border-slate-200 bg-slate-50 hover:border-slate-400" },
  romeo: { name: "purr-omeo", icon: "💕", color: "border-pink-200 bg-pink-100 hover:border-pink-400" },
  maneki: { name: "lucky-paws", icon: "🐱", color: "border-yellow-200 bg-yellow-100 hover:border-yellow-400" },
  normal: { name: "paw-some", icon: "😸", color: "border-indigo-200 bg-indigo-100 hover:border-indigo-400" },
  gentle: { name: "re-paws", icon: "🐾", color: "border-teal-200 bg-teal-100 hover:border-teal-400" }
};

export const totalPairs = Object.keys(catTypes).length;
