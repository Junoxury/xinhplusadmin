'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const registerFormSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 주소를 입력해주세요'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
  confirmPassword: z.string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  name: z.string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z.string()
    .min(1, '휴대폰 번호를 입력해주세요')
    .regex(/^(0|\+84)([35789])[0-9]{8}$/, '올바른 베트남 휴대폰 번호를 입력해주세요'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
})

type TRegisterForm = z.infer<typeof registerFormSchema>

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gender, setGender] = useState('male')
  
  const form = useForm<TRegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
    },
  })

  async function onSubmit(data: TRegisterForm) {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      // 1. Supabase Auth로 회원가입
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) {
        // Auth 에러 메시지 처리
        if (signUpError.message.includes('User already registered')) {
          throw new Error('이미 가입된 이메일 주소입니다')
        }
        if (signUpError.message.includes('Password')) {
          throw new Error('비밀번호가 보안 요구사항을 충족하지 않습니다')
        }
        if (signUpError.message.includes('Email')) {
          throw new Error('유효하지 않은 이메일 주소입니다')
        }
        throw signUpError
      }

      if (authData.user) {
        // 2. user_profiles 테이블에 추가 정보 저장
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            nickname: data.name,
            phone: data.phone,
            role: 'pending',
            gender: gender,
          })

        if (profileError) {
          // 프로필 저장 에러 처리
          if (profileError.code === '23505') {
            throw new Error('이미 등록된 전화번호입니다')
          }
          if (profileError.code === '23503') {
            throw new Error('사용자 계정 생성에 실패했습니다')
          }
          throw profileError
        }

        // 3. 성공 메시지 표시 및 로그인 페이지로 이동
        toast.success('관리자 신청이 완료되었습니다. 승인을 기다려주세요.')
        router.push('/login')
      }
    } catch (error) {
      console.error('Error:', error)
      // 에러 메시지 표시
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>휴대폰 번호 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="0912345678 또는 +84912345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성별 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                    />
                    남성
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                    />
                    여성
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">신청 중</span>
              <svg
                className="animate-spin h-4 w-4 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </>
          ) : (
            "신청하기"
          )}
        </Button>
      </form>
    </Form>
  )
} 