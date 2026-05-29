import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranscriptionResultContext, type ChatSegment } from "@qb/audio-analyzer";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";
import { formatTimecode } from "./format";

type TranscriptPanelProps = {
  className?: string;
};

function speakerKey(segment: ChatSegment): string {
  return segment.speaker_id ?? segment.speaker ?? "speaker";
}

function speakerLabel(segment: ChatSegment): string {
  return (
    segment.speaker_name ||
    segment.speaker ||
    segment.speaker_id ||
    "Speaker"
  );
}

/**
 * Hash a speaker id → one of the Soundbite accents. Stable across renders.
 */
function colorForSpeaker(id: string): string {
  const palette = [
    "var(--sb-accent)",
    "var(--sb-flag-quote)",
    "var(--sb-flag-topic)",
    "var(--sb-flag-emotion)",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

export function TranscriptPanel({ className }: TranscriptPanelProps) {
  const {
    transcriptSegments,
    activeTimestampMs,
    seekToTimestamp,
    segmentRefs,
  } = useTranscriptionResultContext();
  const { config } = useConfigurables();
  const workbench = config?.workbenchCopy;

  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return transcriptSegments;
    return transcriptSegments.filter((segment) =>
      (segment.text ?? "").toLowerCase().includes(normalizedQuery),
    );
  }, [transcriptSegments, normalizedQuery]);

  // Track active segment index so we can auto-scroll on playhead movement.
  const activeIndex = useMemo(() => {
    if (activeTimestampMs === null) return -1;
    for (let i = 0; i < filtered.length; i += 1) {
      const segment = filtered[i];
      const end = segment.end_ms > 0 ? segment.end_ms : segment.start_ms;
      if (activeTimestampMs >= segment.start_ms && activeTimestampMs <= end) {
        return i;
      }
    }
    return -1;
  }, [filtered, activeTimestampMs]);

  // Smooth scroll active segment into view (no search filter mode).
  const previousActiveRef = useRef(-1);
  useEffect(() => {
    if (normalizedQuery) return;
    if (activeIndex < 0) return;
    if (activeIndex === previousActiveRef.current) return;
    previousActiveRef.current = activeIndex;
    const segment = filtered[activeIndex];
    if (!segment) return;
    const key = `${segment.start_ms}-${activeIndex}`;
    const node = segmentRefs.current[key];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex, filtered, segmentRefs, normalizedQuery]);

  const title = workbench?.transcriptTitle ?? "Transcript";
  const hint = workbench?.transcriptHint ?? "Click any line to jump the player.";
  const empty =
    workbench?.emptyTranscript ?? "Transcript will appear here once processing completes.";
  const placeholder = workbench?.searchPlaceholder ?? "Search transcript…";

  return (
    <section
      className={cn("flex h-full min-h-0 flex-col rounded-xl", className)}
      style={{
        backgroundColor: "var(--sb-panel)",
        border: "1px solid var(--sb-border-subtle)",
      }}
    >
      <header
        className="shrink-0 border-b px-4 py-3"
        style={{ borderColor: "var(--sb-border-subtle)" }}
      >
        <div className="flex items-baseline justify-between gap-3">
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
            {transcriptSegments.length} line{transcriptSegments.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="relative mt-3">
          <Search
            size={14}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--sb-text-tertiary)" }}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md pl-8 pr-9 text-[13px] outline-none"
            style={{
              height: 36,
              backgroundColor: "var(--sb-elevated)",
              color: "var(--sb-text)",
              border: "1px solid var(--sb-border)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sb-accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sb-border)")}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md"
              style={{ color: "var(--sb-text-tertiary)" }}
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </header>

      <div
        ref={listRef}
        className="sb-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2"
      >
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 py-8">
            <p
              className="text-center text-[13px]"
              style={{ color: "var(--sb-text-tertiary)" }}
            >
              {normalizedQuery
                ? `No transcript lines match "${query}".`
                : empty}
            </p>
          </div>
        ) : (
          filtered.map((segment, index) => {
            const key = `${segment.start_ms}-${index}`;
            const speakerId = speakerKey(segment);
            const speakerColor = colorForSpeaker(speakerId);
            const endMs = segment.end_ms > 0 ? segment.end_ms : segment.start_ms;
            const isActive =
              activeTimestampMs !== null &&
              activeTimestampMs >= segment.start_ms &&
              activeTimestampMs <= endMs;

            return (
              <button
                key={key}
                type="button"
                ref={(element) => {
                  segmentRefs.current[key] = element;
                }}
                onClick={() => seekToTimestamp(segment.start_ms)}
                className="group block w-full rounded-md px-3 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--sb-elevated)" : "transparent",
                  borderLeft: isActive
                    ? `3px solid ${speakerColor}`
                    : "3px solid transparent",
                  paddingLeft: 12,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "var(--sb-elevated)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className="truncate text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: speakerColor }}
                  >
                    {speakerLabel(segment)}
                  </span>
                  <span
                    className="shrink-0 font-mono text-[11px] tabular-nums"
                    style={{ color: "var(--sb-text-tertiary)" }}
                  >
                    {formatTimecode(segment.start_ms)}
                  </span>
                </div>
                <p
                  className="mt-1 text-[14px] leading-[1.65]"
                  style={{
                    color: isActive ? "var(--sb-text)" : "var(--sb-text-secondary)",
                  }}
                >
                  {highlightQuery(segment.text ?? "", normalizedQuery)}
                </p>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

function highlightQuery(text: string, query: string) {
  if (!query) return text || "[no text]";
  if (!text) return "[no text]";
  const lower = text.toLowerCase();
  const fragments: Array<{ value: string; match: boolean }> = [];
  let cursor = 0;
  while (cursor < text.length) {
    const idx = lower.indexOf(query, cursor);
    if (idx === -1) {
      fragments.push({ value: text.slice(cursor), match: false });
      break;
    }
    if (idx > cursor) {
      fragments.push({ value: text.slice(cursor, idx), match: false });
    }
    fragments.push({ value: text.slice(idx, idx + query.length), match: true });
    cursor = idx + query.length;
  }
  return fragments.map((fragment, i) =>
    fragment.match ? (
      <mark
        key={i}
        style={{
          backgroundColor: "color-mix(in oklab, var(--sb-accent) 32%, transparent)",
          color: "var(--sb-text)",
          padding: "0 2px",
          borderRadius: 3,
        }}
      >
        {fragment.value}
      </mark>
    ) : (
      <span key={i}>{fragment.value}</span>
    ),
  );
}
