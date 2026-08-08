import { getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import {
  type Analytics,
  isSupported as isAnalyticsSupported,
  getAnalytics,
} from 'firebase/analytics'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const alreadyInitialized = getApps().length > 0

export const app = alreadyInitialized ? getApps()[0] : initializeApp(config)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// 에뮬레이터 연결은 앱 인스턴스당 한 번만 가능하므로, 이미 초기화된 경우 다시 붙이지 않는다.
if (!alreadyInitialized && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}

let analyticsPromise: Promise<Analytics | null> | null = null

// Analytics는 브라우저 전용 API에 의존한다. 서버 컴포넌트/SSR에서 호출하면 깨지므로
// 클라이언트에서만, 그것도 브라우저가 실제로 지원할 때만 초기화한다.
export function getClientAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported().then((supported) =>
      supported ? getAnalytics(app) : null
    )
  }
  return analyticsPromise
}
