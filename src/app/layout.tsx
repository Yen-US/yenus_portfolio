import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import StarField from "@/components/star-field";
import Footer from '@/components/footer'
import { GeistSans } from 'geist/font'

export const metadata: Metadata = {
  title: "YenUS Portfolio",
  description: "Made with Next.js, Tailwind CSS, and TypeScript by YenUS", 
};

export const geist = GeistSans

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
        <StarField>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Footer></Footer>
          </ThemeProvider>
          </StarField>
      </body>
    </html>
  );
}
