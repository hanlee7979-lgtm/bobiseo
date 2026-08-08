import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'

// 인증 가드는 M2에서 이 미들웨어에 합쳐진다 (docs/03 §5).
export default createIntlMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
