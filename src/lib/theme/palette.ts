export const PALETTES = ['basalt', 'gyul', 'gotjawal', 'badang'] as const

export type Palette = (typeof PALETTES)[number]

export const DEFAULT_PALETTE: Palette = 'basalt'

export function isPalette(value: string | null | undefined): value is Palette {
  return !!value && (PALETTES as readonly string[]).includes(value)
}
