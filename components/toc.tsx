"use client"

import { useEffect, useState } from "react"
import { sections } from "@/lib/toc"

// Índice lateral: marca la sección que se está leyendo.
export default function Toc() {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e)
    const onScroll = () => {
      const line = window.innerHeight * 0.3
      let current = ""
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className="toc font-mono text-[12px]" aria-label="Contents">
      <p className="label mb-4">
        <span className="l-en">Contents</span>
        <span className="l-es">Índice</span>
      </p>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              <span className="toc-n text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="l-en">{s.en}</span>
              <span className="l-es">{s.es}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
