# Soundbite - Design System

## Design Philosophy
Soundbite's interface is a **professional workbench**. It should feel like a high-end audio editor or a legal research tool: dense, precise, and trustworthy. The design recedes so the content (video, transcript, flags) takes center stage. Inspired by Apple's Final Cut Pro, Linear, and Notion's editorial restraint.

## Color System

### Primary Palette (Dark-first, professional)
- **Background (base)**: `#0E0F12` — Deep near-black, easy on the eyes during long editing sessions.
- **Surface (panel)**: `#16181D` — Slightly lighter for cards, sidebars, transcript panels.
- **Surface elevated**: `#1E2128` — For modals, dropdowns, hover states.
- **Border subtle**: `#262932` — Hairline dividers.
- **Border default**: `#2F3340` — Standard component borders.

### Text
- **Text primary**: `#E8EAED` — Main reading text, transcript content.
- **Text secondary**: `#9CA0AB` — Labels, metadata, timestamps.
- **Text tertiary**: `#6B7080` — Disabled, very subtle hints.

### Accent (Soundbite Signal)
- **Accent primary**: `#5E8BFF` — Cool, focused blue. Used for playhead, active states, primary actions.
- **Accent hover**: `#7AA0FF`
- **Accent muted**: `#2A3A66` — Backgrounds for accent badges.

### Semantic Flag Colors (the heart of the product)
- **Flag: Emotion Peak**: `#FF7A6B` — Warm coral. Used for emotional moments.
- **Flag: Topic Shift**: `#FFC857` — Amber. Used for narrative pivots.
- **Flag: Quotable Line**: `#7DD3A8` — Mint green. Used for highlight-worthy quotes.

### Status
- **Success**: `#52C788`
- **Warning**: `#F5B348`
- **Error**: `#E5564A`
- **Processing**: `#5E8BFF` (uses accent)

## Typography

### Font Families
- **UI / Body**: `Inter` — Clean, neutral, excellent at small sizes for dense interfaces.
- **Transcript / Reading**: `Inter` with slightly increased line-height (1.65) for long-form readability.
- **Monospace (timestamps, technical data)**: `JetBrains Mono` — For timecodes like `00:14:32`.

### Type Scale
- **Display (page titles)**: 28px / 600 weight / -0.01em tracking
- **H1 (section headers)**: 22px / 600 weight
- **H2 (panel headers)**: 16px / 600 weight
- **Body (default)**: 14px / 400 weight / 1.5 line-height
- **Transcript text**: 15px / 400 weight / 1.65 line-height
- **Small / Label**: 12px / 500 weight / uppercase tracking 0.04em
- **Timestamp mono**: 12px / JetBrains Mono / 500 weight

## Spacing & Layout
- **Base unit**: 4px
- **Common spacing**: 4, 8, 12, 16, 20, 24, 32, 48, 64
- **Border radius**:
  - Subtle (chips, inputs): 6px
  - Default (cards, buttons): 8px
  - Large (modals, video player): 12px
- **Page max width**: Full viewport (this is an app, not a marketing site)
- **Workbench layout**: Three-pane split — video player (left), flagged timeline (center spine), transcript (right). Resizable on desktop.

## Elevation
- **Level 0 (flat panels)**: No shadow, distinguished by background color
- **Level 1 (hoverable cards)**: `0 1px 2px rgba(0,0,0,0.3)`
- **Level 2 (dropdowns, popovers)**: `0 4px 12px rgba(0,0,0,0.4)`
- **Level 3 (modals)**: `0 16px 48px rgba(0,0,0,0.6)`

## Components

### Buttons
- **Primary**: Accent blue fill, white text, 8px radius, 14px font, 36px height.
- **Secondary**: Transparent fill, border default, text primary, same dimensions.
- **Ghost**: No fill, no border, text secondary, hover surface elevated.
- **Destructive**: Error red fill.

### Flag Chips
- Pill-shaped, 6px radius, 11px font, semantic color background at 15% opacity, text at 100% color.
- Icon prefix (heart for emotion, arrow for topic shift, quote for quotable).

### Video Player
- Black canvas with thin 1px border, 12px radius.
- Playhead and scrub bar use accent primary.
- Custom controls overlay (play/pause, scrub, time display in mono font, speed selector).

### Transcript Panel
- Each segment is a clickable block with hover state (surface elevated background).
- Speaker name in accent blue, 12px uppercase tracking-wide.
- Timestamp in mono font, text tertiary, left-aligned.
- Active segment (currently playing) has accent-muted left border (3px) and brighter text.

### Timeline (Flagged)
- Horizontal strip beneath/alongside video.
- Playhead marker uses accent primary.
- Flag markers as small colored dots/pills on the timeline, tooltip on hover.
- Density-aware: clusters when zoomed out, expands when zoomed in.

### Upload Zone
- Large dashed border (border default), centered icon and text.
- Drag-active state: accent border, accent-muted background.
- Progress bar uses accent primary with smooth animation.

### Form Inputs
- 36px height, surface elevated background, border default, 8px radius.
- Focus: border accent primary, no glow (professional, not flashy).

## Iconography
- **Icon library**: Lucide React (clean, consistent line icons).
- **Default size**: 16px for inline, 20px for buttons, 24px for empty states.
- **Stroke width**: 1.75px (slightly thinner than default for refined feel).

## Motion
- **Default transition**: 150ms ease-out for hover/state changes.
- **Modal/overlay**: 200ms ease-out.
- **No flashy animations.** Motion serves clarity, never decoration.
- **Playhead movement**: Linear, locked to video time. No easing.

## Accessibility
- Minimum contrast ratio 4.5:1 for body text against backgrounds.
- Keyboard navigation throughout (arrow keys scrub video, J/K/L for transport controls in transcript view).
- Focus rings: 2px accent primary outline with 2px offset.
- Respect `prefers-reduced-motion` for any transitions.

## Empty States
- Calm, single-line copy. No illustrations.
- Centered icon (24px, text tertiary color), one-line headline, optional secondary action.
- Example: "No interviews yet. Upload your first to begin."
