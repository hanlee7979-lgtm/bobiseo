'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

// 서버에서는 false, 클라이언트 하이드레이션 이후 true. next-themes 등 브라우저 전용 값을
// 안전하게 렌더링하기 위한 게이트. useEffect + setState 대신 useSyncExternalStore를 쓴다
// (react-hooks/set-state-in-effect 린트 규칙 회피 겸 React 권장 패턴).
export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
