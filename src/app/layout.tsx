import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DESCRIPTION, GA_MEASUREMENT_ID, IUBENDA_WIDGET_URL, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import { hasPosts } from "@/lib/blog";

// Self-hosted at build time: the browser never asks Google Fonts for them.
const display = Cinzel({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-cinzel", display: "swap" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

/** gtag.js setup, run by iubenda only once the visitor accepts measurement (purpose 4). */
const GA_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`;

export const viewport: Viewport = {
  themeColor: "#0f1c2e",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "internal developer platform",
    "platform engineering",
    "GitOps",
    "Argo CD",
    "Kubernetes",
    "AI agents",
    "incident response",
    "SRE game",
    "gamification",
    "city builder",
  ],
  openGraph: {
    title: `${SITE_NAME} · ${TAGLINE}`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} · ${TAGLINE}`,
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The Blog entry appears once the CMS has a published post.
  const showBlog = await hasPosts();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* iubenda first, synchronous: its banner keeps the consent and blocks trackers until the visitor accepts. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={IUBENDA_WIDGET_URL} />
        {/* Google Analytics, inert (type text/plain) until iubenda activates it on consent to measurement (purpose 4).
            Client-side navigations are counted by the property's enhanced measurement. */}
        <script
          type="text/plain"
          className="_iub_cs_activate"
          data-iub-purposes="4"
          data-suppressedsrc={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          async
        />
        <script
          type="text/plain"
          className="_iub_cs_activate-inline"
          data-iub-purposes="4"
          dangerouslySetInnerHTML={{ __html: GA_INIT }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navigation showBlog={showBlog} />
        <main className="pt-16 flex-grow">{children}</main>
        <Footer showBlog={showBlog} />
      </body>
    </html>
  );
}
