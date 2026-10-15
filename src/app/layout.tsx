import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

/*
 * Shared faces are not preloaded: the portfolio (`/`, `/cv`) never uses them,
 * and a preload is fetched at high priority on every route whether or not the
 * page paints with it. Pages that do use them still load them via CSS with
 * `font-display: swap`. Same files and options the `geist` package ships, minus
 * the preload.
 */
const GeistSans = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: false,
});

const GeistMono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
  weight: "100 900",
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yenus.dev"),
  icons: {
    icon: [{ url: "/brand/yenson-umana-icon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/yenson-umana-icon.svg",
    apple: [
      {
        url: "/brand/yenson-umana-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  title: {
    default: "Yenson Umaña · Senior AI Solution Architect",
    template: "%s · Yenson Umaña",
  },
  description:
    "Senior AI Solution Architect building production agentic AI systems and Azure migrations. Portfolio, experience, and CV.",
  openGraph: {
    title: "Yenson Umaña · Senior AI Solution Architect",
    description:
      "Production agentic AI systems, Azure migrations, and architecture judgement. Portfolio and CV.",
    url: "https://yenus.dev",
    siteName: "Yenson Umaña",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yenson Umaña · Senior AI Solution Architect",
    description:
      "Production agentic AI systems, Azure migrations, and architecture judgement. Portfolio and CV.",
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
