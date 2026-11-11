import type { ReactNode } from "react"
import { L } from "@/components/lang"

// Piezas visuales compartidas: figura con epígrafe, cifras y barras.

export function Figure({ children, caption, className = "" }: { children: ReactNode; caption?: { en: ReactNode; es: ReactNode }; className?: string }) {
  return (
    <figure className={`frame p-5 sm:p-7 ${className}`}>
      {children}
      {caption && (
        <figcaption className="mt-5 font-mono text-[11px] leading-relaxed text-faint">
          <L en={caption.en} es={caption.es} />
        </figcaption>
      )}
    </figure>
  )
}

export function Stat({ value, unit, en, es, tone }: { value: string; unit?: string; en: ReactNode; es: ReactNode; tone?: boolean }) {
  return (
    <div className="border-t border-line-strong pt-4">
      <div className="display text-3xl sm:text-4xl" style={tone ? { color: "var(--tone)" } : undefined}>
        {value}
        {unit && <span className="ml-1 font-mono text-xs font-normal tracking-normal text-faint">{unit}</span>}
      </div>
      <p className="mt-2 text-sm leading-snug text-muted">
        <L en={en} es={es} />
      </p>
    </div>
  )
}

export function Bars({
  rows,
  max,
  unit,
}: {
  rows: { label: ReactNode; value: number; shown: string; tone?: boolean }[]
  max: number
  unit: string
}) {
  return (
    <div className="grid gap-3">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <span className={`font-mono text-[12px] ${r.tone ? "text-ink" : "text-muted"}`}>{r.label}</span>
          <div className="flex items-center gap-3">
            {/* La barra más larga ocupa el 78 % de la fila (55 % en celular): el resto es para la cifra */}
            <div
              className="bar h-[18px] w-[max(3px,calc(var(--w)*0.55))] flex-none sm:w-[max(3px,calc(var(--w)*0.78))]"
              style={{ "--w": `${(r.value / max) * 100}%`, background: r.tone ? "var(--tone)" : "#3d4044" } as React.CSSProperties}
            />
            <span className={`whitespace-nowrap font-mono text-[12px] tabular-nums ${r.tone ? "" : "text-faint"}`} style={r.tone ? { color: "var(--tone)" } : undefined}>
              {r.shown} {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
