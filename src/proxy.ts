import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/lib/i18n/routing'

const intl = createIntlMiddleware(routing)

// middleware는 Edge에서 돌아 Admin SDK를 못 쓴다. 쿠키 존재 여부만 확인하고,
// 실제 세션/역할 검증은 서버 컴포넌트(getSession)와 Security Rules에서 한다 (docs/03 §4.3).
const PROTECTED = ['/crm', '/home', '/store', '/feed', '/admin', '/onboarding']

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsAuth = PROTECTED.some((p) => pathname.includes(p))

  if (needsAuth && !req.cookies.get('__session')) {
    const url = req.nextUrl.clone()
    url.pathname = `/${routing.defaultLocale}/login`
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return intl(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
