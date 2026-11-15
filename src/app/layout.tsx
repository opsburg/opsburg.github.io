import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DESCRIPTION, GA_MEASUREMENT_ID, IUBENDA_WIDGET_URL, SITE_NAME, SITE_URL, TAGLINE, X_HANDLE } from "@/lib/site";
import { hasPosts } from "@/lib/blog";
import { THEME_SCRIPT } from "@/lib/theme";

// The font files live in the repository (src/app/fonts, latin subset, OFL licensed):
// neither the visitor's browser nor the build ever asks Google Fonts for them.
const display = localFont({
  src: "./fonts/cinzel-latin.woff2",
  weight: "500 700",
  variable: "--font-cinzel",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 600",
  variable: "--font-inter",
  display: "swap",
});

/** gtag.js setup, run by iubenda only once the visitor accepts measurement (purpose 4). */
const GA_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f1c2e" },
    { media: "(prefers-color-scheme: light)", color: "#f6eedb" },
  ],
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
    site: X_HANDLE,
    title: `${SITE_NAME} · ${TAGLINE}`,
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The Blog entry appears once the CMS has a published post.
  const showBlog = await hasPosts();
  return (
    // The theme script sets data-theme before React hydrates, so the attribute differs from the server's
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Before anything else: applies the stored theme before the first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* iubenda next, synchronous: its banner keeps the consent and blocks trackers until the visitor accepts. */}
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
