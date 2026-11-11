"use client"

import { useMemo, useState } from "react"

// Dos calculadoras chicas que hacen, en el navegador, las mismas cuentas que
// la spec: el residuo de una coordenada (6.8) y su símbolo de rANS (6.9).

const view = new DataView(new ArrayBuffer(4))
const f32bits = (v: number) => {
  view.setFloat32(0, v)
  return view.getUint32(0)
}
const ord = (u: number) => (u & 0x80000000 ? ~u >>> 0 : (u | 0x80000000) >>> 0)
const zigzag = (d: number) => {
  const i = d | 0
  return i >= 0 ? 2 * i : -2 * i - 1
}
const bitlen = (r: number) => (r === 0 ? 0 : 32 - Math.clz32(r))
const hex = (u: number) => "0x" + (u >>> 0).toString(16).toUpperCase().padStart(8, "0")
const show = (v: number) => (Number.isFinite(v) ? String(Number(v.toPrecision(9))) : String(v))

function Row({ k, v, tone }: { k: string; v: React.ReactNode; tone?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 font-mono text-[12px]">
      <span className="text-faint">{k}</span>
      <span className={`text-right tabular-nums ${tone ? "" : "text-ink"}`} style={tone ? { color: "var(--tone)" } : undefined}>
        {v}
      </span>
    </div>
  )
}

export function ResidualCalc() {
  const [x, setX] = useState("10.37")
  const [p, setP] = useState("10.3651")

  const out = useMemo(() => {
    const xv = Math.fround(Number(x))
    const pv = Math.fround(Number(p))
    if (Number.isNaN(Number(x)) || Number.isNaN(Number(p))) return null
    const ux = f32bits(xv)
    const up = f32bits(pv)
    const d = (ord(ux) - ord(up)) >>> 0
    const r = zigzag(d)
    return { xv, pv, ux, up, ox: ord(ux), op: ord(up), d, r }
  }, [x, p])

  return (
    <div className="frame grid grid-cols-[minmax(0,1fr)] gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:p-7">
      <div className="grid content-start gap-4">
        <label className="grid gap-1.5">
          <span className="label">
            <span className="l-en">Coordinate x</span>
            <span className="l-es">Coordenada x</span>
          </span>
          <input className="field" value={x} onChange={(e) => setX(e.target.value)} inputMode="decimal" spellCheck={false} />
        </label>
        <label className="grid gap-1.5">
          <span className="label">
            <span className="l-en">Prediction p</span>
            <span className="l-es">Predicción p</span>
          </span>
          <input className="field" value={p} onChange={(e) => setP(e.target.value)} inputMode="decimal" spellCheck={false} />
        </label>
        <p className="text-sm leading-relaxed text-muted">
          <span className="l-en">Both are rounded to f32 first, as the file stores them. Try a negative p, or −0.</span>
          <span className="l-es">Las dos se redondean primero a f32, como las guarda el archivo. Probá una p negativa, o −0.</span>
        </p>
      </div>
      <div>
        {out ? (
          <>
            <Row k="x · f32" v={`${show(out.xv)}  ${hex(out.ux)}`} />
            <Row k="p · f32" v={`${show(out.pv)}  ${hex(out.up)}`} />
            <Row k="ord(x)" v={hex(out.ox)} />
            <Row k="ord(p)" v={hex(out.op)} />
            <Row k="d = ord(x) − ord(p)" v={`${out.d | 0}`} />
            <Row k="zigzag(d)" v={out.r.toLocaleString("en-US")} tone />
            <Row k="bitlen" v={`${bitlen(out.r)} bits`} />
          </>
        ) : (
          <p className="font-mono text-[12px] text-faint">—</p>
        )}
      </div>
    </div>
  )
}

export function SymbolCalc() {
  const [raw, setRaw] = useState("182")

  const out = useMemo(() => {
    const n0 = Number(raw)
    if (!Number.isInteger(n0) || n0 < 0 || n0 > 0xffffffff) return null
    const r = n0 >>> 0
    const L = bitlen(r)
    if (L <= 1) return { r, L, n: 0, h: 0, m: 0, sym: 4 * L, rawBits: 0, bits: r.toString(2), back: L }
    const n = L - 1
    const h = Math.min(n, 2)
    const m = n - h
    const top = Math.floor(r / 2 ** m) % 2 ** h
    const sym = 4 * L + top * 2 ** (2 - h)
    const rawBits = r % 2 ** m
    // La vuelta, como la hace un lector: r = 2ⁿ + ((s mod 4) >> (2 − h)) << m, más los bits crudos
    const back = 2 ** n + Math.floor((sym % 4) / 2 ** (2 - h)) * 2 ** m + rawBits
    return { r, L, n, h, m, sym, rawBits, bits: r.toString(2), back }
  }, [raw])

  return (
    <div className="frame grid grid-cols-[minmax(0,1fr)] gap-6 p-5 sm:p-7">
      <label className="grid max-w-[16rem] gap-1.5">
        <span className="label">
          <span className="l-en">Residual r</span>
          <span className="l-es">Residuo r</span>
        </span>
        <input className="field" value={raw} onChange={(e) => setRaw(e.target.value.trim())} inputMode="numeric" spellCheck={false} />
      </label>
      {out ? (
        <>
          <div className="overflow-x-auto">
            <div className="flex w-max gap-[3px] font-mono text-base sm:text-xl">
              {out.bits.split("").map((b, i) => {
                const lead = out.L > 1 && i === 0
                const sym = out.L > 1 && i >= 1 && i <= out.h
                return (
                  <span
                    key={i}
                    className="grid h-10 w-7 place-items-center border sm:h-12 sm:w-9"
                    style={{
                      borderColor: sym ? "var(--tone)" : lead ? "#3d4044" : "#2b2d30",
                      color: sym ? "var(--tone)" : lead ? "#83878b" : "#f0f0ed",
                      background: sym ? "rgba(215,167,90,.1)" : "transparent",
                    }}
                  >
                    {b}
                  </span>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px]">
              <span className="text-faint">
                ■ <span className="l-en">leading 1, implied by L</span>
                <span className="l-es">1 inicial, implícito en L</span>
              </span>
              <span style={{ color: "var(--tone)" }}>
                ■ <span className="l-en">h bits, into the symbol</span>
                <span className="l-es">h bits, al símbolo</span>
              </span>
              <span className="text-ink">
                ■ <span className="l-en">m raw bits, stored as they are</span>
                <span className="l-es">m bits crudos, tal cual</span>
              </span>
            </div>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <Row k="L = bitlen(r)" v={out.L} />
              <Row k="n = L − 1" v={out.n} />
              <Row k="h = min(n, 2)" v={out.h} />
              <Row k="m = n − h" v={out.m} />
            </div>
            <div>
              <Row k="symbol" v={`${out.sym} / 131`} tone />
              <Row k="raw bits" v={out.m ? out.rawBits.toString(2).padStart(out.m, "0") : "—"} />
              <Row k="s mod 4" v={(out.sym % 4).toString(2).padStart(2, "0")} />
              <Row k="decode" v={out.back.toLocaleString("en-US") + (out.back === out.r ? " ✓" : " ✗")} />
            </div>
          </div>
        </>
      ) : (
        <p className="font-mono text-[12px] text-faint">0 … 4,294,967,295</p>
      )}
    </div>
  )
}
