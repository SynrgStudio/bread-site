import { L } from "@/components/lang"
import { Ruler } from "@/components/technical"

// Los diez bytes con los que empieza todo archivo .bread (SPEC 4.1).
const MAGIC = [
  { hex: "42", ch: "B" },
  { hex: "52", ch: "R" },
  { hex: "45", ch: "E" },
  { hex: "41", ch: "A" },
  { hex: "44", ch: "D" },
  { hex: "00", ch: "NUL" },
  { hex: "0D", ch: "CR" },
  { hex: "0A", ch: "LF" },
  { hex: "01", ch: "1" },
  { hex: "00", ch: "" },
]

export function MagicBytes() {
  return (
    <figure className="frame p-4 sm:p-6">
      <div className="grid grid-cols-10 gap-px font-mono">
        <div className="col-span-8 mb-2 border-b border-line-strong pb-1 text-[10px] uppercase tracking-[0.08em] text-faint">
          magic
        </div>
        <div className="col-span-2 mb-2 border-b pb-1 text-[10px] uppercase tracking-[0.08em]" style={{ borderColor: "var(--tone)", color: "var(--tone)" }}>
          <L en="version" es="versión" />
        </div>
        {MAGIC.map((b, i) => (
          <div key={i} className={`py-2 text-center ${i < 5 ? "bg-panel-2" : "bg-panel"}`}>
            <div className="text-[13px] text-ink sm:text-xl">{b.hex}</div>
            <div className="mt-1 h-3 text-[9px] text-faint sm:text-[11px]">{b.ch}</div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 font-mono text-[11px] leading-relaxed text-faint">
        <L
          en={<>Every .bread file starts with these ten bytes · u16 little-endian · offsets 0–9</>}
          es={<>Todo archivo .bread empieza con estos diez bytes · u16 little-endian · offsets 0–9</>}
        />
      </figcaption>
    </figure>
  )
}

export default function Hero() {
  return (
    <section id="top" className="hero-grid relative overflow-hidden border-b border-line pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="wrap">
        <p className="label">
          <L
            en="Open 3D file format · Draft specification · Apache-2.0"
            es="Formato de archivo 3D abierto · Especificación en borrador · Apache-2.0"
          />
        </p>
        <h1 className="display mt-8 max-w-[15ch] text-[2.6rem] sm:text-7xl lg:text-[5.5rem]">
          <L en="Every bit of the mesh. A twelfth of the size." es="Cada bit de la malla. Un doceavo del tamaño." />
        </h1>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="max-w-[36rem] text-lg leading-relaxed sm:text-xl">
              <L
                en={
                  <>
                    <code>.bread</code> is an open file format for triangle meshes and the scene that places them. A mesh read
                    back is the mesh that was written: every coordinate bit for bit, every triangle in the same order, starting
                    at the same corner. It is meant to replace STL wherever a model goes from one program, or one person, to
                    another.
                  </>
                }
                es={
                  <>
                    <code>.bread</code> es un formato de archivo abierto para mallas de triángulos y la escena que las ubica.
                    La malla que se lee es la que se escribió: cada coordenada bit a bit, cada triángulo en el mismo orden y
                    empezando por la misma esquina. Está pensado para reemplazar al STL donde sea que un modelo pase de un
                    programa, o de una persona, a otra.
                  </>
                }
              />
            </p>
            <p className="mt-6 max-w-[36rem] leading-relaxed text-muted">
              <L
                en={
                  <>
                    <b className="font-semibold text-ink">BREAD</b> stands for <i>Bit-exact Representation of Editable Assembly
                    Data</i>. It is also just bread: Breadslicer slices it, and the slices are the layers.
                  </>
                }
                es={
                  <>
                    <b className="font-semibold text-ink">BREAD</b> quiere decir <i>Bit-exact Representation of Editable
                    Assembly Data</i>. Y también es pan, nomás: Breadslicer lo rebana, y las rebanadas son las capas.
                  </>
                }
              />
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <a href="#numbers" className="go in">
                <L en="See the numbers" es="Ver los números" />
              </a>
              <a href="#predict" className="go in">
                <L en="Go to the math" es="Ir a la matemática" />
              </a>
            </div>
          </div>

          <div className="grid content-start gap-8">
            <div className="grid grid-cols-3 border-t border-line-strong">
              {[
                { v: "94.9", u: "MB", en: "a 1.9 M triangle figure, as binary STL", es: "una figura de 1,9 M de triángulos, en STL binario" },
                { v: "7.6", u: "MB", en: "the same figure, as .bread", es: "la misma figura, en .bread" },
                { v: "0", u: "bits", en: "lost on the way", es: "perdidos en el camino" },
              ].map((s, i) => (
                <div key={i} className={`pt-5 ${i ? "border-l border-line pl-4 sm:pl-6" : "pr-4"}`}>
                  <div className="display text-3xl sm:text-5xl" style={i === 1 ? { color: "var(--tone)" } : undefined}>
                    {s.v}
                    <span className="ml-1 font-mono text-xs font-normal tracking-normal text-faint sm:text-sm">{s.u}</span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted">
                    <L en={s.en} es={s.es} />
                  </p>
                </div>
              ))}
            </div>
            <MagicBytes />
          </div>
        </div>
      </div>
      <Ruler />
    </section>
  )
}
