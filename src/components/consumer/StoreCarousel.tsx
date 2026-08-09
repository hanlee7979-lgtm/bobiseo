'use client'

import { useTranslations } from 'next-intl'
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { StoreHeroCard } from '@/components/consumer/StoreHeroCard'
import type { MockStore } from '@/lib/mock/stores'

export function StoreCarousel({ stores }: { stores: MockStore[] }) {
  const t = useTranslations('consumer')

  return (
    <HeroCarousel
      items={stores}
      getKey={(store) => store.id}
      ariaLabel={t('recommendedStores')}
      renderCard={(store, index, isActive) => (
        <StoreHeroCard store={store} index={index} isActive={isActive} />
      )}
    />
  )
}
