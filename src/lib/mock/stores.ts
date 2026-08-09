// 개발용 시드 데이터. 프로덕션 경로에 섞지 않는다 (docs/12 §12 규칙).
import type { Tier } from '@/types/tier'

export type StoreCategory = 'restaurant' | 'cafe' | 'salon' | 'farm'

export interface MockStore {
  id: string
  category: StoreCategory
  ownerName: string
  ownerTitle: string
  name: string
  tagline: string
  tier: Tier
  rating: number
  reviewCount: number
  discountPercent: number
  signatureItem: string
  hours: string
  avatarColor: string
}

export const MOCK_STORES: MockStore[] = [
  {
    id: 'store-1',
    category: 'restaurant',
    ownerName: '김순자',
    ownerTitle: '사장',
    name: '제주 해녀밥상',
    tagline: '30년 전통 순두부찌개',
    tier: 'A',
    rating: 4.9,
    reviewCount: 128,
    discountPercent: 10,
    signatureItem: '순두부찌개',
    hours: '08:00-20:00',
    avatarColor: 'var(--tier-a)',
  },
  {
    id: 'store-2',
    category: 'cafe',
    ownerName: '박민수',
    ownerTitle: '바리스타',
    name: '카페 오름',
    tagline: '스페셜티 핸드드립 전문',
    tier: 'S',
    rating: 4.9,
    reviewCount: 87,
    discountPercent: 10,
    signatureItem: '핸드드립',
    hours: '09:00-19:00',
    avatarColor: 'var(--tier-s)',
  },
  {
    id: 'store-3',
    category: 'salon',
    ownerName: '이지은',
    ownerTitle: '디자이너',
    name: '감하늘 헤어',
    tagline: '헤어 스타일링 전문가',
    tier: 'A',
    rating: 4.8,
    reviewCount: 64,
    discountPercent: 10,
    signatureItem: '페이드컷',
    hours: '10:00-20:00',
    avatarColor: 'var(--tier-a)',
  },
  {
    id: 'store-4',
    category: 'farm',
    ownerName: '김철수',
    ownerTitle: '농부',
    name: '오메기 할방농장',
    tagline: '제주 자연 재배 농산물',
    tier: 'A',
    rating: 4.9,
    reviewCount: 102,
    discountPercent: 10,
    signatureItem: '오늘수확',
    hours: '상시',
    avatarColor: 'var(--tier-a)',
  },
]

export const CATEGORY_LABEL: Record<StoreCategory, string> = {
  restaurant: '음식점',
  cafe: '카페',
  salon: '미용실',
  farm: '농부',
}

export interface MockProduct {
  id: string
  name: string
  subtitle: string
  price: number
  badge: 'best' | null
}

export const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'p1', name: '제주 감귤 5kg', subtitle: '새콤달콤 제주 감귤', price: 19800, badge: 'best' },
  { id: 'p2', name: '당근 2kg', subtitle: '아삭하고 신선한 당근', price: 12500, badge: null },
  { id: 'p3', name: '브로콜리 1kg', subtitle: '싱싱한 브로콜리', price: 8900, badge: null },
]
