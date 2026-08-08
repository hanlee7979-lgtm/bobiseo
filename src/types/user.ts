import type { Timestamp } from 'firebase-admin/firestore'
import type { Palette } from '@/lib/theme/palette'

export type Role = 'agent' | 'merchant' | 'consumer'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  role: Role | null
  isAdmin: boolean
  locale: 'ko' | 'en' | 'zh' | 'ja'
  themePreference: 'light' | 'dark' | 'system'
  palette: Palette
  region: { sido: string; sigungu: string } | null
  agentId: string | null
  onboardedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt: Timestamp | null
}
