# Flows

Main task, as one sentence:

> I pick a goal → it tells me today's number and I do the first one now → if I haven't started, it nudges me again (and again) → I come back and see how close I am.

A tool you use every day has three flows: the first visit, the main task, and coming back. Each page below is a route in Next.js; every step, state and error was drawn first and built second, then walked at 390px and 1440px (see `docs/states.png` for every state).

## 1. First visit: useful right away

Nothing is saved. One screen (after the teacher's "the page is the onboarding"): Titi waves and asks, one line says what Nudge does ("Pick one thing. Nudge breaks it into a few a day, and each one you do is a fish for Titi"), and three rows of one-tap answers come already picked (LinkedIn connections, in a month, steady), so today's number, its empty fish and "Start my first one" are on the first screen; on a phone they stay pinned to the foot of the screen (the fish are left out on short phones). Every tap updates the number. Job applications adds "Where do you apply?" (LinkedIn Jobs, Handshake, Indeed, no site). The same screen (`GoalWizard`) is "+ Add a goal" later, so a goal is always made the same way. On a desktop the questions are on the left and Titi, today's number and Start on the right.

```mermaid
flowchart TD
    A([Open the app, nothing saved]) --> P["One screen: Hi, I'm Titi! What have you been putting off?\nWhat · By when · How many, already picked\nToday: Send 5 connection requests today · Start my first one"]
    P -->|tap another answer| P
    P -->|Job applications| WH["Where do you apply? LinkedIn Jobs · Handshake · Indeed · No site"] --> P
    P -->|Something else| W["What will you do? (one field) · How often?"]
    W -->|Start with the field empty| WE["Enter what you'll do, like 'Send cold emails'\n(focus moves to the field)"] --> W
    P -->|Pick a date, or My own number| F["One field on the same screen"]
    F -->|not a date / not a number / 0| FE["Pick a date after today · Enter a whole number, like 150 · Enter a number above 0, like 150\n(scrolled above the pinned bar, focus on the field)"] --> F
    P -->|Start my first one| S["Session (flow 2)"]
    W -->|Start| S
    X[(localStorage unavailable)] -.-> XB["This browser can't save, so your goals will be gone when you close the tab"]
```

## 2. The main task: Today, the session, and the results

Today is Titi's room. On a phone: the window by the hour (with the streak), Titi on her mat with what she says in her bubble beside her, the goal tabs (the goal shown now is a flat label; the others are buttons that switch to them), the task and its one button, "Nudge you tomorrow?" in one row once anything has been logged, the road or diary link, and the week's bowls fixed at the foot of the screen with "Titi's week, 3 of 7 days". On a desktop the same things are on a 12-column grid: the task on the left seven columns, the window and Titi on the right five.

```mermaid
flowchart TD
    T([Today]) --> R["Titi's room: window by the hour · Titi and her bubble · this week's bowls (3 of 7 days)"]
    R --> G["Goal tabs: the goal shown now is a label, the others switch to theirs"]
    G --> B["Send 5 connection requests · Start (or Keep going once its session was opened)"]
    B -->|Start| S["/session: Send 5 connection requests today\nTiti cheering · a row of fish that fills (2 of 5 done)\nOpen LinkedIn ↗ is the green button until it is opened or one is logged, then I sent one"]
    S -->|I sent one| F["The next fish fills, Titi hops\nToast: Added 1 connection request · Undo"]
    S -->|Did several at once?| SV["How many did you do? +2 · +3 · +5 · All N, or type a number"]
    SV -->|letters, or 0| SE["Enter a whole number, like 5 · Enter a number above 0, like 5"] --> SV
    SV --> F
    F --> S
    S -->|← Today, or the browser's Back| T
    F -->|today's number reached| D["Done for today! N done, Titi is so proud!\nStreak · So far 56 of 150"]
    D -->|first goal finished today: See my streak| K["4-day streak! · this week's bowls\nNudge you tomorrow? (if not set up) · Back to Today"]
    D -->|another goal is left: Next| S
    K --> T2["Today, done: Titi is so full! See you tomorrow"]
```

The session is its own page: Start never opens a website; "Open LinkedIn ↗" in the session does, only when tapped. Leaving keeps the session, so Today says "Keep going". On Today, everything Titi says is in her bubble: a greeting on the day's first open, otherwise the day's nudge (gentle, then firmer, then one last call), and she naps and talks in her sleep until you start ("Zzz… one fish would wake me up").

## 3. Coming back: it remembers

```mermaid
flowchart TD
    C([Open the app again]) --> K{How did you get here?}
    K -->|tapped a reminder| N1["Titi stretches: You came back! That's the hardest part"]
    K -->|first open of the week| N0["Titi waves: Last week: 12 fish for Titi over 4 days!"]
    K -->|yesterday counted| N2["Titi waves: Welcome back · 3 days in a row!"]
    K -->|one day missed| N3["Welcome back · yesterday was a rest day (one a week is forgiven)"]
    K -->|three days or more| N4["Titi stretches: Welcome back! It's been 6 days, and that's okay\nThe rest is spread over 20 days, 7 today"]
    K -->|again the same day| N5["Titi naps and sleep-talks, or nudges if you've started"]
    N1 & N0 & N2 & N3 & N4 & N5 --> T([Today, flow 2])
    T -.->|second day, once| ST["Your streak lives here, 1 day! (under the streak)"]
    T -.->|after the first log, until set up| P["Nudge you tomorrow? Get calendar file · Not now (asks again tomorrow)"]
    T -.->|calendar file running out| CAL["Your calendar nudges end Oct 20, grab a new file → Reminders"]
    T -.->|a goal is on a break| BR["Paused until Oct 20, Titi is napping too (no nudge question)"]
    T -.->|date passed| DP["10 of 100, nice work! The date passed, pick a new one and keep going!"]
```

One streak for the whole app, like Duolingo's: a day counts when any goal got at least one, with one forgiven rest day a week. A reminder visit always opens with "You came back!", even on a Monday; last week's summary then waits for the next normal visit, and is said once a week.

## 4. Managing goals

```mermaid
flowchart TD
    GL([Goals]) --> C["Tap one to see progress, edit or remove\nA card per goal · + Add a goal · Reminder times · Backup"]
    C -->|tap| PR["Progress: the goal, where it stands, Titi's road or Titi's diary\nEdit goal · Take a break · Remove goal (one row)"]
    PR -->|Edit goal| E["Edit form: errors beside the field, cleared as you fix them\nSave changes · Remove goal"]
    E -->|Save changes| PRS["Progress, with a toast: Saved changes"]
    E -->|0 or letters| EE["Enter a number above 0, like 3 · Enter a whole number, like 3"] --> E
    PR -->|Take a break| BR["3 days · 1 week · 2 weeks · Never mind (brought into view)"] --> PR
    PR -->|Remove goal| U["Goals, with a toast: Removed X · Undo (8 s)"]
    U -->|Undo| GL
    GL -->|+ Add a goal| WZ["The first-visit screen (flow 1)"]
    GL -->|Reminder times| RM["Reminders: when Titi nudges you · calendar file (covers 14 days) · notifications"]
    GL -->|Backup| BK["Download a copy · Restore from a file (confirm, since it replaces everything)"]
    X([An unknown address]) --> NF["Titi can't find this page · Back to Today"]
```

On a desktop, Goals is list and detail on one page: the list on the left four columns, the chosen goal on the right eight. Editing a goal's number keeps the past: earlier days stay judged by the number they had. Removing one goal uses Undo; replacing everything from a backup uses a real confirm.

## Pages and navigation

| Route | Page | Shared pieces |
|---|---|---|
| `/` | First visit (nothing saved), then Today: Titi's room | `AppShell`, `Nav` (Today · Goals; hidden until the first goal exists), `GoalWizard`, `Pills`, `TodayHome`, `Room`, `CatArt`, `Coins`, `NudgePrompt`, `StreakChip`, `Toast` |
| `/session` | Working through today's number, then the results and the streak moment; Back returns to Today and keeps the session | `Session`, `Coins`, `Button`, `Field`, `DoneToday`, `NudgePrompt`, `Toast` |
| `/goals` | Your goals; on a desktop with the chosen goal beside the list | `GoalsScreen`, `GoalCard`, `ProgressScreen`, `BackupSection`, `Toast` |
| `/goals/new` | Add a goal: the same one screen as the first visit | `GoalWizard`, `Pills`, `Field` |
| `/goals/[id]` | A goal's progress (on a desktop, inside Goals) | `GoalView`, `ProgressScreen`, `Road` (by-date goal), `Diary` (daily goal), `GoalActions`, `Toast` |
| `/goals/[id]/edit` | Edit goal | `GoalSetup`, `Field`, `RadioGroup`, `RemoveGoalButton` |
| `/reminders` | Reminder times, calendar file, notifications | `TimesForm`, `CalendarCard`, `NotificationsCard` |
| any other address | Not found, with the way back to Today | `AppShell`, `CatArt`, `ButtonLink` |

Navigation holds only the core needs (Today, Goals); Reminders is reached from Goals, and Today and the streak moment ask "Nudge you tomorrow?" after the first log. Every page has a skip link, one `h1`, and the same header in the same place.
