import { RegisterForm } from '@/components/admin/register-form'

export default function RegisterPage() {
  return (
    <div className="container mx-auto max-w-[480px] pt-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">관리자 신청</h1>
        <p className="text-center text-muted-foreground mt-2">
          관리자 계정 생성을 위해 아래 정보를 입력해주세요
        </p>
      </div>
      <RegisterForm />
    </div>
  )
} 