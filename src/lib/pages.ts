import { hostOf } from "./start";
import { STARTERS } from "./starters";

/** A page offered on the "Is there a page you'll work on?" step: common sites first, your own link after. */
export interface PageChoice {
  key: string;
  label: string;
  link: string;
  /** The link without its scheme, for the second line of the choice. */
  detail: string;
}

const HANDSHAKE = "https://app.joinhandshake.com/";
const LINKEDIN = "https://www.linkedin.com/";
/** The LinkedIn page that fits a preset without its own LinkedIn suggestion. */
const LINKEDIN_FOR: Record<string, string> = { applications: "https://www.linkedin.com/jobs/" };

function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** LinkedIn (the page that fits this goal) and Handshake, offered as taps; the person may still type any link. */
export function pageChoices(starterKey: string | null): PageChoice[] {
  const starter = STARTERS.find((s) => s.key === starterKey);
  const linkedin = starter?.link && hostOf(starter.link) === "linkedin.com" ? starter.link : (starterKey && LINKEDIN_FOR[starterKey]) || LINKEDIN;
  return [
    { key: "linkedin", label: "LinkedIn", link: linkedin, detail: shortUrl(linkedin) },
    { key: "handshake", label: "Handshake", link: HANDSHAKE, detail: shortUrl(HANDSHAKE) },
  ];
}
