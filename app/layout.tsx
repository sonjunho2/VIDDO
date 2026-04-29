import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIDDO - AI Video Automation SaaS",
  description: "Create viral videos in seconds with AI scripts, voiceovers, subtitles, and auto-editing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
