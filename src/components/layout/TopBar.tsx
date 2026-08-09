import { Bell } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { AuthHeaderControls } from '@/components/auth/AuthHeaderControls'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import type { Role } from '@/types/user'

interface Session {
  email: string | null
  role: Role | null
  isAdmin: boolean
}

export async function TopBar({ session }: { session: Session | null }) {
  const t = await getTranslations('nav')

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <span className="text-title leading-none font-extrabold tracking-tight">
        LOCAL
        <br />
        HERO
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={t('notifications')}
          className="rounded-chip text-content-muted hover:text-content flex h-9 w-9 items-center justify-center"
        >
          <Bell size={20} />
        </button>
        <ThemeToggle />
        <AuthHeaderControls session={session} />
      </div>
    </header>
  )
}
