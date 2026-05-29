import type {
  CategoryFinding,
  CategoryIssue,
  CategoryStrength,
  TrackTranscribeResult,
} from "@qb/audio-analyzer";

export type FlagKind = "emotion" | "topic" | "quote" | "other";

export type SoundbiteFlag = {
  id: string;
  kind: FlagKind;
  categoryId: string;
  description: string;
  startMs: number;
  endMs: number;
};

const ID_TO_KIND: Record<string, FlagKind> = {
  emotion_peak: "emotion",
  emotion: "emotion",
  topic_shift: "topic",
  topic: "topic",
  quotable_line: "quote",
  quote: "quote",
};

function asKind(categoryId: string | null | undefined): FlagKind {
  if (!categoryId) return "other";
  return ID_TO_KIND[categoryId] ?? "other";
}

function parseTimestamp(value: string | undefined | null): number | null {
  if (!value || typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  let ms = 0;
  let timePart = cleaned;
  if (cleaned.includes(".")) {
    const [base, fraction] = cleaned.split(".", 2);
    timePart = base;
    ms = Number((fraction ?? "").padEnd(3, "0").slice(0, 3));
    if (!Number.isFinite(ms)) ms = 0;
  }
  const parts = timePart.split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  const [h, m, s] = parts.length === 2 ? ["0", parts[0], parts[1]] : parts;
  const total =
    Number(h) * 3_600_000 + Number(m) * 60_000 + Number(s) * 1_000 + ms;
  return Number.isFinite(total) ? total : null;
}

function findingStart(finding: CategoryFinding): number | null {
  if (typeof finding.start_ms === "number") return finding.start_ms;
  return parseTimestamp((finding as CategoryIssue | CategoryStrength).start_time);
}

function findingEnd(finding: CategoryFinding, start: number): number {
  if (typeof finding.end_ms === "number") return finding.end_ms;
  const parsed = parseTimestamp((finding as CategoryIssue | CategoryStrength).end_time);
  return parsed ?? start;
}

/**
 * Pull every category finding (issue or strength) from the analysis payload
 * and project it into a flat, timeline-ready list of Soundbite flags. We treat
 * both `issues` and `strengths` as positive flag candidates — the microservice
 * uses these buckets to surface noteworthy moments per category.
 */
export function deriveFlags(result: TrackTranscribeResult | null): SoundbiteFlag[] {
  const analysis = result?.analysis;
  if (!analysis) return [];

  const evaluations = analysis.category_evaluations ?? [];
  const flags: SoundbiteFlag[] = [];

  const push = (
    finding: CategoryFinding,
    categoryId: string,
    title: string,
    bucket: "issue" | "strength",
    idx: number,
  ) => {
    const start = findingStart(finding);
    if (start === null) return;
    const end = findingEnd(finding, start);
    flags.push({
      id: `${categoryId}-${bucket}-${idx}-${start}`,
      kind: asKind(categoryId),
      categoryId,
      description:
        finding.description?.trim() ||
        title?.trim() ||
        "High-signal moment",
      startMs: Math.max(0, start),
      endMs: Math.max(start, end),
    });
  };

  evaluations.forEach((evaluation) => {
    (evaluation.issues ?? []).forEach((issue, idx) =>
      push(issue, evaluation.category_id, evaluation.title, "issue", idx),
    );
    (evaluation.strengths ?? []).forEach((strength, idx) =>
      push(strength, evaluation.category_id, evaluation.title, "strength", idx),
    );
  });

  // Also include chunked findings (fallback for analyses that return per-chunk
  // category_scores rather than category_evaluations).
  (analysis.chunks ?? []).forEach((chunk) => {
    Object.entries(chunk.category_scores ?? {}).forEach(([categoryId, score]) => {
      (score.issues ?? []).forEach((issue, idx) =>
        push(issue, categoryId, categoryId, "issue", idx),
      );
      (score.strengths ?? []).forEach((strength, idx) =>
        push(strength, categoryId, categoryId, "strength", idx),
      );
    });
  });

  return flags
    .filter(
      (flag, idx, arr) =>
        arr.findIndex(
          (other) => other.startMs === flag.startMs && other.description === flag.description,
        ) === idx,
    )
    .sort((a, b) => a.startMs - b.startMs);
}

/**
 * Determine the total duration of the interview using the longest segment end
 * timestamp we have access to. Falls back to the playhead media duration when
 * provided.
 */
export function deriveDurationMs(
  result: TrackTranscribeResult | null,
  fallbackMs: number | null,
): number {
  const segments = result?.analysis?.segments ?? [];
  let max = 0;
  for (const segment of segments) {
    const end =
      segment.end_ms && segment.end_ms > 0 ? segment.end_ms : segment.start_ms ?? 0;
    if (end > max) max = end;
  }
  for (const chunk of result?.analysis?.session_chunks ?? []) {
    if (chunk.end_ms > max) max = chunk.end_ms;
  }
  if (max > 0) return max;
  if (typeof fallbackMs === "number" && Number.isFinite(fallbackMs) && fallbackMs > 0) {
    return fallbackMs;
  }
  return 0;
}
