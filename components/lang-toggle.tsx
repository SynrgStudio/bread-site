"use client"

import { useRef } from "react"

// El botón de idioma. Los dos idiomas ya están en la página (ver lang.tsx):
// cambiar es mover el atributo data-lang de <html>. En el medio, el mismo
// glitch del portfolio: el texto a la vista se rompe en símbolos, cambia y
// vuelve, con sacudida, aberración y una franja invertida.

type Lang = "en" | "es"

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&01"
const TICK = 30 // ms
const OUT_TICKS = 4
const IN_TICKS = 8
const ROOT_VARS = ["--gx", "--gs", "--ga", "--gy", "--gh", "--go"]

const rnd = (min: number, max: number) => min + Math.random() * (max - min)

type Target = {
  node: Text
  original: string
  written: string
  el: HTMLElement | null // el elemento que se puede partir en franjas, si hay
}

function visibleTargets(): Target[] {
  const targets: Target[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const text = node.nodeValue
    if (!text?.trim()) continue
    const parent = node.parentElement
    if (!parent || parent.closest("script, style, noscript")) continue
    const rect = parent.getBoundingClientRect()
    if (rect.width === 0 || rect.bottom < 0 || rect.top > window.innerHeight) continue

    // Las franjas se dibujan con ::before y ::after: sirve solo un elemento
    // cuyo único contenido es este texto y que no usa ya esos pseudoelementos.
    let el: HTMLElement | null = null
    if (parent.childNodes.length === 1) {
      const free = (pseudo: string) => ["none", "normal"].includes(getComputedStyle(parent, pseudo).content)
      if (getComputedStyle(parent).position === "static" && free("::before") && free("::after")) el = parent
    }
    targets.push({ node, original: text, written: text, el })
  }
  return targets
}

function scramble(text: string, amount: number) {
  let out = ""
  for (const ch of text)
    out += /\s/.test(ch) || Math.random() > amount ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return out
}

// Rompe lo que está a la vista durante `ticks` pasos y después lo deja como
// estaba, salvo los textos que hayan cambiado mientras tanto.
function play(ticks: number, amountAt: (progress: number) => number) {
  const targets = visibleTargets()
  const root = document.documentElement.style
  return new Promise<void>((resolve) => {
    let step = 0
    const tick = () => {
      step++
      const done = step > ticks
      const base = done ? 0 : amountAt(step / ticks)

      // Sacudida, aberración y franja invertida: valores nuevos en cada paso
      root.setProperty("--gx", Math.random() < 0.3 ? "0px" : `${rnd(-10, 10).toFixed(1)}px`)
      root.setProperty("--gs", `${rnd(-1.4, 1.4).toFixed(2)}deg`)
      root.setProperty("--ga", `${rnd(-6, 6).toFixed(1)}px`)
      root.setProperty("--gy", `${rnd(0, 95).toFixed(0)}vh`)
      root.setProperty("--gh", `${rnd(1, 16).toFixed(0)}vh`)
      root.setProperty("--go", Math.random() < 0.45 ? "1" : "0")

      for (const t of targets) {
        if (t.node.nodeValue === t.written) {
          // Cada texto sortea su propia rotura; cada tanto uno se rompe entero.
          const amount = Math.random() < 0.12 ? 1 : base * rnd(0.4, 1.5)
          t.written = done ? t.original : scramble(t.original, Math.min(amount, 1))
          t.node.nodeValue = t.written
        }
        if (!t.el) continue
        if (!done && Math.random() < 0.4) {
          t.el.dataset.g = String(1 + Math.floor(Math.random() * 4))
          t.el.dataset.gt = t.node.nodeValue ?? ""
        } else {
          delete t.el.dataset.g
          delete t.el.dataset.gt
        }
      }

      if (done) {
        clearInterval(id)
        resolve()
      }
    }
    const id = setInterval(tick, TICK)
    tick() // el primer paso va ya, sin esperar un intervalo
  })
}

const currentLang = (): Lang => (document.documentElement.dataset.lang === "es" ? "es" : "en")

function apply(next: Lang) {
  const root = document.documentElement
  root.dataset.lang = next
  root.lang = next
  try {
    localStorage.setItem("lang", next)
  } catch {}
}

export default function LangToggle() {
  const busy = useRef(false)

  const toggle = async () => {
    if (busy.current) return
    const next: Lang = currentLang() === "en" ? "es" : "en"
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next)
      return
    }
    busy.current = true
    const root = document.documentElement
    root.classList.add("glitching")
    try {
      await play(OUT_TICKS, (p) => 0.35 + 0.5 * p)
      apply(next)
      await play(IN_TICKS, (p) => 0.85 * (1 - p) + 0.08)
    } finally {
      root.classList.remove("glitching")
      for (const name of ROOT_VARS) root.style.removeProperty(name)
      busy.current = false
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="English / Español"
      title="English / Español"
      className="-my-2 flex items-center gap-1.5 border-l border-line py-2 pl-6"
    >
      <span className="tg-en">EN</span>
      <span className="text-faint">/</span>
      <span className="tg-es">ES</span>
    </button>
  )
}
