'use client'

import { useTranslations } from 'next-intl'
import { usePalette } from '@/components/theme/PaletteProvider'
import { PALETTES } from '@/lib/theme/palette'

export function PaletteSwitcher() {
  const { palette, setPalette } = usePalette()
  const t = useTranslations('theme')

  return (
    <div role="radiogroup" aria-label={t('palette')} className="flex gap-1">
      {PALETTES.map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={palette === p}
          onClick={() => setPalette(p)}
          className={
            palette === p
              ? 'rounded-chip bg-accent text-label text-accent-on px-3 py-1.5'
              : 'rounded-chip border-line text-label text-content-muted hover:text-content border px-3 py-1.5'
          }
        >
          {t(`paletteName.${p}`)}
        </button>
      ))}
    </div>
  )
}
