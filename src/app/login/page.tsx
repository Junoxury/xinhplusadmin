import { Metadata } from "next"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "./client-login-form"

export const metadata: Metadata = {
  title: "Xinh+ 관리자",
  description: "Xinh+ 관리자 로그인",
}

export default function LoginPage() {
  return (
    <div 
      className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0"
      style={{
        backgroundImage: 'url("/images/login-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-purple-950/50" /> {/* 어두운 오버레이 */}
      <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Xinh+ 관리자</CardTitle>
            <CardDescription>
              관리자 계정으로 로그인해주세요
            </CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </div>
  )
} 