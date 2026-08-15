import type { Metadata } from "next";
import { Tiro_Devanagari_Hindi, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const tiro = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "कैसेट — songs that never left the tape",
  description:
    "Ambient radio for 2000s–2010s Hindi hits. KK, Mika, Arijit, Jubin, Papon and more — playing through YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${tiro.variable} ${syne.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
