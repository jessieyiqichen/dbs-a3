# Nudge

A goal pusher for students in recruiting season. The tasks that matter but you keep putting off (LinkedIn connections, applications, coffee chats, interview practice) become one number for today, and Titi the cat pushes you to start with just one: every one you finish is a fish treat for her.

Design, Build, Ship · Assignment 3 (Patterns & Flows).

- **Live:** [dbs-a3.vercel.app](https://dbs-a3.vercel.app)
- **Flows:** [flows.md](flows.md) (first visit, the main task, coming back, managing goals)
- **Every state:** [docs/states.png](docs/states.png)
- **Onboarding research:** [research.md](research.md) (Beeminder, Duolingo, Finch)
- **Decision log (Chinese):** [log.md](log.md) · **Agent rules:** [AGENTS.md](AGENTS.md)

## The main task

> I pick a goal → it tells me today's number and I do the first one now → if I haven't started, it nudges me again (and again) → I come back and see how close I am.

## The three flows

| Flow | What happens | Where |
|---|---|---|
| First visit | Titi asks one thing per screen, every answer is a tap: what you've been putting off, by when, how many (each choice shown as fish treats a day), then today's plan and the first task right away. Nothing to read, no empty screen, no sign-up. | `/` with nothing saved; the same walk is "+ Add" later |
| Main task | Today is Titi's room: the painted window changes with the hour, this week's bowls stand on a shelf, Titi waits in her bed. Pick which goal is up now, tap Start (the page opens in a new tab), come back and tap the last fish you finished. Each log sends a fish into Titi's bowl; reaching today's number ends in a results screen whose three cards count up. | `/` |
| Coming back | It remembers: your goals, the streak (one for the whole app, with a forgiven rest day a week), what you did this week. A warm line says why today's number is what it is. Reminders come two ways: a calendar file that works when Nudge is closed, and browser notifications that stop once you've started. | `/`, `/reminders` |

![Every state of every page](docs/states.png)

## Design decisions

- **Encourage, don't remove the push.** The app still pushes people to finish, always by cheering them on. Nudges get firmer through the day but never shame; a missed deadline leads with progress ("10 of 100, nice work!") and then the next step.
- **Fish treats go to Titi, numbers go to the goal.** The streak, the week of bowls and the session bowl are shared by every goal; the daily number, Titi's road (a by-date goal) and Titi's diary (a daily goal) belong to one goal. Today shows this as three layers: hers, yours (the goal tabs), the goal's.
- **Painted pieces are never stitched.** The window, the bowls and Titi each stand alone on plain interface, never laid over another painting; Titi keeps her drawn frame animations. (An earlier version composited everything into one room and looked pasted.)
- **Clay, not outlines.** A warm light page where the few things you act on are saturated and chunky (a highlight on top, a solid lip underneath, pressing sinks it), everything else quiet.
- **No full stops in the interface.** Encouraging lines end with "!", easygoing ones with "~"; errors and labels take no end punctuation. A test enforces it.
- **Undo beats confirm.** Removing a goal happens at once and Goals offers Undo; only replacing everything from a backup asks first.
- **Simplicity.** Navigation is Today and Goals. Reminders are reached from Goals and from the done screen. Adding a goal is the same walk as the first visit, so there is one way to make a goal.

Research behind these choices: [research.md](research.md), and a study of Duolingo's structure (a path home, a persistent streak, lesson-complete metrics), visuals and voice.

## Accessibility

- Every page and error state was checked with axe-core (WCAG 2.2 AA + best practices): 0 violations across 16 pages and states.
- Keyboard only: the whole first visit, a session from Start to done, and Undo were walked with Tab and Enter; focus moves to each new screen's heading.
- Text contrast, checked pair by pair: ink 13.4:1 and muted 5.7:1 on the page; ink on mint 5.7:1, on honey 7.0:1, on sky 5.6:1; control edges 3.6:1; the error berry 6.7:1.
- Every field has a visible label; every action is a real button or link; the drawn animations fall back to stills under `prefers-reduced-motion`, and the count-ups, hops and hearts stop.

## Build and check

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest, 128 tests (quota, streak, nudges, copy rules, onboarding, undo)
npm run build
```

Data is saved only in this browser (localStorage). No accounts, database or APIs. Next.js 16, Tailwind CSS 4, deployed on Vercel.

## Credits

- Titi, her bowls and the window paintings were generated with GPT from photos and prompts by the author, then cut out and assembled here (see [log.md](log.md) for every prompt and decision).
- Fonts: Fredoka and Nunito (Google Fonts).
- Built by directing Claude Code; the decision log records what was asked, what was proposed and what was chosen, in Chinese.
