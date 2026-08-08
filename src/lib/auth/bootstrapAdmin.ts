import 'server-only'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

// 최초 관리자를 만들 방법이 없으므로, 환경변수 화이트리스트로 최초 1회만 승격한다 (docs/03 §4.2).
export async function applyBootstrapAdmin(uid: string, email?: string | null) {
  const allowList = (process.env.ADMIN_BOOTSTRAP_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  if (!email || !allowList.includes(email.toLowerCase())) return

  const user = await adminAuth.getUser(uid)
  await adminAuth.setCustomUserClaims(uid, { ...user.customClaims, admin: true })
  await adminDb.collection('users').doc(uid).update({ isAdmin: true })
}
