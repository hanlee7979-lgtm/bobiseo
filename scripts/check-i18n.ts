import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const LOCALES = ['en', 'zh', 'ja'] as const
const BASE_LOCALE = 'ko'
const MESSAGES_DIR = join(import.meta.dirname, '..', 'messages')

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, path)
    }
    return [path]
  })
}

function loadKeys(locale: string): Set<string> {
  const raw = readFileSync(join(MESSAGES_DIR, `${locale}.json`), 'utf-8')
  return new Set(flattenKeys(JSON.parse(raw)))
}

const baseKeys = loadKeys(BASE_LOCALE)
let hasIssues = false

for (const locale of LOCALES) {
  const keys = loadKeys(locale)
  const missing = [...baseKeys].filter((k) => !keys.has(k))
  const extra = [...keys].filter((k) => !baseKeys.has(k))

  if (missing.length > 0) {
    hasIssues = true
    console.warn(`[i18n:check] ${locale}.json — ${BASE_LOCALE} 기준 누락된 키 ${missing.length}개:`)
    missing.forEach((k) => console.warn(`  - ${k}`))
  }
  if (extra.length > 0) {
    hasIssues = true
    console.warn(`[i18n:check] ${locale}.json — ${BASE_LOCALE}에 없는 잉여 키 ${extra.length}개:`)
    extra.forEach((k) => console.warn(`  - ${k}`))
  }
}

if (!hasIssues) {
  console.log(`[i18n:check] ${BASE_LOCALE} 기준으로 ${LOCALES.join(', ')} 키 구조가 일치한다.`)
}

// ko 기준 누락은 경고만 하고 빌드를 막지 않는다 (docs/05 §6).
process.exit(0)
