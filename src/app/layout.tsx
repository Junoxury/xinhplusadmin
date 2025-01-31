import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminLayout from "@/components/layout/admin-layout";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

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
        <ThemeProvider>
          <AdminLayout>{children}</AdminLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
