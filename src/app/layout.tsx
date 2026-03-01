import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
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
  title: {
    default: "Workitu Tech | AI Automation Consulting",
    template: "%s | Workitu Tech",
  },
  description:
    "We audit your workflows, find where AI saves time and money, and build the solution. Free pilot project — real results, zero risk.",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: "Workitu Tech | AI Automation Consulting",
    description:
      "AI automation that saves businesses hours of repetitive work.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workitu Tech | AI Automation Consulting",
    description:
      "AI automation that saves businesses hours of repetitive work.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Workitu Tech",
  description: siteConfig.description,
  url: siteConfig.url,
  founder: {
    "@type": "Person",
    name: siteConfig.author,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.links.email,
    contactType: "customer service",
  },
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "1500",
    offerCount: "4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
