import { useCallback, useState } from "react";
import { useTranscribe } from "@qb/audio-analyzer";
import { useConfigurables } from "~/modules/configurables";
import { SoundbiteShell } from "~/components/soundbite/soundbite-shell";
import { UploadStage } from "~/components/soundbite/upload-stage";
import { Workbench } from "~/components/soundbite/workbench";

export function meta() {
  return [
    { title: "Soundbite — Interview Audio Analyzer" },
    {
      name: "description",
      content:
        "Soundbite turns long-form interview footage into a navigable transcript with timestamped flags for emotion peaks, topic shifts, and quotable lines.",
    },
  ];
}

export default function IndexPage() {
  const { loading } = useConfigurables();
  const { submit, ticketId, isSubmitting, error, reset } = useTranscribe();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      try {
        await submit({ files: file });
      } catch {
        // Error already surfaced via `useTranscribe` hook state.
      }
    },
    [submit],
  );

  const handleReset = useCallback(() => {
    reset();
    setFileName(null);
  }, [reset]);

  if (loading) {
    return (
      <SoundbiteShell>
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--sb-text-tertiary)" }}
          >
            Loading workbench…
          </p>
        </div>
      </SoundbiteShell>
    );
  }

  if (ticketId) {
    return (
      <SoundbiteShell>
        <Workbench ticketId={ticketId} fileName={fileName} onReset={handleReset} />
      </SoundbiteShell>
    );
  }

  return (
    <SoundbiteShell>
      <UploadStage
        isUploading={isSubmitting}
        error={error}
        onUpload={handleUpload}
      />
    </SoundbiteShell>
  );
}
