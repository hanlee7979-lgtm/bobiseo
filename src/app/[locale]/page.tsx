import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ShoppingCart, Heart } from 'lucide-react'
import { getSession } from '@/lib/auth/session'
import { TopBar } from '@/components/layout/TopBar'
import { StoreCarousel } from '@/components/consumer/StoreCarousel'
import { MOCK_STORES, MOCK_PRODUCTS } from '@/lib/mock/stores'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()

  // agent/merchant는 각자의 업무 대시보드가 홈이다. consumer/비로그인은 아래 공개 피드를 본다.
  if (session?.role === 'agent') redirect(`/${locale}/crm`)
  if (session?.role === 'merchant') redirect(`/${locale}/home`)

  const t = await getTranslations('consumer')
  const tFormat = await getTranslations('format')
  const tCommon = await getTranslations('common')

  return (
    <>
      <TopBar session={session} />
      <main className="flex flex-1 flex-col gap-6 pb-6">
        <StoreCarousel stores={MOCK_STORES} />

        <section className="px-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-title font-bold">{t('todayFresh')}</h2>
            <span className="text-label text-content-muted">{tCommon('more')} ›</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_PRODUCTS.map((product) => (
              <div key={product.id} className="flex flex-col gap-2">
                <div className="rounded-inner bg-surface-2 relative aspect-square">
                  {product.badge === 'best' && (
                    <span className="rounded-chip bg-danger text-micro absolute top-2 left-2 px-2 py-0.5 font-bold text-white">
                      BEST
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={product.name}
                    className="rounded-pill bg-surface-raised text-content-muted absolute top-2 right-2 flex h-7 w-7 items-center justify-center"
                  >
                    <Heart size={14} />
                  </button>
                </div>
                <p className="text-label font-semibold">{product.name}</p>
                <p className="text-caption text-content-muted">{product.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="tabular text-label font-bold">
                    {tFormat('currency', { amount: product.price.toLocaleString('ko-KR') })}
                  </span>
                  <ShoppingCart size={16} className="text-content-muted" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
