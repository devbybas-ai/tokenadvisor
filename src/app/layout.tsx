import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BUSINESS, SITE_URL, getAllKeywords } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | AI Token Cost Tracking`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  keywords: getAllKeywords(),
  authors: [{ name: BUSINESS.owner }],
  creator: BUSINESS.owner,
  publisher: BUSINESS.owner,
  alternates: { canonical: SITE_URL },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | AI Token Cost Tracking`,
    description: BUSINESS.description,
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "TokenAdvisor - Real-time AI token usage and cost tracking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | AI Token Cost Tracking`,
    description: BUSINESS.description,
    images: ["/images/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
