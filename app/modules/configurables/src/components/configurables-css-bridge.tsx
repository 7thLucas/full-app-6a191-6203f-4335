import { useEffect } from "react";
import { useConfigurables } from "../hooks/use-configurables";

/**
 * ConfigurablesCSSBridge — Syncs brand/surface/text/flag colors from
 * configurables into CSS custom properties so Tailwind utilities and inline
 * `var(--...)` references reflect the DB-driven config in real time.
 *
 * Mount this INSIDE <ConfigurablesProvider>, but outside <ThemeProvider> so it
 * applies before any themed children paint.
 */
export function ConfigurablesCSSBridge() {
  const { config } = useConfigurables();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    const isValidColor = (v: unknown): v is string =>
      typeof v === "string" && v.length > 0 && !v.startsWith("FILL_");

    // ── Brand ────────────────────────────────────────────────────────────
    const brandColor = config?.brandColor;
    if (brandColor && typeof brandColor === "object") {
      if (isValidColor(brandColor.primary)) {
        root.style.setProperty("--primary", brandColor.primary);
        root.style.setProperty("--ring", brandColor.primary);
        root.style.setProperty("--sidebar-primary", brandColor.primary);
        root.style.setProperty("--sb-accent", brandColor.primary);
      }
      if (isValidColor(brandColor.secondary)) {
        root.style.setProperty("--secondary", brandColor.secondary);
      }
      if (isValidColor(brandColor.accent)) {
        root.style.setProperty("--accent", brandColor.accent);
        root.style.setProperty("--sidebar-accent", brandColor.accent);
      }
    }

    // ── Surface (Soundbite workbench palette) ────────────────────────────
    const surfaceColor = config?.surfaceColor;
    if (surfaceColor && typeof surfaceColor === "object") {
      if (isValidColor(surfaceColor.background)) {
        root.style.setProperty("--sb-bg", surfaceColor.background);
        root.style.setProperty("--background", surfaceColor.background);
      }
      if (isValidColor(surfaceColor.panel)) {
        root.style.setProperty("--sb-panel", surfaceColor.panel);
        root.style.setProperty("--card", surfaceColor.panel);
        root.style.setProperty("--popover", surfaceColor.panel);
      }
      if (isValidColor(surfaceColor.elevated)) {
        root.style.setProperty("--sb-elevated", surfaceColor.elevated);
        root.style.setProperty("--muted", surfaceColor.elevated);
      }
      if (isValidColor(surfaceColor.borderSubtle)) {
        root.style.setProperty("--sb-border-subtle", surfaceColor.borderSubtle);
      }
      if (isValidColor(surfaceColor.borderDefault)) {
        root.style.setProperty("--sb-border", surfaceColor.borderDefault);
        root.style.setProperty("--border", surfaceColor.borderDefault);
        root.style.setProperty("--input", surfaceColor.borderDefault);
      }
    }

    // ── Text ─────────────────────────────────────────────────────────────
    const textColor = config?.textColor;
    if (textColor && typeof textColor === "object") {
      if (isValidColor(textColor.primary)) {
        root.style.setProperty("--sb-text", textColor.primary);
        root.style.setProperty("--foreground", textColor.primary);
        root.style.setProperty("--card-foreground", textColor.primary);
        root.style.setProperty("--popover-foreground", textColor.primary);
      }
      if (isValidColor(textColor.secondary)) {
        root.style.setProperty("--sb-text-secondary", textColor.secondary);
        root.style.setProperty("--muted-foreground", textColor.secondary);
      }
      if (isValidColor(textColor.tertiary)) {
        root.style.setProperty("--sb-text-tertiary", textColor.tertiary);
      }
    }

    // ── Flag colors ──────────────────────────────────────────────────────
    const flagColor = config?.flagColor;
    if (flagColor && typeof flagColor === "object") {
      if (isValidColor(flagColor.emotion)) {
        root.style.setProperty("--sb-flag-emotion", flagColor.emotion);
      }
      if (isValidColor(flagColor.topic)) {
        root.style.setProperty("--sb-flag-topic", flagColor.topic);
      }
      if (isValidColor(flagColor.quote)) {
        root.style.setProperty("--sb-flag-quote", flagColor.quote);
      }
    }
  }, [
    config?.brandColor,
    config?.surfaceColor,
    config?.textColor,
    config?.flagColor,
  ]);

  return null; // renderless component
}
