import type { ReactNode } from "react"

// Los dos idiomas van siempre en el HTML; globals.css muestra uno solo según
// el atributo data-lang de <html>. L es para texto en línea y B para bloques.

export function L({ en, es }: { en: ReactNode; es: ReactNode }) {
  return (
    <>
      <span className="l-en" lang="en">
        {en}
      </span>
      <span className="l-es" lang="es">
        {es}
      </span>
    </>
  )
}

export function B({ en, es, className = "" }: { en: ReactNode; es: ReactNode; className?: string }) {
  return (
    <>
      <div className={`l-en prose-spec ${className}`} lang="en">
        {en}
      </div>
      <div className={`l-es prose-spec ${className}`} lang="es">
        {es}
      </div>
    </>
  )
}
