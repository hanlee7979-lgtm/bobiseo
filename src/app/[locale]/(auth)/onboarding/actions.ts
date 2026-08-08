'use server'

import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { requireSession } from '@/lib/auth/session'
import type { Role } from '@/types/user'

export async function setRole(role: Role) {
  const { uid } = await requireSession()
  const ref = adminDb.collection('users').doc(uid)
  const snap = await ref.get()
  if (snap.data()?.role) throw new Error('ROLE_ALREADY_SET')

  await ref.update({ role, onboardedAt: new Date(), updatedAt: new Date() })

  const user = await adminAuth.getUser(uid)
  await adminAuth.setCustomUserClaims(uid, { ...user.customClaims, role })
}
