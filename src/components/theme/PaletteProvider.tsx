'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { DEFAULT_PALETTE, isPalette, type Palette } from '@/lib/theme/palette'

type Listener = () => void

let cachedPalette: Palette | null = null
let listeners: Listener[] = []

function readStoredPalette(): Palette {
  const stored = localStorage.getItem('palette')
  return isPalette(stored) ? stored : DEFAULT_PALETTE
}

function getSnapshot(): Palette {
  cachedPalette ??= readStoredPalette()
  return cachedPalette
}

function getServerSnapshot(): Palette {
  return DEFAULT_PALETTE
}

function subscribe(listener: Listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function setPalette(palette: Palette) {
  cachedPalette = palette
  document.documentElement.setAttribute('data-palette', palette)
  localStorage.setItem('palette', palette)
  listeners.forEach((listener) => listener())
}

const PaletteContext = createContext<{
  palette: Palette
  setPalette: (p: Palette) => void
} | null>(null)

export function PaletteProvider({ children }: { children: ReactNode }) {
  const palette = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>{children}</PaletteContext.Provider>
  )
}

export function usePalette() {
  const ctx = useContext(PaletteContext)
  if (!ctx) throw new Error('usePalette must be used within PaletteProvider')
  return ctx
}

// FOUC 방지: next-themes가 .dark 클래스를 붙이기 전, 팔레트는 별도로 관리되므로
// <head>에 인라인으로 넣어 첫 페인트 전에 data-palette를 세팅한다.
export const paletteFoucScript = `
try {
  var p = localStorage.getItem('palette');
  var valid = ['basalt','gyul','gotjawal','badang'];
  document.documentElement.setAttribute('data-palette', valid.indexOf(p) > -1 ? p : 'basalt');
} catch (e) {}
`
