"use client";

import { GoalWizard } from "@/components/onboarding/GoalWizard";

/** The first visit: Titi walks you to your first goal and your first task, one tap per screen. */
export function FirstVisit() {
  return <GoalWizard firstVisit />;
}
