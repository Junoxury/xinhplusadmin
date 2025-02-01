import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
          <CardContent>
            <form action="/api/auth/login" method="POST">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="password"
                    placeholder="비밀번호"
                    type="password"
                    autoComplete="current-password"
                  />
                </div>
                <Button className="w-full">
                  로그인
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 