import { B, L } from "@/components/lang"
import Section from "@/components/section"
import { Stat } from "@/components/figures"
import { TexBlock } from "@/components/tex"
import Logo from "@/components/logo"

// § 10 a § 12: los datos de slicer, la conformidad y el estado del formato.

const SLICER = [
  {
    tag: "SUPP",
    en: "Editable supports. Each entry names a model and the leaf that shows its supports; the document holds tips, trunks, joints, rafts and the settings they were built with. The support leaf is stored with an empty mesh and rebuilt from the document, so the supports stay editable.",
    es: "Soportes editables. Cada entrada nombra un modelo y la hoja que muestra sus soportes; el documento guarda puntas, troncos, uniones, balsas y los ajustes con que se armaron. La hoja de soportes se guarda con una malla vacía y se reconstruye desde el documento, así los soportes siguen siendo editables.",
  },
  {
    tag: "HOLW",
    en: "Hollowed models. The model's leaf shows the hollow, which is what prints; the entry names the original mesh, and the document keeps the hollowing settings and the drain holes, so the model can be hollowed again with new ones.",
    es: "Modelos ahuecados. La hoja del modelo muestra el hueco, que es lo que se imprime; la entrada nombra la malla original, y el documento guarda los ajustes del ahuecado y los agujeros de drenaje, para poder ahuecarlo de nuevo con otros.",
  },
  {
    tag: "SPRV",
    en: "A preview of the supports: their mesh as it was when the file was written, so a viewer or a shop that cannot rebuild supports still shows them. It is for showing, never for editing.",
    es: "Una vista previa de los soportes: su malla tal como estaba al guardar el archivo, para que un visor o una tienda que no sabe reconstruir soportes igual los muestre. Es para mostrar, nunca para editar.",
  },
  {
    tag: "SURF",
    en: "Paint on faces: details to keep, or where supports must or must not touch. One mask per leaf and kind, as runs of a value from 0 to 255 over the triangles, with the soft brush in between.",
    es: "Pintura en las caras: detalles para cuidar, o dónde los soportes tienen que tocar o no. Una máscara por hoja y tipo, como tramos de un valor de 0 a 255 sobre los triángulos, con el pincel suave en el medio.",
  },
  {
    tag: "THMB",
    en: "A thumbnail: a PNG of up to 512 × 512 in sRGB, written first so that a file manager reads one chunk and stops.",
    es: "Una miniatura: un PNG de hasta 512 × 512 en sRGB, escrito primero para que un explorador de archivos lea un chunk y pare.",
  },
  {
    tag: "PROJ",
    en: "Breadslicer's project settings, as a versioned TOML document: printer, resin and export format.",
    es: "Los ajustes de proyecto de Breadslicer, como un documento TOML con versión: impresora, resina y formato de exportación.",
  },
]

export function Slicer() {
  return (
    <Section
      id="slicer"
      lead={{
        en: "What turns a mesh into a print job. Any program can skip all of it and still show the same models in the same places.",
        es: "Lo que convierte una malla en un trabajo de impresión. Cualquier programa puede saltearlo entero y mostrar igual los mismos modelos en los mismos lugares.",
      }}
    >
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        {SLICER.map((s) => (
          <div key={s.tag} className="bg-bg p-6">
            <code className="!border-0 !bg-transparent !p-0 text-base" style={{ color: "var(--tone)" }}>
              {s.tag}
            </code>
            <p className="mt-3 text-[15px] leading-relaxed">
              <L en={s.en} es={s.es} />
            </p>
          </div>
        ))}
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Paint never lands on the wrong mesh.</b> Every paint mask carries the triangle count and a fingerprint of the mesh
            it was painted on: a SHA-384 over its geometry, all little-endian, without its name. If the leaf's mesh has changed,
            the fingerprint no longer matches and the paint is ignored, never misplaced.
          </p>
        }
        es={
          <p>
            <b>La pintura nunca cae en la malla equivocada.</b> Cada máscara lleva la cantidad de triángulos y una huella de la
            malla sobre la que se pintó: un SHA-384 de su geometría, todo en little-endian, sin el nombre. Si la malla de la
            hoja cambió, la huella deja de coincidir y la pintura se ignora, nunca se corre de lugar.
          </p>
        }
      />
      <TexBlock tag="10.1" es={String.raw`\begin{array}{l}
\text{huella} = \sha\Big(\, n_{\texttt{u64}} \;\Vert\; \textstyle\bigodot_{i<n} \big(x_i,\, y_i,\, z_i\big)_{\text{bits }\texttt{u32}} \;\Vert\; t_{\texttt{u64}} \;\Vert\; \textstyle\bigodot_{j<t} \big(c_{j,0},\, c_{j,1},\, c_{j,2}\big)_{\texttt{u32}} \Big) \\[4pt]
\textstyle\sum_k \text{largo}_k = t
\end{array}`}>{String.raw`\begin{array}{l}
\text{fingerprint} = \sha\Big(\, n_{\texttt{u64}} \;\Vert\; \textstyle\bigodot_{i<n} \big(x_i,\, y_i,\, z_i\big)_{\texttt{u32 bits}} \;\Vert\; t_{\texttt{u64}} \;\Vert\; \textstyle\bigodot_{j<t} \big(c_{j,0},\, c_{j,1},\, c_{j,2}\big)_{\texttt{u32}} \Big) \\[4pt]
\textstyle\sum_k \text{length}_k = t
\end{array}`}</TexBlock>
    </Section>
  )
}

