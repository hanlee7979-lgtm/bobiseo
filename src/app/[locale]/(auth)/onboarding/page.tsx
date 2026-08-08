'use client'

import { useState, useTransition } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { auth } from '@/lib/firebase/client'
import { ROLE_HOME } from '@/lib/auth/roleHome'
import type { Role } from '@/types/user'
import { setRole } from './actions'

const ROLES: Role[] = ['agent', 'merchant', 'consumer']

export default function OnboardingPage() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const [pending, startTransition] = useTransition()
  const [selecting, setSelecting] = useState<Role | null>(null)

  function handleSelect(role: Role) {
    setSelecting(role)
    startTransition(async () => {
      await setRole(role)

      // 커스텀 클레임은 기존 ID 토큰에 반영되지 않으므로 강제 갱신 후 세션을 재발급한다 (docs/03 §3).
      const idToken = await auth.currentUser?.getIdToken(true)
      if (idToken) {
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      }

      router.replace(`/${params.locale}/${ROLE_HOME[role]}`)
    })
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-title font-bold">{t('title')}</h1>
      <div className="flex flex-col gap-3">
        {ROLES.map((role) => (
          <button
            key={role}
            type="button"
            disabled={pending}
            onClick={() => handleSelect(role)}
            className="rounded-card border-line bg-surface border p-4 text-left disabled:opacity-50"
          >
            <p className="text-subtitle font-semibold">{t(`${role}.title`)}</p>
            <p className="text-caption text-content-muted">{t(`${role}.desc`)}</p>
            {pending && selecting === role && <p className="text-micro text-accent">···</p>}
          </button>
        ))}
      </div>
    </main>
  )
}
