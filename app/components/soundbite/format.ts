/**
 * Format helpers used across the Soundbite workbench. Kept tiny and dependency
 * free so they can be imported by both server-rendered and client components.
 */

export function formatTimecode(ms: number, opts: { showHours?: boolean } = {}): string {
  const safe = Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const showHours = opts.showHours ?? hours > 0;
  const pad = (value: number) => value.toString().padStart(2, "0");

  return showHours
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Stable colour map for the three Soundbite flag categories. Values resolve to
 * CSS custom properties so configurables overrides apply instantly.
 */
export const FLAG_CATEGORY_TO_VAR: Record<string, string> = {
  emotion_peak: "var(--sb-flag-emotion)",
  topic_shift: "var(--sb-flag-topic)",
  quotable_line: "var(--sb-flag-quote)",
  // Aliases for short configurable IDs
  emotion: "var(--sb-flag-emotion)",
  topic: "var(--sb-flag-topic)",
  quote: "var(--sb-flag-quote)",
};

export function flagColor(categoryId: string | null | undefined): string {
  if (!categoryId) return "var(--sb-accent)";
  return FLAG_CATEGORY_TO_VAR[categoryId] ?? "var(--sb-accent)";
}

export function shortCategoryLabel(categoryId: string | null | undefined): string {
  switch (categoryId) {
    case "emotion_peak":
    case "emotion":
      return "Emotion";
    case "topic_shift":
    case "topic":
      return "Topic";
    case "quotable_line":
    case "quote":
      return "Quote";
    default:
      return "Flag";
  }
}