export function Tests() {
  return (
    <Section
      id="tests"
      lead={{
        en: "A format is what a second implementation can read. Every rule above comes with files that prove a reader follows it.",
        es: "Un formato es lo que puede leer una segunda implementación. Cada regla de arriba viene con archivos que prueban que un lector la cumple.",
      }}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        <Stat value="18" tone en="valid files, each with a JSON of what it holds" es="archivos válidos, cada uno con un JSON de lo que guarda" />
        <Stat value="17" en="invalid files, each with the code a reader must refuse it with" es="archivos inválidos, cada uno con el código con que hay que rechazarlo" />
        <Stat value="15" en="real projects that open, save and come back bit for bit" es="proyectos reales que abren, se guardan y vuelven bit a bit" />
        <Stat value="3" en="platforms writing identical bytes: Windows, Linux, WebAssembly" es="plataformas que escriben los mismos bytes: Windows, Linux, WebAssembly" />
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            The reference implementation is a Rust crate, <code>bread-format</code>, the same code compiled to WebAssembly for
            JavaScript. Every change runs its tests on Linux and on Windows before it is merged.
          </p>
        }
        es={
          <p>
            La implementación de referencia es un crate de Rust, <code>bread-format</code>, y el mismo código compilado a
            WebAssembly para JavaScript. Cada cambio corre sus tests en Linux y en Windows antes de entrar.
          </p>
        }
      />
    </Section>
  )
}

export function Status() {
  return (
    <Section
      id="status"
      lead={{
        en: "A draft, and close. The complete specification and its repository open to the public once it is frozen.",
        es: "Un borrador, y cerca. La especificación completa y su repositorio se abren al público cuando se congele.",
      }}
    >
      <div className="overflow-x-auto">
        <table className="spec-table">
          <tbody>
            {[
              { k: { en: "Extension", es: "Extensión" }, v: <code>.bread</code> },
              { k: { en: "Magic", es: "Magic" }, v: <code>42 52 45 41 44 00 0D 0A</code> },
              { k: { en: "Container", es: "Contenedor" }, v: <L en="version 1" es="versión 1" /> },
              { k: { en: "Chunks", es: "Chunks" }, v: <span className="font-mono text-[13px]">SCNE 1 · MESH 2 · THMB 1 · PROJ 1 · SUPP 2 · HOLW 2 · SPRV 1 · SURF 1</span> },
              { k: { en: "Specification", es: "Especificación" }, v: <L en="draft, not frozen yet" es="borrador, todavía sin congelar" /> },
              { k: { en: "Reference implementation", es: "Implementación de referencia" }, v: <L en="0.2.0, 11 Nov 2026 · 0.1.0, 30 Oct 2026" es="0.2.0, 11 nov 2026 · 0.1.0, 30 oct 2026" /> },
              { k: { en: "Licence", es: "Licencia" }, v: "Apache-2.0" },
            ].map((r, i) => (
              <tr key={i}>
                <td>
                  <L en={r.k.en} es={r.k.es} />
                </td>
                <td>{r.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Standing on.</b> Zstandard (RFC 8878) for the container; the attribute and triangle codecs of meshoptimizer, by
            Arseny Kapoulkine, as published in glTF's <code>KHR_meshopt_compression</code>; CRC-32 as in zlib and PNG; the
            requirement words of RFC 2119 and RFC 8174.
          </p>
        }
        es={
          <p>
            <b>Sobre hombros de.</b> Zstandard (RFC 8878) para el contenedor; los códecs de atributos y de triángulos de
            meshoptimizer, de Arseny Kapoulkine, como los publica <code>KHR_meshopt_compression</code> de glTF; el CRC-32 de
            zlib y PNG; las palabras de requisito de RFC 2119 y RFC 8174.
          </p>
        }
      />
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10 font-mono text-xs text-muted">
        <a href="https://synrgs.tech" className="flex items-center gap-2.5 transition-colors hover:text-ink">
          <Logo className="h-5 w-5" />
          <span>
            <L en="A SynrgStudio format" es="Un formato de SynrgStudio" />
          </span>
        </a>
        <div className="flex gap-8">
          <a href="https://breadslicer.app" className="transition-colors hover:text-ink">
            breadslicer.app ↗
          </a>
          <a href="https://synrgs.tech" className="transition-colors hover:text-ink">
            synrgs.tech ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
