"use client"

import { useEffect, useRef } from "react"

// La capa de plano técnico: cotas, regla y coordenadas. Todo lo que muestra
// es una medida real de la página en el navegador de quien la mira.

// Cota vertical de la sección que la contiene (que debe ser `relative`):
// una línea con topes a lo alto de la sección y su altura real en píxeles.
export function Dim() {
  const root = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = root.current?.parentElement
    if (!host) return
    const observer = new ResizeObserver(() => {
      if (out.current) out.current.textContent = `${Math.round(host.getBoundingClientRect().height)} px`
    })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="wrap relative h-full">
        <div className="dim absolute inset-y-5 left-4">
          <span ref={out} className="dim-label" />
        </div>
      </div>
    </div>
  )
}

// Regla horizontal al pie del encabezado: una marca cada 10 px, un número
// cada 100, contados desde el borde izquierdo de la ventana.
export function Ruler() {
  return (
    <div aria-hidden="true" className="ruler pointer-events-none absolute inset-x-0 bottom-0 hidden h-6 overflow-hidden sm:block">
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={i}
          className="absolute top-0.5 font-mono text-[9px] leading-none text-faint"
          style={{ left: i * 100 + 4 }}
        >
          {i * 100}
        </span>
      ))}
    </div>
  )
}

// Posición del cursor en la página, en píxeles.
export function Coords() {
  const out = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let x = 0
    let y = 0
    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0")
    const write = () => {
      if (out.current) out.current.textContent = `X ${pad(x)}  Y ${pad(y + window.scrollY)}`
    }
    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      write()
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", write, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", write)
    }
  }, [])

  return (
    <span ref={out} aria-hidden="true" className="hidden whitespace-pre font-mono text-[11px] tabular-nums text-faint lg:block">
      {"X 0000  Y 0000"}
    </span>
  )
}

// El fondo de hoja técnica: una grilla de puntos cada 20 px en toda la
// página, muy tenue, y una segunda capa igual que la aclara apenas alrededor
// del cursor. La segunda es fija, así que se corre a mano para que sus puntos
// caigan sobre los de la primera al desplazar la página.
export function Sheet() {
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glow.current
    if (!el) return
    let x = 0
    let y = 0
    let raf = 0
    const apply = () => {
      raf = 0
      el.style.setProperty("--mx", `${x}px`)
      el.style.setProperty("--my", `${y}px`)
      el.style.setProperty("--sy", `${-(window.scrollY % 20)}px`)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      el.style.visibility = "visible"
      el.style.opacity = "1"
      schedule()
    }
    const onLeave = () => {
      el.style.opacity = "0"
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", schedule, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", schedule)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="sheet" />
      <div ref={glow} aria-hidden="true" className="sheet sheet-glow" />
    </>
  )
}

// Las dos líneas guía de la columna, a lo alto de toda la página.
export function Guides() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 hidden min-[1320px]:block">
      <div className="mx-auto h-full max-w-[1240px] border-x border-line/70" />
    </div>
  )
}
