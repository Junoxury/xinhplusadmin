import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SideMenu } from '@/components/layout/side-menu'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xinh+ Admin",
  description: "성형관리 어드민 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background antialiased"
      )}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen">
              <SideMenu isCollapsed={false} />
              <div className="flex-1 flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
