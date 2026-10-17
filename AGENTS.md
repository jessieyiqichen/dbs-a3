<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nudge (working title) · DBS Assignment 3 (Patterns & Flows)

## What and for whom
- A goal pusher for things that matter but you don't enjoy, so you keep putting them off: 500 LinkedIn connections this job season, applications every day, practice problems.
- The user is a student in recruiting season. The tool is proactive: it tells you today's number, pushes you to start, and nudges you again (encouraging, never shaming) until you do. No chat.
- Main flow: I set a goal (e.g. 500 connections by a date) → every day it tells me today's number and pushes me to start → if I haven't, it nudges me again → I come back and see how close I am.

## Decisions so far (user-approved)
- Generic cumulative goals, not LinkedIn-only. LinkedIn 500 is the first-visit example.
- A big goal is split into a daily quota (remaining / days left); falling behind raises tomorrow's quota, and the app says why.
- "Forcing a start": the home screen shows only today's number and one big "do one now" action.
- Tone and look: warm and motivating (user, 2026-10-17). Nudges get more direct through the day when nothing is done, but never shame. The visual style should feel warm too.
- A goal you have started stays on top until it is done, so it never jumps away mid-task.

## Rules
- Next.js + Tailwind. Data lives in localStorage only: no database, accounts, backend or external APIs. Push back on packages we don't need.
- The app cannot push when the page is closed. Calendar files (.ics, generated in the browser) are the only off-page reminder; they cannot know whether today is done. Say so honestly in the UI and README.
- Forms: one column, a real label on every field, errors next to the field saying what to do next, keep what the person typed.
- Shared components (Button, Field, Input...) used everywhere. Keyboard access, real labels, contrast checked.
- Every step is discussed and approved by the user before it is built. Small fixes to approved work are fine.
- Log every request, push-back and decision in `log.md` (Chinese). Pages, code and this file stay in English.
- Commits: one small step each; add files by name, never `git add -A`.
