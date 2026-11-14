import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import { hasPosts } from "@/lib/blog";

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
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navigation showBlog={showBlog} />
        <main className="pt-16 flex-grow">{children}</main>
        <Footer showBlog={showBlog} />
      </body>
    </html>
  );
}
