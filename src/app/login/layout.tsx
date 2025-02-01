import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"
import { Providers } from '@/app/providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Xinh+ 관리자 로그인",
  description: "Xinh+ 관리자 로그인",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full fixed inset-0">
      {children}
    </div>
  )
} 