import { describe, expect, it } from "vitest";
import { STARTERS, draftFromStarter } from "./starters";

describe("starters", () => {
  it("offers four recruiting tasks", () => {
    expect(STARTERS.map((s) => s.label)).toEqual(["LinkedIn connections", "Job applications", "Coffee chats", "Interview practice"]);
  });

  it("drafts LinkedIn as 500 by a deadline 45 days out, so it's never in the past", () => {
    expect(draftFromStarter(STARTERS[0], "2026-10-17")).toEqual({
      verb: "Send", unit: "connection requests", type: "by-date", target: "500", deadline: "2026-12-01",
      link: "https://www.linkedin.com/mynetwork/grow/",
    });
  });

  it("drafts coffee chats as people to message each day", () => {
    expect(draftFromStarter(STARTERS[2], "2026-10-17")).toMatchObject({ verb: "Message", type: "daily", target: "2", deadline: "" });
  });
});
