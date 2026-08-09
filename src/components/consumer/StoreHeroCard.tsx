'use client'

import { Heart, Utensils, Coffee, Scissors, Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { MockStore, StoreCategory } from '@/lib/mock/stores'

const CATEGORY_ICON: Record<StoreCategory, typeof Utensils> = {
  restaurant: Utensils,
  cafe: Coffee,
  salon: Scissors,
  farm: Leaf,
}

export function StoreHeroCard({
  store,
  index,
  isActive,
}: {
  store: MockStore
  index: number
  isActive: boolean
}) {
  const t = useTranslations('consumer')
  const tCategory = useTranslations('category')
  const tFormat = useTranslations('format')
  const Icon = CATEGORY_ICON[store.category]

  return (
    <div
      className="rounded-card border-line relative overflow-hidden border"
      style={{ aspectRatio: '3 / 4' }}
    >
      <div
        className="h-full w-full"
        style={{ background: `color-mix(in srgb, ${store.avatarColor} 30%, var(--surface-2))` }}
      />

      <span className="rounded-chip text-label absolute top-3 left-3 bg-black/50 px-2 py-1 font-bold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="rounded-pill text-label absolute top-3 right-11 flex items-center gap-1 bg-black/50 px-3 py-1 text-white">
        <Icon size={14} aria-hidden />
        {tCategory(store.category)}
      </span>
      <button
        type="button"
        aria-label={t('favoriteAria', { name: store.name })}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center text-white"
      >
        <Heart size={20} />
      </button>

      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 35%, transparent 70%)',
        }}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
        <p className="text-subtitle font-bold">
          {store.ownerName} {store.ownerTitle}
        </p>
        <p className="text-caption text-white/80">{store.tagline}</p>
        <p className="tabular text-caption">
          {tFormat('rating', { rating: store.rating, count: store.reviewCount })}
        </p>

        <div className="rounded-chip mt-2 grid grid-cols-3 divide-x divide-white/20 bg-black/40 text-center">
          <div className="px-2 py-1.5">
            <p className="tabular text-label font-bold">{store.discountPercent}%</p>
            <p className="text-micro text-white/70">{t('discountLabel')}</p>
          </div>
          <div className="px-2 py-1.5">
            <p className="text-label truncate font-bold">{store.signatureItem}</p>
            <p className="text-micro text-white/70">{t('signature')}</p>
          </div>
          <div className="px-2 py-1.5">
            <p className="tabular text-label font-bold">{store.hours}</p>
            <p className="text-micro text-white/70">{t('hours')}</p>
          </div>
        </div>
      </div>

      {isActive && (
        <div
          className="rounded-card pointer-events-none absolute inset-0"
          style={{ boxShadow: '0 0 0 2px var(--accent), 0 0 32px var(--accent-ring)' }}
        />
      )}
    </div>
  )
}
