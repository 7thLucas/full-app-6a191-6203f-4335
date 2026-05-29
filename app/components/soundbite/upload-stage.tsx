import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Heart, MoveRight, Quote, Upload, Waves } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

type UploadStageProps = {
  isUploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
};

const MEDIA_ACCEPT = "video/*,audio/*";

function isMediaFile(file: File): boolean {
  return file.type.startsWith("video/") || file.type.startsWith("audio/");
}

/**
 * Landing surface shown before an interview is uploaded. Captures a single
 * media file via drag-drop or file picker and surfaces error / progress.
 */
export function UploadStage({ isUploading, error, onUpload }: UploadStageProps) {
  const { config } = useConfigurables();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const upload = config?.uploadCopy;
  const promise =
    config?.promise ??
    "Turn hours of interview footage into navigable insight in minutes.";
  const headline = upload?.headline ?? "Drop an interview to begin";
  const hint = upload?.hint ?? "MP4, MOV, WebM, MKV, or audio.";
  const draggingLabel = upload?.draggingLabel ?? "Release to upload";
  const loadingLabel = upload?.loadingLabel ?? "Uploading and queuing transcription…";
  const ctaLabel = upload?.ctaLabel ?? "Choose a file";
  const legend = config?.flagLegend ?? [];

  const handle = (file: File) => {
    if (!isMediaFile(file)) {
      setValidationError("That doesn't look like a video or audio file.");
      return;
    }
    setValidationError(null);
    onUpload(file);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handle(file);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handle(file);
  };

  const disabled = isUploading;

  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-1 flex-col items-stretch justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--sb-accent)" }}
        >
          Step 1 — Upload
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.01em]">
          {headline}
        </h1>
        <p
          className="mx-auto mt-3 max-w-[640px] text-[15px] leading-[1.65]"
          style={{ color: "var(--sb-text-secondary)" }}
        >
          {promise}
        </p>
      </div>

      {(validationError || error) && (
        <div
          role="alert"
          className="mb-4 rounded-lg px-4 py-3 text-sm"
          style={{
            border: "1px solid color-mix(in oklab, var(--destructive) 40%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--destructive) 12%, transparent)",
            color: "var(--destructive)",
          }}
        >
          {validationError ?? error}
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center transition-colors",
          "cursor-pointer select-none",
          disabled && "pointer-events-none opacity-70",
        )}
        style={{
          border: `2px dashed ${isDragging ? "var(--sb-accent)" : "var(--sb-border)"}`,
          backgroundColor: isDragging ? "var(--sb-accent-muted)" : "var(--sb-panel)",
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-disabled={disabled}
      >
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDragging ? "var(--sb-accent)" : "var(--sb-elevated)",
            color: isDragging ? "var(--primary-foreground)" : "var(--sb-text-secondary)",
            transition: "background-color 150ms ease-out, color 150ms ease-out",
          }}
        >
          {isUploading ? (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2"
              style={{
                borderColor: "var(--sb-text-tertiary)",
                borderTopColor: "var(--sb-accent)",
              }}
            />
          ) : (
            <Upload size={20} strokeWidth={1.75} />
          )}
        </div>

        <p className="text-[15px] font-medium" style={{ color: "var(--sb-text)" }}>
          {isUploading ? loadingLabel : isDragging ? draggingLabel : headline}
        </p>
        <p
          className="mt-2 text-[13px]"
          style={{ color: "var(--sb-text-secondary)" }}
        >
          {hint}
        </p>

        <button
          type="button"
          disabled={disabled}
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-md px-4 text-[13px] font-medium",
            "transition-colors",
          )}
          style={{
            height: 36,
            backgroundColor: "var(--sb-accent)",
            color: "var(--primary-foreground)",
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) inputRef.current?.click();
          }}
        >
          {ctaLabel}
          <MoveRight size={14} strokeWidth={2} />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={MEDIA_ACCEPT}
          className="hidden"
          disabled={disabled}
          onChange={onChange}
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {legend.length > 0 ? (
          legend.map((item) => (
            <LegendCard
              key={item.id}
              id={item.id}
              label={item.label}
              description={item.description}
            />
          ))
        ) : (
          <>
            <LegendCard id="emotion" label="Emotion peak" description="Where affect spikes." />
            <LegendCard id="topic" label="Topic shift" description="Where the conversation pivots." />
            <LegendCard id="quote" label="Quotable line" description="Tight, lift-and-shift soundbites." />
          </>
        )}
      </div>
    </div>
  );
}

function LegendCard({
  id,
  label,
  description,
}: {
  id: string;
  label: string;
  description?: string;
}) {
  const cssVar =
    id === "emotion"
      ? "var(--sb-flag-emotion)"
      : id === "topic"
        ? "var(--sb-flag-topic)"
        : id === "quote"
          ? "var(--sb-flag-quote)"
          : "var(--sb-accent)";

  const Icon = id === "emotion" ? Heart : id === "topic" ? Waves : Quote;

  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        backgroundColor: "var(--sb-panel)",
        border: "1px solid var(--sb-border-subtle)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-full"
          style={{
            backgroundColor: `color-mix(in oklab, ${cssVar} 18%, transparent)`,
            color: cssVar,
          }}
        >
          <Icon size={14} strokeWidth={1.75} />
        </span>
        <p className="text-[13px] font-semibold">{label}</p>
      </div>
      {description && (
        <p
          className="mt-2 text-[12px] leading-[1.5]"
          style={{ color: "var(--sb-text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
