import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/lib/auth/session'
import { ROLE_HOME } from '@/lib/auth/roleHome'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { SignInButton } from '@/components/auth/SignInButton'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()

  if (session) {
    if (!session.role) redirect(`/${locale}/onboarding`)
    redirect(`/${locale}/${ROLE_HOME[session.role]}`)
  }

  const t = await getTranslations('nav')

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <span className="text-title font-bold">{t('home')}</span>
      <SignInButton />
      <ThemeToggle />
    </main>
  )
}
