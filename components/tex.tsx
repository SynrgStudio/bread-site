import katex from "katex"

// Las fórmulas se dibujan al compilar: el navegador recibe HTML y la hoja de
// KaTeX, sin el JavaScript de KaTeX. Un error de sintaxis frena la compilación.

const macros = {
  "\\bitlen": "\\operatorname{bitlen}",
  "\\ord": "\\operatorname{ord}",
  "\\zz": "\\operatorname{zigzag}",
  "\\crc": "\\operatorname{CRC\\text{-}32}",
  "\\sha": "\\operatorname{SHA\\text{-}384}",
}

const render = (src: string, displayMode: boolean) =>
  katex.renderToString(src, { displayMode, throwOnError: true, macros: { ...macros } })

export function Tex({ children }: { children: string }) {
  return <span dangerouslySetInnerHTML={{ __html: render(children, false) }} />
}

// `es` es la misma fórmula con sus palabras en castellano, cuando tiene palabras.
export function TexBlock({ children, es, tag }: { children: string; es?: string; tag?: string }) {
  return (
    <div className="tex-block">
      {tag && <span className="tex-tag">{tag}</span>}
      {es ? (
        <>
          <div className="l-en" dangerouslySetInnerHTML={{ __html: render(children, true) }} />
          <div className="l-es" dangerouslySetInnerHTML={{ __html: render(es, true) }} />
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: render(children, true) }} />
      )}
    </div>
  )
}
