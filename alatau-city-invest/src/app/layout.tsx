import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Providers } from "@/components/providers";

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
    <html lang="en">
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
