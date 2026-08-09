'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { signInWithGoogle } from '@/lib/auth/signIn'
import { auth } from '@/lib/firebase/client'
import { ROLE_HOME } from '@/lib/auth/roleHome'
import { setRole } from '@/app/[locale]/(auth)/onboarding/actions'
import type { Role } from '@/types/user'

const ERROR_KEYS: Record<string, 'popupBlocked' | 'network'> = {
  'auth/popup-blocked': 'popupBlocked',
  'auth/network-request-failed': 'network',
}

const ROLES: Role[] = ['agent', 'merchant', 'consumer']

interface Session {
  email: string | null
  role: Role | null
  isAdmin: boolean
}

export function AuthHeaderControls({ session }: { session: Session | null }) {
  const t = useTranslations('auth')
  const tOnboarding = useTranslations('onboarding')
  const router = useRouter()
  const [modal, setModal] = useState<'signin' | 'role' | null>(
    session && !session.role ? 'role' : null
  )
  const [error, setError] = useState<'popupBlocked' | 'network' | null>(null)
  const [pending, setPending] = useState(false)
  const [rolePending, startRoleTransition] = useTransition()
  const [selecting, setSelecting] = useState<Role | null>(null)

  async function handleSignIn() {
    setError(null)
    setPending(true)
    try {
      const result = await signInWithGoogle()
      if (!result) return // signInWithRedirect 폴백 진행 중 — 페이지가 곧 이동한다
      if (result.needsOnboarding) {
        setModal('role')
      } else {
        setModal(null)
        router.refresh()
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_KEYS[code] ?? 'network')
    } finally {
      setPending(false)
    }
  }

  function handleSelectRole(role: Role) {
    setSelecting(role)
    startRoleTransition(async () => {
      await setRole(role)
      const idToken = await auth.currentUser?.getIdToken(true)
      if (idToken) {
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      }
      setModal(null)
      if (role === 'consumer') {
        router.refresh()
      } else {
        router.push(`/${ROLE_HOME[role]}`)
      }
    })
  }

  return (
    <>
      {session ? (
        <span className="text-label text-content-muted">{session.email}</span>
      ) : (
        <button
          type="button"
          onClick={() => setModal('signin')}
          className="rounded-chip bg-accent text-label text-accent-on px-4 py-2"
        >
          {t('signInWithGoogle')}
        </button>
      )}

      <Dialog
        open={modal === 'signin'}
        onClose={() => setModal(null)}
        title={t('signInWithGoogle')}
      >
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={pending}
            className="rounded-chip bg-accent text-label text-accent-on w-full px-6 py-3 disabled:opacity-50"
          >
            {t('signInWithGoogle')}
          </button>
          {error && <p className="text-caption text-danger">{t(`error.${error}`)}</p>}
        </div>
      </Dialog>

      <Dialog open={modal === 'role'} onClose={() => setModal(null)} title={tOnboarding('title')}>
        <div className="flex flex-col gap-3">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              disabled={rolePending}
              onClick={() => handleSelectRole(role)}
              className="rounded-card border-line bg-surface border p-4 text-left disabled:opacity-50"
            >
              <p className="text-subtitle font-semibold">{tOnboarding(`${role}.title`)}</p>
              <p className="text-caption text-content-muted">{tOnboarding(`${role}.desc`)}</p>
              {rolePending && selecting === role && <p className="text-micro text-accent">···</p>}
            </button>
          ))}
        </div>
      </Dialog>
    </>
  )
}
