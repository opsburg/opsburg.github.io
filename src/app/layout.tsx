import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";

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
    "DevOps game",
    "SRE game",
    "platform engineering",
    "city builder",
    "steampunk",
    "GitOps",
    "Argo CD",
    "Kubernetes",
    "incident response",
  ],
  icons: { icon: "/icon.svg" },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navigation />
        <main className="pt-16 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
