import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import localFont from 'next/font/local'
import { routing, type Locale } from '@/lib/i18n/routing'
import { PaletteProvider, paletteFoucScript } from '@/components/theme/PaletteProvider'
import '../globals.css'

const pretendard = localFont({
  src: '../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'local-os',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) notFound()

  return (
    <html
      lang={locale}
      className={`${pretendard.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: paletteFoucScript }} />
      </head>
      <body className="bg-bg text-content flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PaletteProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
