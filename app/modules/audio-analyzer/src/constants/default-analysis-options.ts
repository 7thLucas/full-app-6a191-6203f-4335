import type { TranscriptionAnalysisOptions } from "../libs/types";

/**
 * Soundbite analysis options.
 *
 * Soundbite ingests long-form interview footage and surfaces three signal
 * categories on a timeline alongside the player:
 *   • emotion_peak — moments where the speaker's affect spikes.
 *   • topic_shift  — moments where the conversation pivots.
 *   • quotable_line — tight, lift-and-shift soundbites the user will quote.
 *
 * The category IDs below are intentionally aligned with the flag IDs in the
 * configurables `flagLegend` (emotion / topic / quote) so the UI can colour
 * findings by `category_id`. The microservice returns `issues` and `strengths`
 * per category — both are treated as flag candidates and rendered on the
 * timeline.
 */
export const defaultAnalysisOptions: TranscriptionAnalysisOptions = {
  context:
    "Long-form recorded interview (journalist, podcast, documentary, or qualitative research). Identify high-signal moments: emotion peaks, topic shifts, and quotable lines. The user is hunting for the seconds worth quoting or returning to — be sparse and meaningful.",
  speaker_roles: ["interviewer", "subject", "other"],
  primary_role: "subject",
  default_role: "subject",
  role_display: {
    interviewer: "Interviewer",
    subject: "Subject",
    other: "Other",
  },
  scoring_rules: [
    {
      id: "emotion_peak",
      title: "Emotion peak",
      rule:
        "Score 0-{max_score} for the strength of the emotional signal in this segment. Flag specific moments where the subject's affect spikes (raised voice, vulnerability, anger, laughter, tears, long pauses with weight). List each peak as a finding with start/end timestamps. Be sparse: only the moments that actually matter.",
      params: { max_score: "100" },
    },
    {
      id: "topic_shift",
      title: "Topic shift",
      rule:
        "Score 0-{max_score} for the presence of meaningful topic pivots in this segment. Flag the exact moments where the conversation transitions to a new subject, a new memory, or a new line of questioning. List each pivot as a finding with a short description of the new topic and start/end timestamps.",
      params: { max_score: "100" },
    },
    {
      id: "quotable_line",
      title: "Quotable line",
      rule:
        "Score 0-{max_score} for the presence of lift-and-shift soundbites — short, complete, vivid lines the subject says that a journalist would quote verbatim. Flag each quotable as a finding with the exact line in the description and start/end timestamps. Be sparse: only standalone quotes.",
      params: { max_score: "100" },
    },
  ],
};
