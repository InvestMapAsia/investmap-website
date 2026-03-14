import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Providers } from "@/components/providers";

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-main-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-main-serif",
});

export const metadata: Metadata = {
  title: "Alatau City Invest",
  description:
    "Premium multilingual investment platform for land plots in Alatau City with map, analytics, AI assistant, owner and investor cabinets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
