import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Quote, Waves } from "lucide-react";
import { useTranscriptionResultContext } from "@qb/audio-analyzer";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";
import { flagColor, formatTimecode, shortCategoryLabel } from "./format";
import { deriveDurationMs, deriveFlags, type FlagKind, type SoundbiteFlag } from "./derive-flags";

type FlaggedTimelineProps = {
  className?: string;
};

const KIND_ORDER: FlagKind[] = ["emotion", "topic", "quote", "other"];

function FlagIcon({ kind, size = 12 }: { kind: FlagKind; size?: number }) {
  if (kind === "emotion") return <Heart size={size} strokeWidth={1.75} />;
  if (kind === "topic") return <Waves size={size} strokeWidth={1.75} />;
  if (kind === "quote") return <Quote size={size} strokeWidth={1.75} />;
  return <Heart size={size} strokeWidth={1.75} />;
}

export function FlaggedTimeline({ className }: FlaggedTimelineProps) {
  const { result, seekToTimestamp, activeTimestampMs, primaryMediaRef } =
    useTranscriptionResultContext();
  const { config } = useConfigurables();
  const workbench = config?.workbenchCopy;

  const [mediaDurationMs, setMediaDurationMs] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Track media duration so the timeline scales correctly even before analysis
  // finishes.
  useEffect(() => {
    const media = primaryMediaRef.current;
    if (!media) return;

    const sync = () => {
      if (Number.isFinite(media.duration)) {
        setMediaDurationMs(media.duration * 1000);
      }
    };

    media.addEventListener("loadedmetadata", sync);
    media.addEventListener("durationchange", sync);
    if (media.readyState >= 1) sync();

    return () => {
      media.removeEventListener("loadedmetadata", sync);
      media.removeEventListener("durationchange", sync);
    };
  }, [primaryMediaRef, result?.video_urls, result?.audio_urls]);

  const flags = useMemo(() => deriveFlags(result), [result]);
  const totalMs = useMemo(
    () => deriveDurationMs(result, mediaDurationMs),
    [result, mediaDurationMs],
  );

  // Group / count by kind for legend
  const byKind = useMemo(() => {
    const map = new Map<FlagKind, SoundbiteFlag[]>();
    for (const flag of flags) {
      const list = map.get(flag.kind) ?? [];
      list.push(flag);
      map.set(flag.kind, list);
    }
    return map;
  }, [flags]);

  const playheadPct =
    totalMs > 0 && activeTimestampMs !== null
      ? Math.min(100, Math.max(0, (activeTimestampMs / totalMs) * 100))
      : null;

  const title = workbench?.timelineTitle ?? "Flagged moments";
  const hint = workbench?.timelineHint ?? "Click a flag to jump the player there.";
  const emptyMsg = workbench?.emptyFlags ?? "Flagged moments will appear as analysis finishes.";

  return (
    <section
      className={cn("flex h-full flex-col rounded-xl", className)}
      style={{
        backgroundColor: "var(--sb-panel)",
        border: "1px solid var(--sb-border-subtle)",
      }}
    >
      <header
        className="flex items-baseline justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--sb-border-subtle)" }}
      >
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          <p
            className="mt-1 truncate text-[12px]"
            style={{ color: "var(--sb-text-secondary)" }}
          >
            {hint}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px]"
          style={{
            backgroundColor: "var(--sb-elevated)",
            color: "var(--sb-text-secondary)",
            border: "1px solid var(--sb-border-subtle)",
          }}
        >
          {flags.length} flag{flags.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="flex items-center gap-3 px-4 pt-3">
        {KIND_ORDER.filter((kind) => kind !== "other").map((kind) => {
          const count = byKind.get(kind)?.length ?? 0;
          const color = flagColor(kind);
          return (
            <div key={kind} className="flex items-center gap-1.5">
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
                  color,
                }}
              >
                <FlagIcon kind={kind} size={9} />
              </span>
              <span
                className="text-[11px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "var(--sb-text-secondary)" }}
              >
                {shortCategoryLabel(kind === "emotion" ? "emotion_peak" : kind === "topic" ? "topic_shift" : "quotable_line")}{" "}
                <span
                  className="font-mono tabular-nums"
                  style={{ color: "var(--sb-text-tertiary)" }}
                >
                  {count}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="px-4 pt-4">
        <div
          ref={railRef}
          className="relative h-16 rounded-md"
          style={{
            backgroundColor: "var(--sb-elevated)",
            border: "1px solid var(--sb-border-subtle)",
          }}
        >
          {/* Lane separators */}
          <div className="pointer-events-none absolute inset-0 grid grid-rows-3">
            <div
              className="border-b"
              style={{ borderColor: "var(--sb-border-subtle)" }}
            />
            <div
              className="border-b"
              style={{ borderColor: "var(--sb-border-subtle)" }}
            />
            <div />
          </div>

          {/* Lane labels */}
          <div
            className="pointer-events-none absolute left-2 top-0 grid h-full grid-rows-3 font-mono text-[9px] uppercase tracking-[0.08em]"
            style={{ color: "var(--sb-text-tertiary)" }}
          >
            <span className="row-start-1 self-center">EMO</span>
            <span className="row-start-2 self-center">TOP</span>
            <span className="row-start-3 self-center">QTE</span>
          </div>

          {/* Playhead */}
          {playheadPct !== null && (
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 h-full"
              style={{
                left: `${playheadPct}%`,
                width: 2,
                backgroundColor: "var(--sb-accent)",
                boxShadow: "0 0 0 1px color-mix(in oklab, var(--sb-accent) 25%, transparent)",
              }}
            />
          )}

          {/* Flag markers */}
          {totalMs > 0 ? (
            flags.map((flag) => {
              const left = Math.min(99.5, Math.max(0, (flag.startMs / totalMs) * 100));
              const row = flag.kind === "emotion" ? 0 : flag.kind === "topic" ? 1 : 2;
              const color = flagColor(flag.kind);
              const active =
                activeTimestampMs !== null &&
                activeTimestampMs >= flag.startMs &&
                activeTimestampMs <= Math.max(flag.endMs, flag.startMs + 500);

              return (
                <button
                  key={flag.id}
                  type="button"
                  onClick={() => seekToTimestamp(flag.startMs)}
                  className="absolute inline-flex -translate-x-1/2 items-center justify-center rounded-full transition-transform hover:scale-110"
                  style={{
                    left: `${left}%`,
                    top: `${row * 33.33 + 16.66}%`,
                    transform: `translate(-50%, -50%) scale(${active ? 1.2 : 1})`,
                    width: 14,
                    height: 14,
                    backgroundColor: `color-mix(in oklab, ${color} 90%, transparent)`,
                    boxShadow: active
                      ? `0 0 0 3px color-mix(in oklab, ${color} 35%, transparent)`
                      : "0 1px 2px rgba(0,0,0,0.4)",
                  }}
                  title={`${shortCategoryLabel(flag.categoryId)} — ${formatTimecode(flag.startMs)}`}
                  aria-label={`Jump to ${shortCategoryLabel(flag.categoryId)} at ${formatTimecode(flag.startMs)}: ${flag.description}`}
                >
                  <span className="sr-only">{flag.description}</span>
                </button>
              );
            })
          ) : null}
        </div>

        <div
          className="mt-1.5 flex items-center justify-between px-1 font-mono text-[10px]"
          style={{ color: "var(--sb-text-tertiary)" }}
        >
          <span>{formatTimecode(0)}</span>
          <span>{totalMs > 0 ? formatTimecode(totalMs) : "—"}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 pt-3">
        <FlagList flags={flags} emptyMsg={emptyMsg} />
      </div>
    </section>
  );
}

function FlagList({
  flags,
  emptyMsg,
}: {
  flags: SoundbiteFlag[];
  emptyMsg: string;
}) {
  const { seekToTimestamp, activeTimestampMs } = useTranscriptionResultContext();

  if (flags.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-8">
        <p
          className="text-center text-[13px]"
          style={{ color: "var(--sb-text-tertiary)" }}
        >
          {emptyMsg}
        </p>
      </div>
    );
  }

  return (
    <div className="sb-scroll flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {flags.map((flag) => {
        const color = flagColor(flag.kind);
        const active =
          activeTimestampMs !== null &&
          activeTimestampMs >= flag.startMs &&
          activeTimestampMs <= Math.max(flag.endMs, flag.startMs + 500);
        return (
          <button
            key={flag.id}
            type="button"
            onClick={() => seekToTimestamp(flag.startMs)}
            className="group w-full rounded-md px-3 py-2 text-left transition-colors"
            style={{
              backgroundColor: active ? "var(--sb-elevated)" : "transparent",
              border: `1px solid ${active ? "var(--sb-border)" : "transparent"}`,
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = "var(--sb-elevated)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
                style={{
                  backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
                  color,
                }}
              >
                <FlagIcon kind={flag.kind} size={10} />
                {shortCategoryLabel(flag.categoryId)}
              </span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: "var(--sb-text-tertiary)" }}
              >
                {formatTimecode(flag.startMs)}
              </span>
            </div>
            <p
              className="mt-1 line-clamp-2 text-[13px] leading-[1.5]"
              style={{ color: "var(--sb-text)" }}
            >
              {flag.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
