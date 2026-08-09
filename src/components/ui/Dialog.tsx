'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('common')

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="rounded-card border-line bg-surface-raised w-full max-w-sm border p-6 outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="rounded-chip text-content-muted hover:text-content flex h-8 w-8 items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
