import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Notifier } from "@/components/Notifier";
import "./globals.css";

// Fredoka for headings and Nunito for text, as in the A2 Trail Quest design system: round and friendly.
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Nudge",
  description: "Turns the thing you keep putting off into today's number, and nudges you until you start",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Notifier />
      </body>
    </html>
  );
}
