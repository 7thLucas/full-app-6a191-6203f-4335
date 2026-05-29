/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TSurfaceColor = {
  background: string;
  panel: string;
  elevated: string;
  borderSubtle: string;
  borderDefault: string;
};

export type TTextColor = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export type TFlagColor = {
  emotion: string;
  topic: string;
  quote: string;
};

export type TUploadCopy = {
  headline: string;
  hint: string;
  draggingLabel: string;
  loadingLabel: string;
  ctaLabel: string;
};

export type TWorkbenchCopy = {
  transcriptTitle: string;
  transcriptHint: string;
  timelineTitle: string;
  timelineHint: string;
  playerTitle: string;
  emptyTranscript: string;
  emptyFlags: string;
  searchPlaceholder: string;
};

export type TFlagLegendItem = {
  id: string;
  label: string;
  description?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline?: string;
  promise?: string;
  logoUrl: string;
  brandColor: TBrandColor;
  surfaceColor?: TSurfaceColor;
  textColor?: TTextColor;
  flagColor?: TFlagColor;
  uploadCopy?: TUploadCopy;
  workbenchCopy?: TWorkbenchCopy;
  footerText?: string;
  flagLegend?: TFlagLegendItem[];
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Soundbite",
  tagline: "Find the seconds that matter.",
  promise:
    "Turn hours of interview footage into navigable insight in minutes. Auto-transcribed, speaker-labeled, and flagged for the moments worth quoting.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#5E8BFF",
    secondary: "#1E2128",
    accent: "#7DD3A8",
  },
  surfaceColor: {
    background: "#0E0F12",
    panel: "#16181D",
    elevated: "#1E2128",
    borderSubtle: "#262932",
    borderDefault: "#2F3340",
  },
  textColor: {
    primary: "#E8EAED",
    secondary: "#9CA0AB",
    tertiary: "#6B7080",
  },
  flagColor: {
    emotion: "#FF7A6B",
    topic: "#FFC857",
    quote: "#7DD3A8",
  },
  uploadCopy: {
    headline: "Drop an interview to begin",
    hint: "MP4, MOV, WebM, MKV, or audio — up to a few hours.",
    draggingLabel: "Release to upload",
    loadingLabel: "Uploading and queuing transcription…",
    ctaLabel: "Choose a file",
  },
  workbenchCopy: {
    transcriptTitle: "Transcript",
    transcriptHint: "Click any line to jump the player to that timestamp.",
    timelineTitle: "Flagged moments",
    timelineHint: "Emotion peaks, topic shifts, and quotable lines — sparse on purpose.",
    playerTitle: "Interview",
    emptyTranscript: "Transcript will appear here once processing completes.",
    emptyFlags: "Flagged moments will appear as analysis finishes.",
    searchPlaceholder: "Search transcript…",
  },
  footerText: "Soundbite — a quiet workbench for interview interrogation.",
  flagLegend: [
    {
      id: "emotion",
      label: "Emotion peak",
      description: "Where the speaker's affect spikes.",
    },
    {
      id: "topic",
      label: "Topic shift",
      description: "Where the conversation pivots.",
    },
    {
      id: "quote",
      label: "Quotable line",
      description: "Tight, lift-and-shift soundbites.",
    },
  ],
};
