import type { TodayPlan } from "@/lib/quota";
import type { BowlDay } from "@/lib/scene";
import type { Goal } from "@/lib/types";

/** A real-looking goal for the specimens, in Nudge's own words. */
export const SAMPLE_GOAL: Goal = {
  id: "sample",
  verb: "Send",
  title: "Send connection requests",
  unit: "connection requests",
  type: "by-date",
  target: 150,
  deadline: "2026-11-18",
  link: "https://www.linkedin.com/mynetwork/grow/",
  startDate: "2026-10-12",
  pauses: [],
  createdAt: "2026-10-12T09:00:00.000Z",
};

export const SAMPLE_PLAN: TodayPlan = { quota: 5, doneToday: 2, leftToday: 3, doneTotal: 38, daysLeft: 31, behindBy: 0, status: "started" };

const DAYS = ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"];
const FILLS: BowlDay["fill"][] = ["full", "some", "full", "empty", "full", "full", "some"];

export const SAMPLE_WEEK: BowlDay[] = DAYS.map((date, i) => ({ date, fill: FILLS[i], today: i === 6, future: false, before: false }));
