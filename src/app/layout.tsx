import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yenus.dev"),
  title: {
    default: "Yenson Umaña — Senior AI Solution Architect",
    template: "%s — YenUS",
  },
  description:
    "Senior AI Solution Architect at Microsoft. Founder of Presencia Studio. Architecting agentic systems for startups — available for advisory and consulting.",
  openGraph: {
    title: "Yenson Umaña — Senior AI Solution Architect",
    description:
      "Architecting agentic systems at Microsoft. Founder @ Presencia Studio. Available for advisory engagements.",
    url: "https://yenus.dev",
    siteName: "YenUS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
          instrumentSerif.variable
        )}
        style={
          {
            "--font-sans": "var(--font-geist-sans)",
            "--font-mono": "var(--font-geist-mono)",
          } as React.CSSProperties
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
