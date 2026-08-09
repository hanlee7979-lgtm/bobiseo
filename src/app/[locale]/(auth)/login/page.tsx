'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getRedirectResult } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { signInWithGoogle } from '@/lib/auth/signIn'

const ERROR_KEYS: Record<string, 'popupBlocked' | 'network'> = {
  'auth/popup-blocked': 'popupBlocked',
  'auth/network-request-failed': 'network',
}

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const [error, setError] = useState<'popupBlocked' | 'network' | null>(null)
  const [pending, setPending] = useState(false)

  function goNext(needsOnboarding: boolean) {
    if (needsOnboarding) {
      router.replace(`/${params.locale}/onboarding`)
      return
    }
    router.replace(searchParams.get('next') || `/${params.locale}`)
  }

  async function completeRedirectSignIn() {
    const result = await getRedirectResult(auth)
    if (!result) return false
    const idToken = await result.user.getIdToken()
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    const { needsOnboarding } = await res.json()
    goNext(needsOnboarding)
    return true
  }

  async function handleSignIn() {
    setError(null)
    setPending(true)
    try {
      if (await completeRedirectSignIn()) return
      const result = await signInWithGoogle()
      if (!result) return // signInWithRedirect 폴백 진행 중 — 페이지가 곧 이동한다
      goNext(result.needsOnboarding)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_KEYS[code] ?? 'network')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="rounded-chip bg-accent text-label text-accent-on px-6 py-3 disabled:opacity-50"
      >
        {t('signInWithGoogle')}
      </button>
      {error && <p className="text-caption text-danger">{t(`error.${error}`)}</p>}
    </main>
  )
}
