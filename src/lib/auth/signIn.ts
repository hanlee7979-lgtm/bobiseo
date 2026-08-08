'use client'

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type UserCredential,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

const REDIRECT_FALLBACK_CODES = [
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
]

async function createServerSession(idToken: string) {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('SESSION_CREATE_FAILED')
}

export async function signInWithGoogle(): Promise<UserCredential | void> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  try {
    const cred = await signInWithPopup(auth, provider)
    const idToken = await cred.user.getIdToken()
    await createServerSession(idToken)
    return cred
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code && REDIRECT_FALLBACK_CODES.includes(code)) {
      await signInWithRedirect(auth, provider)
      return
    }
    throw err
  }
}
