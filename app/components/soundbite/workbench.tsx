import { Activity, ArrowLeft, CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { TranscriptionResultProvider, useTranscriptionResultContext } from "@qb/audio-analyzer";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";
import { VideoPlayer } from "./video-player";
import { FlaggedTimeline } from "./flagged-timeline";
import { TranscriptPanel } from "./transcript-panel";

type WorkbenchProps = {
  ticketId: string;
  fileName?: string | null;
  onReset: () => void;
};

/**
 * Soundbite workbench — the three-pane interview cockpit. Powered by the
 * transcription module's polling context so video, transcript, and flag
 * clicks all share the same media element and timestamp state.
 */
export function Workbench({ ticketId, fileName, onReset }: WorkbenchProps) {
  return (
    <TranscriptionResultProvider ticketId={ticketId} pollIntervalMs={2500}>
      <WorkbenchBody fileName={fileName} onReset={onReset} />
    </TranscriptionResultProvider>
  );
}

function WorkbenchBody({
  fileName,
  onReset,
}: {
  fileName?: string | null;
  onReset: () => void;
}) {
  const { result, isLoading, isCompleted, isFailed, error } =
    useTranscriptionResultContext();
  const { config } = useConfigurables();
  const workbench = config?.workbenchCopy;

  const stage = result?.stage ?? null;
  const status = result?.status ?? "queued";

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 pt-4 pb-6 lg:px-6">
      <SubBar
        fileName={fileName}
        status={status}
        stage={stage}
        isLoading={isLoading}
        isCompleted={isCompleted}
        isFailed={isFailed}
        onReset={onReset}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            border: "1px solid color-mix(in oklab, var(--destructive) 35%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--destructive) 10%, transparent)",
            color: "var(--destructive)",
          }}
        >
          {error}
        </div>
      )}

      {isLoading && !result ? (
        <ProcessingSplash />
      ) : (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12">
          <div className="flex min-h-0 flex-col gap-4 lg:col-span-7">
            <div
              className="rounded-xl p-3"
              style={{
                backgroundColor: "var(--sb-panel)",
                border: "1px solid var(--sb-border-subtle)",
              }}
            >
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--sb-text-tertiary)" }}>
                  {workbench?.playerTitle ?? "Interview"}
                </h2>
                {fileName && (
                  <span
                    className="truncate font-mono text-[11px]"
                    style={{ color: "var(--sb-text-tertiary)" }}
                    title={fileName}
                  >
                    {fileName}
                  </span>
                )}
              </div>
              <VideoPlayer />
            </div>

            <FlaggedTimeline className="min-h-[320px] flex-1" />
          </div>

          <div className="lg:col-span-5 min-h-0">
            <TranscriptPanel className="h-full min-h-[480px]" />
          </div>
        </div>
      )}
    </div>
  );
}

function SubBar({
  fileName,
  status,
  stage,
  isLoading,
  isCompleted,
  isFailed,
  onReset,
}: {
  fileName?: string | null;
  status: string;
  stage: string | null;
  isLoading: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  onReset: () => void;
}) {
  const stageLabel = stage ? stage.replace(/_/g, " ") : null;
  const statusLabel = status || (isLoading ? "queued" : "processing");

  const indicatorColor = isCompleted
    ? "var(--sb-flag-quote)"
    : isFailed
      ? "var(--destructive)"
      : "var(--sb-accent)";

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
      style={{
        backgroundColor: "var(--sb-panel)",
        border: "1px solid var(--sb-border-subtle)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors"
          style={{
            height: 32,
            color: "var(--sb-text-secondary)",
            border: "1px solid var(--sb-border)",
            backgroundColor: "var(--sb-elevated)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--sb-text)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--sb-text-secondary)")
          }
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          New interview
        </button>

        {fileName && (
          <p
            className="truncate text-[13px]"
            style={{ color: "var(--sb-text)" }}
            title={fileName}
          >
            <span
              className="mr-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--sb-text-tertiary)" }}
            >
              File
            </span>
            {fileName}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
          )}
          style={{
            backgroundColor: `color-mix(in oklab, ${indicatorColor} 14%, transparent)`,
            color: indicatorColor,
          }}
        >
          {isCompleted ? (
            <CheckCircle2 size={12} strokeWidth={2} />
          ) : isFailed ? (
            <CircleAlert size={12} strokeWidth={2} />
          ) : (
            <Activity size={12} strokeWidth={2} className="animate-pulse" />
          )}
          {statusLabel}
        </span>
        {stageLabel && !isCompleted && !isFailed && (
          <span
            className="font-mono text-[11px]"
            style={{ color: "var(--sb-text-tertiary)" }}
          >
            {stageLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function ProcessingSplash() {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-xl px-6 py-16"
      style={{
        backgroundColor: "var(--sb-panel)",
        border: "1px solid var(--sb-border-subtle)",
      }}
    >
      <div className="text-center">
        <Loader2
          size={28}
          strokeWidth={1.75}
          className="mx-auto animate-spin"
          style={{ color: "var(--sb-accent)" }}
        />
        <p className="mt-4 text-[15px] font-medium">Queuing your interview…</p>
        <p
          className="mt-2 text-[13px]"
          style={{ color: "var(--sb-text-secondary)" }}
        >
          Extracting audio, transcribing speech, and labeling speakers.
        </p>
      </div>
    </div>
  );
}
