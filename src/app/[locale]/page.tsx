import { getTranslations } from 'next-intl/server'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default async function Home() {
  const t = await getTranslations('nav')

  return (
    <main className="flex flex-1 items-center justify-between p-4">
      <span className="text-title font-bold">{t('home')}</span>
      <ThemeToggle />
    </main>
  )
}
