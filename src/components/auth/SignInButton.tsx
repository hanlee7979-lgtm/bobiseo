'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { signInWithGoogle } from '@/lib/auth/signIn'

const ERROR_KEYS: Record<string, 'popupBlocked' | 'network'> = {
  'auth/popup-blocked': 'popupBlocked',
  'auth/network-request-failed': 'network',
}

export function SignInButton() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [error, setError] = useState<'popupBlocked' | 'network' | null>(null)
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setError(null)
    setPending(true)
    try {
      const cred = await signInWithGoogle()
      if (cred) router.refresh()
      // cred가 없으면 signInWithRedirect 폴백이 진행 중 — 페이지가 곧 이동한다.
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_KEYS[code] ?? 'network')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-chip bg-accent text-label text-accent-on px-6 py-3 disabled:opacity-50"
      >
        {t('signInWithGoogle')}
      </button>
      {error && <p className="text-caption text-danger">{t(`error.${error}`)}</p>}
    </div>
  )
}
