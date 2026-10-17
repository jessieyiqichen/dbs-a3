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
