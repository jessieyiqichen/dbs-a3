import { describe, expect, it } from "vitest";
import { pageChoices } from "./pages";

describe("pageChoices: the pages offered on the link step", () => {
  it("offers the LinkedIn page that fits the goal, then Handshake", () => {
    expect(pageChoices("linkedin").map((c) => c.link)).toEqual(["https://www.linkedin.com/mynetwork/grow/", "https://app.joinhandshake.com/"]);
    expect(pageChoices("coffee")[0].link).toBe("https://www.linkedin.com/messaging/");
    expect(pageChoices("applications")[0].link).toBe("https://www.linkedin.com/jobs/");
    expect(pageChoices("interview")[0].link).toBe("https://www.linkedin.com/");
    expect(pageChoices(null)[0].link).toBe("https://www.linkedin.com/");
  });

  it("shows the link without its scheme as the second line", () => {
    expect(pageChoices("linkedin").map((c) => c.detail)).toEqual(["linkedin.com/mynetwork/grow", "app.joinhandshake.com"]);
  });
});
