<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nudge (working title) · DBS Assignment 3 (Patterns & Flows)

## What and for whom
- A goal pusher for students in recruiting season: the job-search tasks that matter but you don't enjoy, so you keep putting them off (LinkedIn connections, applications, coffee chats, interview practice).
- The user is a student in recruiting season (user decision 2026-10-17: a specific audience, not everyone). Examples, copy and nudges speak to job hunting. The tool is proactive: it tells you today's number, pushes you to start, and nudges you again (encouraging, never shaming) until you do. No chat.
- Main flow: I set a goal (e.g. 500 connections by a date) → every day it tells me today's number and pushes me to start → if I haven't, it nudges me again → I come back and see how close I am.

## Decisions so far (user-approved)
- Any job-search goal can be tracked (Something else is free text), but first-visit choices are recruiting tasks.
- A big goal is split into a daily quota (remaining / days left); falling behind raises tomorrow's quota, and the app says why.
- "Forcing a start": the home screen shows only today's number and one big "do one now" action.
- Tone and look: warm and motivating (user, 2026-10-17). Nudges get more direct through the day when nothing is done, but never shame. The visual style should feel warm too.
- A goal you have started stays on top until it is done, so it never jumps away mid-task.

## Design rules (from Week 3 class, agreed with the user 2026-10-17)

Voice and style (user, 2026-10-17, after researching Duolingo)
- Encourage, don't remove the push (user, 2026-10-17): the app still pushes people to finish, but always by cheering them on. Lead with progress, then the next step ("10 of 100, nice work!" then "pick a new one and keep going!"), never with a verdict ("The deadline has passed").
- Write like a cheerleader, after Duolingo: short, active voice, celebrate small wins. The character may joke about itself, never about the person. A missed day talks about the best run and starting again, never "falling behind".
- No full stops anywhere in the interface (they read as stern). Encouraging lines end with "!", easygoing ones with no punctuation at all (user, 2026-10-18: the "~" read as a typo; a full stop felt down). Errors and labels take no end punctuation (no "!" on errors, it reads as shouting). `src/lib/copy.test.ts` checks this.
- Look: "Cozy Cat", clay edition (user, 2026-10-17, after reading the design skills). Warm light page; the few things you act on are saturated and chunky (Claymorphism: a highlight on top, a solid lip underneath, press sinks it), everything else quiet. Grass green (`--color-primary` #3ec66b, a step brighter than the first mint) only for the primary action and the selected goal tab; honey for fish treats and the streak; sky blue is Titi's bowl; the finish flag on Titi's road is the one plain red (user's request, 2026-10-18). No orange or rose anywhere else: the user tried a rose primary on 2026-10-18 and rejected it (a cool pink fought the warm cream), and orange was rejected because it is Titi's and the rewards' colour, so the button would not stand apart. No dark outlines. The design system page `/design-system` (built 2026-10-18 on Assignment 2's six parts) is the source of truth: four type roles plus Number (`t-display`, `t-heading`, `t-body`, `t-label`, `t-number`; Fredoka only for Display, Heading and Number, Nunito for everything you read or press), three radii (`rounded-tile` 12, `rounded-card` 24, `rounded-full`), shared pieces in `src/components/ui/` (Button, Field, RadioGroup, Label, Bubble, ArrowLink, Meter, GoalSwitch, Toast). A new element takes an existing role or component; if none fits, add it to the page first. Clay (the highlight and the lip, `.clay`) means "you can press this" and goes only on buttons, tappable fish, radio options, goal tabs and cards that are links; anything that cannot be tapped has no box at all: the sentence on Today, the week's bowls, the result numbers, the painted road (its own rounded shape), the settings sections (separated by a hairline) are plain on the page (user, 2026-10-18, after the sentence card was taken for a button). The only read-only things with a backing are Titi's speech bubbles (the tail says "speech") and the streak chip on the painting (`.flat`: a soft shadow, no lip). Titi's mat is the one decorative clay piece. Tokens and their contrast live in `src/app/globals.css`.
- Never stitch separately generated raster art together (user, 2026-10-17: "if it looks ugly I'd rather not have it"). Painted pieces (the window, the bowls, Titi) each stand alone on plain interface, never laid over another painting. Titi keeps her drawn frame animations. The one exception is Titi's road on the progress page (user's decision, 2026-10-18): the hillside is a GPT painting and the code draws Titi, paw prints, the signposts, the pace ring and the flag on top of it, because they move with progress; things higher up the hill are drawn smaller so they sit in the painting's distance, and each gets a soft shadow. Do not extend this to any other screen.
- Each screen holds one sentence, one central object (Titi and the fish treats) and one button.
- Start never opens a website (user, 2026-10-18): the session (`/session`, its own page so Back works) offers "Open <site> ↗" and the person taps it. Presets may suggest a page; it is only ever offered on that button.
- Navigation holds only the core needs: Today and Goals. Reminders are a setting, reached from Goals and from the done screen.
- One streak for the whole app, like Duolingo's: a day counts when any goal got at least one ("One now keeps your streak going!"), with one forgiven rest day a week. It reads as "N-day streak".
- Titi is the user's own cat (art generated with GPT, credit it in the README). Drawn loops in `public/cat/`: asleep before you start, sitting with you while you work, jumping for joy when today is done; each has a still frame for reduced motion. Titi is never hungry, sad or disappointed. Every task done is one fish treat for Titi; the count always shows as a number too.

Hierarchy (emphasize by de-emphasizing)
- One primary action per screen, the only accent-colored thing on it. Everything else is secondary or quieter.
- The most important number reads as a full sentence: what to do, how many, today.
- Never stack more than one notice (welcome, warning, prompt) above the main action.

Flow and steps (reducing friction)
- Before adding a step, field or page, say what breaks without it. If nothing, don't add it.
- Prefer doing it in place over sending people to another page.
- Fill in sensible defaults, but the person decides their own goal: defaults are editable before they start.

First visit and coming back
- First visit: one question, one obvious first action, and one line saying what happens when you tap.
- Coming back is faster than the first visit: what they do most comes first, before any message.
- Reward right away: finishing today's number gets a visible celebration, not just a line of text.
- Ask for permissions (notifications, calendar) only after the person has done something useful.

Consistent components
- The same action looks the same on every page (Edit, Add a goal, Back). Build it once as a shared component.
- Removing one item uses Undo; replacing or deleting everything uses Confirm.

Checking and working together
- Don't say it's done until it's checked in the browser at 390px and 1440px, keyboard only, with the console clear.
- Check text contrast meets WCAG AA (4.5:1 text, 3:1 controls) for every color pair you add.
- Work one flow stage at a time with the user. Show the current steps, ask, then change only what was agreed. Never redesign several stages at once.

## Rules
- Next.js + Tailwind. Data lives in localStorage only: no database, accounts, backend or external APIs. Push back on packages we don't need.
- The app cannot push when the page is closed. Calendar files (.ics, generated in the browser) are the only off-page reminder; they cannot know whether today is done. Say so honestly in the UI and README.
- Forms: one column, a real label on every field, errors next to the field saying what to do next, keep what the person typed.
- Shared components (Button, Field, Input...) used everywhere. Keyboard access, real labels, contrast checked.
- Every step is discussed and approved by the user before it is built. Small fixes to approved work are fine.
- Log every request, push-back and decision in `log.md` (Chinese). Pages, code and this file stay in English.
- Commits: one small step each; add files by name, never `git add -A`.
