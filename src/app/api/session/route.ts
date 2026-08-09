export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { applyBootstrapAdmin } from '@/lib/auth/bootstrapAdmin'
import { DEFAULT_PALETTE } from '@/lib/theme/palette'

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000

export async function POST(req: Request) {
  const { idToken } = await req.json()
  const decoded = await adminAuth.verifyIdToken(idToken)

  const ref = adminDb.collection('users').doc(decoded.uid)
  const snap = await ref.get()
  let role: string | null = null

  if (!snap.exists) {
    await ref.set({
      uid: decoded.uid,
      email: decoded.email ?? '',
      displayName: decoded.name ?? '',
      photoURL: decoded.picture ?? null,
      role: null,
      isAdmin: false,
      locale: 'ko',
      themePreference: 'system',
      palette: DEFAULT_PALETTE,
      region: null,
      agentId: null,
      onboardedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
    await applyBootstrapAdmin(decoded.uid, decoded.email)
  } else {
    role = (snap.data()?.role as string | null) ?? null
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS })
  const cookieStore = await cookies()
  cookieStore.set('__session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: FIVE_DAYS_MS / 1000,
  })

  return Response.json({ ok: true, needsOnboarding: role === null })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('__session')
  return Response.json({ ok: true })
}
