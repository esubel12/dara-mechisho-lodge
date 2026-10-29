import { createContext, useContext } from 'react'
import type { Language } from './translations'

export type { Language } from './translations'
export type TranslationKey = keyof import('./translations').TranslationMap

export interface I18nValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
