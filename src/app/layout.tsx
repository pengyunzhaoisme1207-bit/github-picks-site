import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: "Weekly curated GitHub projects with use cases, difficulty ratings, and editor's notes. Discover open source tools for real people.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
