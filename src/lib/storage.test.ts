import { beforeEach, describe, expect, it } from "vitest";
import { emptyData, loadData, parseData, saveData, STORAGE_KEY } from "./storage";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.get(key) ?? null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
}

describe("storage", () => {
  let storage: MemoryStorage;
  beforeEach(() => { storage = new MemoryStorage(); });

  it("starts empty when nothing is saved", () => {
    expect(loadData(storage)).toEqual({ ok: true, data: emptyData() });
  });

  it("round-trips saved data", () => {
    const data = { ...emptyData(), lastVisit: "2026-10-17" };
    expect(saveData(data, storage)).toBe(true);
    expect(loadData(storage)).toEqual({ ok: true, data });
  });

  it("reports corrupt data and keeps the raw text", () => {
    storage.setItem(STORAGE_KEY, "{not json");
    expect(loadData(storage)).toEqual({ ok: false, reason: "corrupt", raw: "{not json" });
  });

  it("reports unavailable storage", () => {
    expect(loadData(null)).toEqual({ ok: false, reason: "unavailable" });
    expect(saveData(emptyData(), null)).toBe(false);
  });

  it("rejects data with the wrong shape", () => {
    expect(parseData(JSON.stringify({ version: 1, goals: "nope" }))).toBeNull();
    expect(parseData(JSON.stringify({ ...emptyData(), goals: [{ id: 1 }] }))).toBeNull();
  });
});

describe("storage: older saved data", () => {
  it("fills in settings added later", () => {
    const old = { ...emptyData(), settings: { reminderTimes: ["10:00"], notificationsOn: false } };
    const parsed = parseData(JSON.stringify(old));
    expect(parsed?.settings).toEqual({ reminderTimes: ["10:00"], notificationsOn: false, nudgesSetUp: false, nudgePromptSnoozedOn: null, streakTipSeen: false, calendarUntil: null });
    expect(parsed?.session).toBeNull();
  });

  it("keeps a snooze date, drops anything else, and lets an old forever-\"Not now\" ask again", () => {
    const snoozed = { ...emptyData(), settings: { ...emptyData().settings, nudgePromptSnoozedOn: "2026-10-19" } };
    expect(parseData(JSON.stringify(snoozed))?.settings.nudgePromptSnoozedOn).toBe("2026-10-19");
    const junk = { ...emptyData(), settings: { ...emptyData().settings, nudgePromptSnoozedOn: "soon" } };
    expect(parseData(JSON.stringify(junk))?.settings.nudgePromptSnoozedOn).toBeNull();
    const old = { ...emptyData(), settings: { reminderTimes: ["10:00"], notificationsOn: false, nudgePromptDismissed: true } };
    expect(parseData(JSON.stringify(old))?.settings.nudgePromptSnoozedOn).toBeNull();
  });

  it("gives older goals an empty verb", () => {
    const goal = { id: "g", title: "Apply to jobs", unit: "applications", type: "daily", target: 10, deadline: null, link: null, startDate: "2026-10-17", pauses: [], createdAt: "" };
    expect(parseData(JSON.stringify({ ...emptyData(), goals: [goal] }))?.goals[0].verb).toBe("");
  });
});
