'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { useHasMounted } from '@/lib/utils/useHasMounted'

const OPTIONS = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
  { value: 'system', Icon: SunMoon },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('theme')
  const mounted = useHasMounted()

  if (!mounted) return <div className="h-9 w-28" aria-hidden />

  return (
    <div
      role="radiogroup"
      aria-label={t('toggleLabel')}
      className="rounded-chip border-line bg-surface-2 inline-flex h-9 items-center border p-1"
    >
      {OPTIONS.map(({ value, Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(value)}
            onClick={() => setTheme(value)}
            className={
              active
                ? 'rounded-chip bg-accent text-accent-on flex h-7 w-9 items-center justify-center transition-colors'
                : 'rounded-chip text-content-muted hover:text-content flex h-7 w-9 items-center justify-center transition-colors'
            }
          >
            <Icon size={16} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
