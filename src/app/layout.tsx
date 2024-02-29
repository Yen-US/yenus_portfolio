import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from 'geist/font/sans'

export const metadata: Metadata = {
  title: "YenUS Portfolio",
  description: "Yenson Umaña, Full Stack developer, site made with Next.js, Tailwind CSS, and TypeScript by YenUS", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable
        )}
      >
        <div className="fixed top-0 z-[-2] h-screen w-full bg-[radial-gradient(circle_600px_at_50%_40%,#C9EBFF,transparent)] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
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
