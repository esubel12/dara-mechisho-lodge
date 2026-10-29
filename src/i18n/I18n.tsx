import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nValue, type Language } from './context'
import { translations } from './translations'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return window.localStorage.getItem('dara-language') === 'am' ? 'am' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    try {
      window.localStorage.setItem('dara-language', next)
    } catch {
      // The language toggle still works when browser storage is unavailable.
    }
  }

  const value = useMemo<I18nValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key],
    }),
    [language],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
