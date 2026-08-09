'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/lib/utils/useReducedMotion'

const CARD_WIDTH_RATIO = 0.78
const GAP_PX = 12

export function HeroCarousel<T>({
  items,
  getKey,
  renderCard,
  ariaLabel,
}: {
  items: T[]
  getKey: (item: T) => string
  renderCard: (item: T, index: number, isActive: boolean) => ReactNode
  ariaLabel: string
}) {
  const t = useTranslations('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => setContainerWidth(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i))),
    [items.length]
  )
  const prev = () => goTo(index - 1)
  const next = () => goTo(index + 1)

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev()
      else next()
    }
    touchStartX.current = null
  }

  const cardWidth = containerWidth * CARD_WIDTH_RATIO
  const sidePadding = (containerWidth - cardWidth) / 2
  const translateX = sidePadding - index * (cardWidth + GAP_PX)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="overflow-hidden outline-none"
      >
        <div
          className="flex"
          style={{
            gap: GAP_PX,
            transform: `translateX(${translateX}px)`,
            transition: reducedMotion ? 'none' : 'transform 280ms cubic-bezier(.2,.8,.2,1)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={getKey(item)}
              aria-hidden={i !== index}
              aria-label={`${i + 1} / ${items.length}`}
              style={{ width: cardWidth || undefined, flexShrink: 0 }}
              className={
                reducedMotion
                  ? i === index
                    ? 'opacity-100'
                    : 'opacity-35'
                  : `transition-[opacity,transform] duration-200 ${
                      i === index ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-35'
                    }`
              }
            >
              {renderCard(item, i, i === index)}
            </div>
          ))}
        </div>
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={prev}
          aria-label={t('previous')}
          className="rounded-pill absolute top-[42%] left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-black/40 text-white backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {index < items.length - 1 && (
        <button
          type="button"
          onClick={next}
          aria-label={t('next')}
          className="rounded-pill absolute top-[42%] right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-black/40 text-white backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((item, i) => (
          <button
            key={getKey(item)}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1} / ${items.length}`}
            className={
              i === index
                ? 'rounded-pill bg-accent h-1.5 w-4 transition-all'
                : 'rounded-pill bg-line-strong h-1.5 w-1.5 transition-all'
            }
          />
        ))}
      </div>
    </div>
  )
}
