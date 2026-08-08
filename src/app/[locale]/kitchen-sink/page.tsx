import { getTranslations } from 'next-intl/server'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { PaletteSwitcher } from './PaletteSwitcher'

const COLOR_SWATCHES: { token: string; className: string }[] = [
  { token: 'bg', className: 'bg-bg' },
  { token: 'surface', className: 'bg-surface' },
  { token: 'surface-2', className: 'bg-surface-2' },
  { token: 'surface-raised', className: 'bg-surface-raised' },
  { token: 'accent', className: 'bg-accent' },
  { token: 'accent-soft', className: 'bg-accent-soft' },
  { token: 'success', className: 'bg-success' },
  { token: 'warning', className: 'bg-warning' },
  { token: 'danger', className: 'bg-danger' },
  { token: 'info', className: 'bg-info' },
  { token: 'tier-s', className: 'bg-tier-s' },
  { token: 'tier-a', className: 'bg-tier-a' },
  { token: 'tier-b', className: 'bg-tier-b' },
  { token: 'tier-c', className: 'bg-tier-c' },
]

const TYPE_SCALE: { token: string; className: string; weight: string }[] = [
  { token: 'display', className: 'text-display font-extrabold', weight: '800' },
  { token: 'title', className: 'text-title font-bold', weight: '700' },
  { token: 'subtitle', className: 'text-subtitle font-semibold', weight: '600' },
  { token: 'body', className: 'text-body font-normal', weight: '400' },
  { token: 'label', className: 'text-label font-semibold', weight: '600' },
  { token: 'caption', className: 'text-caption font-medium', weight: '500' },
  { token: 'micro', className: 'text-micro font-semibold', weight: '600' },
]

export default async function KitchenSinkPage() {
  const t = await getTranslations('kitchenSink')
  const tTier = await getTranslations('tier')
  const tFormat = await getTranslations('format')

  return (
    <main className="flex flex-1 flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-title font-bold">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <PaletteSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section>
        <h2 className="text-label text-content-muted mb-3 font-semibold">{t('colors')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOR_SWATCHES.map(({ token, className }) => (
            <div key={token} className="flex flex-col gap-2">
              <div className={`rounded-card border-line h-16 border ${className}`} />
              <span className="text-caption text-content-muted">--{token}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-label text-content-muted mb-3 font-semibold">{t('typography')}</h2>
        <div className="rounded-card border-line bg-surface flex flex-col gap-3 border p-4">
          {TYPE_SCALE.map(({ token, className }) => (
            <div key={token} className="flex items-baseline gap-3">
              <span className="text-caption text-content-faint w-20 shrink-0">
                {token} / {TYPE_SCALE.find((x) => x.token === token)?.weight}
              </span>
              <span className={className}>제주 해녀밥상 Jeju 128</span>
            </div>
          ))}
          <p className="tabular text-body text-content">
            <span className="font-semibold">{tFormat('currency', { amount: '18,000' })}</span>
            {' · '}
            <span className="font-semibold">{tFormat('rating', { rating: 4.9, count: 128 })}</span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-label text-content-muted mb-3 font-semibold">{t('components')}</h2>
        <div className="rounded-card border-line bg-surface flex flex-wrap items-center gap-3 border p-4">
          <button className="rounded-chip bg-accent text-label text-accent-on px-4 py-2">
            Button
          </button>
          <span className="rounded-pill bg-tier-a text-label text-tier-on px-3 py-1 font-bold">
            {tTier('A')}
          </span>
          <span className="rounded-chip border-line-strong text-label text-content border px-3 py-1">
            Chip
          </span>
        </div>
      </section>
    </main>
  )
}
