import type { ReactNode } from "react";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

type SoundbiteShellProps = {
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
};

/**
 * Outer Soundbite chrome — a slim top bar with the wordmark and an optional
 * toolbar slot, a flexible content surface, and a quiet footer. The shell
 * intentionally recedes so the content (player, transcript, flags) leads.
 */
export function SoundbiteShell({ children, toolbar, className }: SoundbiteShellProps) {
  const { config, loading } = useConfigurables();
  const appName = loading ? "Soundbite" : config.appName ?? "Soundbite";
  const tagline = config?.tagline ?? "Find the seconds that matter.";
  const footerText =
    config?.footerText ?? "Soundbite — a quiet workbench for interview interrogation.";
  const logoUrl =
    config?.logoUrl && !String(config.logoUrl).startsWith("FILL_") ? config.logoUrl : null;

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        "bg-[var(--sb-bg)] text-[var(--sb-text)]",
        className,
      )}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{
          borderColor: "var(--sb-border-subtle)",
          backgroundColor: "color-mix(in oklab, var(--sb-bg) 88%, transparent)",
        }}
      >
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md"
              style={{
                backgroundColor: "var(--sb-elevated)",
                border: "1px solid var(--sb-border)",
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${appName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <WordmarkGlyph />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-tight">{appName}</p>
              <p
                className="truncate text-[11px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "var(--sb-text-tertiary)" }}
              >
                {tagline}
              </p>
            </div>
          </div>
          {toolbar && (
            <div className="flex items-center gap-2 text-sm">{toolbar}</div>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer
        className="border-t px-5 py-3"
        style={{ borderColor: "var(--sb-border-subtle)" }}
      >
        <p
          className="mx-auto w-full max-w-[1600px] text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: "var(--sb-text-tertiary)" }}
        >
          {footerText}
        </p>
      </footer>
    </div>
  );
}

function WordmarkGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="5" width="2" height="4" rx="1" fill="var(--sb-accent)" />
      <rect x="4" y="3" width="2" height="8" rx="1" fill="var(--sb-flag-quote)" />
      <rect x="7" y="1.5" width="2" height="11" rx="1" fill="var(--sb-accent)" />
      <rect x="10" y="4" width="2" height="6" rx="1" fill="var(--sb-flag-topic)" />
    </svg>
  );
}
