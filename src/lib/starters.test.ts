import { describe, expect, it } from "vitest";
import { STARTERS } from "./starters";

describe("starters", () => {
  it("offers four recruiting tasks", () => {
    expect(STARTERS.map((s) => s.label)).toEqual(["LinkedIn connections", "Job applications", "Coffee chats", "Interview practice"]);
  });

  it("makes LinkedIn a total by a date and the rest a number each day", () => {
    expect(STARTERS.map((s) => s.type)).toEqual(["by-date", "daily", "daily", "daily"]);
  });

  it("opens the right LinkedIn page for connections and coffee chats", () => {
    expect(STARTERS[0].link).toBe("https://www.linkedin.com/mynetwork/grow/");
    expect(STARTERS[2]).toMatchObject({ verb: "Message", link: "https://www.linkedin.com/messaging/" });
  });
});
