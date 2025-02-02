'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('로그인 시도:', { email })

    try {
      // 1. 로그인 시도
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('인증 결과:', { 
        user: authData?.user,
        metadata: authData?.user?.user_metadata,
        error: authError 
      })

      if (authError) throw authError

      // 2. user_metadata에서 role 확인
      const userRole = authData.user?.user_metadata?.profile?.role
      
      console.log('권한 확인:', { 
        role: userRole,
        hasAccess: userRole && ['admin', 'super_admin'].includes(userRole)
      })

      if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
        throw new Error('관리자 권한이 없습니다.')
      }

      // 3. 로그인 성공 및 권한 확인 완료
      toast.success('로그인되었습니다')
      
      router.push('/dashboard')
      router.refresh()

    } catch (error) {
      console.error('로그인 오류:', error)
      toast.error(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </CardContent>
  )
} 