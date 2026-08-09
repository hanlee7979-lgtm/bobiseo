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

export interface SignInResult {
  cred: UserCredential
  needsOnboarding: boolean
}

async function createServerSession(idToken: string): Promise<{ needsOnboarding: boolean }> {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('SESSION_CREATE_FAILED')
  return res.json()
}

export async function signInWithGoogle(): Promise<SignInResult | void> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  try {
    const cred = await signInWithPopup(auth, provider)
    const idToken = await cred.user.getIdToken()
    const { needsOnboarding } = await createServerSession(idToken)
    return { cred, needsOnboarding }
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code && REDIRECT_FALLBACK_CODES.includes(code)) {
      await signInWithRedirect(auth, provider)
      return
    }
    throw err
  }
}
