import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useTranscriptionResultContext } from "@qb/audio-analyzer";
import { cn } from "~/lib/utils";
import { formatTimecode } from "./format";

type VideoPlayerProps = {
  className?: string;
};

/**
 * The Soundbite video player. Wraps the underlying <video> element produced by
 * the transcription context's `primaryMediaRef` so that the rest of the app
 * (transcript clicks, flag clicks) can drive playback via `seekToTimestamp`.
 *
 * The player owns its own minimal control surface — scrub bar, play/pause,
 * volume — styled to match the design system.
 */
export function VideoPlayer({ className }: VideoPlayerProps) {
  const { result, primaryMediaRef, activeTimestampMs } =
    useTranscriptionResultContext();

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [hasAudioFallback, setHasAudioFallback] = useState(false);

  const videoUrl = result?.video_urls?.[0] ?? null;
  const audioUrl = result?.audio_urls?.[0] ?? null;

  useEffect(() => {
    setHasAudioFallback(!videoUrl && Boolean(audioUrl));
  }, [videoUrl, audioUrl]);

  // Wire native media events → local state
  useEffect(() => {
    const media = primaryMediaRef.current;
    if (!media) return;

    const handleLoaded = () => {
      setIsReady(true);
      const d = Number.isFinite(media.duration) ? media.duration * 1000 : 0;
      setDurationMs(d);
    };
    const handleTime = () => setCurrentMs(media.currentTime * 1000);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnd = () => setIsPlaying(false);
    const handleRate = () => setRate(media.playbackRate);

    media.addEventListener("loadedmetadata", handleLoaded);
    media.addEventListener("timeupdate", handleTime);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);
    media.addEventListener("ended", handleEnd);
    media.addEventListener("ratechange", handleRate);

    if (media.readyState >= 1) handleLoaded();

    return () => {
      media.removeEventListener("loadedmetadata", handleLoaded);
      media.removeEventListener("timeupdate", handleTime);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
      media.removeEventListener("ended", handleEnd);
      media.removeEventListener("ratechange", handleRate);
    };
  }, [primaryMediaRef, videoUrl, audioUrl]);

  // External seeks (from transcript / flag clicks) — keep local state in sync
  useEffect(() => {
    if (activeTimestampMs !== null) {
      setCurrentMs(activeTimestampMs);
    }
  }, [activeTimestampMs]);

  const setRefVideo = (element: HTMLVideoElement | null) => {
    primaryMediaRef.current = element;
  };

  const setRefAudio = (element: HTMLAudioElement | null) => {
    if (!videoUrl) primaryMediaRef.current = element;
  };

  const toggle = () => {
    const media = primaryMediaRef.current;
    if (!media) return;
    if (media.paused) void media.play();
    else media.pause();
  };

  const seekBy = (deltaMs: number) => {
    const media = primaryMediaRef.current;
    if (!media) return;
    media.currentTime = Math.max(0, media.currentTime + deltaMs / 1000);
  };

  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const media = primaryMediaRef.current;
    if (!media) return;
    const ms = Number(event.target.value);
    media.currentTime = ms / 1000;
    setCurrentMs(ms);
  };

  const toggleMute = () => {
    const media = primaryMediaRef.current;
    if (!media) return;
    media.muted = !media.muted;
    setMuted(media.muted);
  };

  const cycleRate = () => {
    const media = primaryMediaRef.current;
    if (!media) return;
    const next = rate >= 2 ? 0.5 : Number((rate + 0.25).toFixed(2));
    media.playbackRate = next;
    setRate(next);
  };

  const sliderMax = durationMs > 0 ? durationMs : 1;
  const progressPct = durationMs > 0 ? (currentMs / durationMs) * 100 : 0;

  if (!videoUrl && !audioUrl) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[260px] items-center justify-center rounded-xl px-6 py-12",
          className,
        )}
        style={{
          backgroundColor: "var(--sb-panel)",
          border: "1px solid var(--sb-border-subtle)",
        }}
      >
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--sb-text-tertiary)" }}
          >
            Awaiting media
          </p>
          <p
            className="mt-2 text-[14px]"
            style={{ color: "var(--sb-text-secondary)" }}
          >
            The interview file is being prepared.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col gap-3", className)}>
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          border: "1px solid var(--sb-border)",
          backgroundColor: "#000",
        }}
      >
        {videoUrl ? (
          <video
            ref={setRefVideo}
            src={videoUrl}
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black object-contain"
          />
        ) : audioUrl ? (
          <div className="flex aspect-video w-full items-center justify-center bg-black">
            <div className="text-center">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "var(--sb-text-tertiary)" }}
              >
                Audio interview
              </p>
              <p
                className="mt-3 font-mono text-[13px]"
                style={{ color: "var(--sb-text-secondary)" }}
              >
                {formatTimecode(currentMs)} / {formatTimecode(durationMs)}
              </p>
              <audio
                ref={setRefAudio}
                src={audioUrl}
                preload="metadata"
                className="hidden"
              />
            </div>
          </div>
        ) : null}
        {hasAudioFallback && audioUrl && videoUrl && (
          // Keep an audio fallback mounted only when both kinds exist (rare).
          <audio src={audioUrl} preload="metadata" className="hidden" />
        )}
      </div>

      <div
        className="flex items-center gap-3 rounded-lg px-3 py-2"
        style={{
          backgroundColor: "var(--sb-panel)",
          border: "1px solid var(--sb-border-subtle)",
        }}
      >
        <button
          type="button"
          onClick={() => seekBy(-5000)}
          aria-label="Skip back 5 seconds"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          style={{ color: "var(--sb-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--sb-elevated)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <SkipBack size={16} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors"
          style={{ backgroundColor: "var(--sb-accent)" }}
          disabled={!isReady}
        >
          {isPlaying ? <Pause size={16} strokeWidth={2} /> : <Play size={16} strokeWidth={2} />}
        </button>

        <button
          type="button"
          onClick={() => seekBy(5000)}
          aria-label="Skip forward 5 seconds"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          style={{ color: "var(--sb-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--sb-elevated)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <SkipForward size={16} strokeWidth={1.75} />
        </button>

        <span
          className="ml-2 font-mono text-[12px] tabular-nums"
          style={{ color: "var(--sb-text-secondary)" }}
        >
          {formatTimecode(currentMs)}
        </span>

        <div className="relative flex-1">
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: "var(--sb-border)" }}
          />
          <div
            aria-hidden
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{
              backgroundColor: "var(--sb-accent)",
              width: `${Math.min(100, Math.max(0, progressPct))}%`,
              transition: "width 120ms linear",
            }}
          />
          <input
            type="range"
            min={0}
            max={sliderMax}
            value={Math.min(sliderMax, currentMs)}
            onChange={handleScrub}
            aria-label="Seek"
            className="sb-scrubber relative h-4 w-full appearance-none bg-transparent"
          />
        </div>

        <span
          className="font-mono text-[12px] tabular-nums"
          style={{ color: "var(--sb-text-tertiary)" }}
        >
          {formatTimecode(durationMs)}
        </span>

        <button
          type="button"
          onClick={cycleRate}
          aria-label="Playback speed"
          className="inline-flex h-8 w-12 items-center justify-center rounded-md font-mono text-[11px] transition-colors"
          style={{
            color: "var(--sb-text-secondary)",
            border: "1px solid var(--sb-border)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--sb-elevated)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {rate.toFixed(rate % 1 === 0 ? 0 : 2)}x
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          style={{ color: "var(--sb-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--sb-elevated)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {muted ? <VolumeX size={16} strokeWidth={1.75} /> : <Volume2 size={16} strokeWidth={1.75} />}
        </button>
      </div>

      <style>{`
        .sb-scrubber::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--sb-accent);
          border: 2px solid var(--sb-bg);
          cursor: pointer;
          transition: transform 120ms ease-out;
        }
        .sb-scrubber::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .sb-scrubber::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--sb-accent);
          border: 2px solid var(--sb-bg);
          cursor: pointer;
        }
        .sb-scrubber:focus-visible {
          outline: 2px solid var(--sb-accent);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
