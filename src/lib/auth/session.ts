import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'
import type { Role } from '@/types/user'

export async function getSession() {
  const cookie = (await cookies()).get('__session')?.value
  if (!cookie) return null
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true)
    return {
      uid: decoded.uid,
      email: (decoded.email as string | undefined) ?? null,
      role: (decoded.role ?? null) as Role | null,
      isAdmin: decoded.admin === true,
    }
  } catch {
    return null
  }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHENTICATED')
  return session
}

export async function requireAdmin() {
  const session = await requireSession()
  if (!session.isAdmin) throw new Error('FORBIDDEN')
  return session
}
