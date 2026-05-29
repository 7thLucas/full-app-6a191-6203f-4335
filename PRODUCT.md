# Soundbite - Product Specification

## Product Overview
Soundbite is a web application designed for professionals who conduct and analyze long-form video interviews. It transforms raw interview footage into navigable, searchable, and insight-rich assets by combining automatic transcription, speaker diarization, and intelligent moment-flagging.

## Target Users
- **Journalists**: Need to quickly find quotable moments and key statements from interview footage for articles, broadcasts, and digital stories.
- **Podcasters**: Require accurate transcripts and the ability to surface compelling soundbites for episode promotion and editing.
- **Documentary Editors**: Spend hours combing through interview footage to identify emotional beats, topic shifts, and narrative arcs.
- **Qualitative Researchers**: Conduct interviews for academic or commercial research and need to code, analyze, and reference specific moments across hours of footage.

## Brand Identity
- **Name**: Soundbite
- **Personality**: Precise, calm, professional, intelligent. Feels like a quiet analyst working alongside you.
- **Voice & Tone**: Clear, concise, never noisy. Avoids hype. Speaks like a thoughtful colleague who respects the user's craft. Uses domain-aware language (interview, transcript, timestamp, speaker) rather than generic tech jargon.
- **Promise**: Turn hours of interview footage into navigable insight in minutes.

## Anti-References
- NOT a generic video editor (no timeline trimming, no cuts).
- NOT a social media clip generator (no auto-captioning for TikTok-style vertical clips).
- NOT a meeting transcription tool (different use case, different UI metaphors).
- NOT a flashy "AI does everything" product. Soundbite is a focused workbench, not a magic button.
- Avoid playful illustrations, gradients, or consumer-app energy. This is a professional tool.

## Strategic Principles
1. **The transcript is the product.** Every other feature exists to make the transcript more navigable and useful.
2. **Time is the primary axis.** Every flag, every word, every speaker label is anchored to a timestamp. Clicking anything jumps the video.
3. **High-signal moments, not noise.** Flags should be sparse and meaningful. Emotion peaks, topic shifts, and quotable lines only.
4. **Trust the speaker labels.** Diarization quality matters more than transcription speed. Users will name speakers and rely on those labels.
5. **Read, scrub, find.** The three core verbs. Optimize the UI for these.

## Day-One Features (P0)
1. **Video Upload**: Drag-and-drop or file picker upload for MP4 and common video formats (MOV, WebM, MKV).
2. **Auto Transcription + Diarization**: Server-side pipeline extracts audio, transcribes with timestamps, and labels segments by speaker.
3. **Flagged Timeline**: Visual timeline alongside the video player marking emotion peaks, topic shifts, and quotable lines with distinct flag types.
4. **Click-to-Scrub**: Clicking any flag, transcript segment, or timeline marker jumps the video to that exact timestamp.
5. **Synced Transcript**: Searchable, scrollable transcript that highlights the current segment as the video plays.

## Future Considerations (Not P0)
- Speaker renaming and persistent speaker profiles
- Export transcripts (SRT, VTT, plain text, Word)
- Quote clipping and sharing
- Multi-interview projects and cross-interview search
- Collaboration and commenting
- AI-generated summary and chapter markers


#CORE TRUTH:
# Soundbite — Interview Audio Analyzer

## What it is
A web app that ingests interview videos and surfaces the high-signal moments — pull-quotes, sentiment shifts, emotional beats — so users stop scrubbing through hours of tape to find the seconds that matter.

## Problem
Interview footage hides its best moments in the middle of an hour-long tape. Finding the quotable lines, sentiment shifts, and emotional beats today means scrubbing through the full file repeatedly. Slow, error-prone, and the high-signal seconds get lost in the noise.

## Audience
Journalists, podcasters, documentary editors, and qualitative researchers who run long-form video interviews and need to surface the best moments fast — without re-watching every minute.

## Day-One Feature (P0)
Upload an interview video → auto-transcribe with speaker labels → flag a timeline of high-signal moments (emotion peaks, topic shifts, quotable lines) → click any flag to jump straight to that timestamp in the video.

## Name
Soundbite — short, memorable, instantly evokes the value prop (find the quotable seconds).

## Confirmed by user
- Problem, audience, first feature, and name all decided this session (user delegated naming to agent).
- Ready to move into build prep.