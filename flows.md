# Flows

Main task, as one sentence:

> I pick a goal → it tells me today's number and I do the first one now → if I haven't started, it nudges me again (and again) → I come back and see how close I am.

## 1. First visit: useful right away

```mermaid
flowchart TD
    A([Open the app, nothing saved]) --> B["/ : What have you been putting off?"]
    B -->|Tap an example| C[Goal created with sensible defaults]
    B -->|Write my own| F["/goals/new form"]
    C --> D["Today's number: 11 connections"]
    D -->|Open LinkedIn| L[LinkedIn opens in a new tab]
    L --> E
    D -->|Tap +1| E[Day started. Progress moves]
    E --> R{"Nice, that's day one. Want me to nudge you tomorrow?"}
    R -->|Set up nudges| N["/reminders: times, calendar file, notifications"]
    R -->|Not now| T([Stays on Today, prompt hidden])
    S[(localStorage unavailable)] -.-> W[Banner: this browser won't save]
```

## 2. The form and its errors

```mermaid
flowchart TD
    A["/goals/new"] --> B[Fill in: What, Type, Target, Unit, Deadline, Link]
    B --> C{Submit}
    C -->|What empty| E1["Enter what you want to do"]
    C -->|Target not a whole number| E2["Enter a whole number, like 500"]
    C -->|Deadline today or earlier| E3["Pick a date after today"]
    C -->|Link not https| E4["Paste a full link that starts with https://"]
    E1 & E2 & E3 & E4 --> K[Errors beside each field, typed values kept, focus on the first error]
    K --> B
    C -->|Valid but over 50 a day| W[Soft warning: pick a later date or a smaller number?]
    W -->|Keep it| OK
    W -->|Change| B
    C -->|Valid| OK[Saved] --> T(["/ : today's number for the new goal"])
```

## 3. The daily task

```mermaid
flowchart TD
    A([Open the app]) --> B[Most urgent goal, big: today's number + a nudge line]
    B -->|Open link| L[Do it in the other tab]
    L --> C
    B --> C{Log it}
    C -->|+1| D[Count goes up, toast with Undo]
    C -->|Log several| M[Enter a number] --> D
    D -->|Undo| B
    D --> S{"Today's state (a started goal stays on top until it's done)"}
    S -->|Started, not done| B2[Still counts as a day. Keep going]
    S -->|Quota done| G[Done for today. Next goal moves up]
    S -->|Target reached| Z[Goal complete]
```

## 4. Coming back: it remembers

```mermaid
flowchart TD
    N1[Calendar alarm: 10:00, 15:00, 20:00] --> O([Open the app])
    N2["Browser notification while a tab is open: only if not started, plus a 22:30 last call"] --> O
    N1 -->|Tapped the reminder| F["You came back. That's the hardest part."]
    O --> Q{Since the last day you did something}
    Q -->|Yesterday| A["Welcome back. 3 days in a row. Today: 11 connections."]
    Q -->|One day missed, first this week| R["Yesterday was your rest day this week, so your streak is safe."]
    Q -->|Several days| B["It's been 4 days, and that's okay. It's spread over the days left."]
    Q -->|Paused| P[No nudges, not counted as behind]
    F & A & R & B --> T[Do one now]
    O --> H["/goals/:id : progress line vs plan, streak, history"]
```

## Pages and navigation

| Route | Step |
|---|---|
| `/` | First visit, daily task, coming back |
| `/goals/new`, `/goals/[id]/edit` | The form |
| `/goals` | All goals, pause, delete, backup |
| `/goals/[id]` | Progress for one goal |
| `/reminders` | Calendar file and browser notifications |

Shared navigation: Today · Goals · Reminders. Sub-pages have a Back link.
