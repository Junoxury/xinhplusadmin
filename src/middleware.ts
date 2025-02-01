import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 세션 체크
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 공개 경로 목록 (로그인하지 않아도 접근 가능한 경로)
  const publicPaths = ['/login']
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname)

  // 로그인이 필요한 페이지에 접근하려 할 때 세션이 없는 경우
  if (!session && !isPublicPath) {
    const url = new URL('/login', req.url)
    url.searchParams.set('message', '로그인이 필요합니다')
    return NextResponse.redirect(url)
  }

  // role이 admin이 아닌 경우 처리
  if (session?.user && session.user.role !== 'admin' && !isPublicPath) {
    // 로그아웃 처리
    await supabase.auth.signOut()
    const url = new URL('/login', req.url)
    url.searchParams.set('message', '관리자 권한이 필요합니다')
    return NextResponse.redirect(url)
  }

  // 이미 로그인된 상태에서 로그인 페이지에 접근하려는 경우
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// 미들웨어가 실행될 경로 설정
export const config = {
  // 다음 경로들은 미들웨어 실행에서 제외
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
} 