import { B, L } from "@/components/lang"
import Section from "@/components/section"
import { Bars, Figure, Stat } from "@/components/figures"
import { TexBlock } from "@/components/tex"

// § 01 a § 03: los números, qué guarda el formato y cómo es un archivo por dentro.
// Todo sale de SPEC.md (tag v0.2.0) y de las mediciones del repo del formato.
// Los modelos van con nombres genéricos: son de terceros o de clientes.

const SIZES = [
  { label: "STL binary", value: 94.9 },
  { label: "OBJ", value: 73.1 },
  { label: "STL · zip", value: 41.2 },
  { label: "STL · 7z", value: 33.2 },
  { label: "OBJ · zstd 19", value: 15.8 },
  { label: ".bread v1", value: 8.5 },
  { label: ".bread v2", value: 7.6, tone: true },
]

export function Numbers() {
  return (
    <Section
      id="numbers"
      lead={{
        en: "One figure of 1.9 million triangles and 950 thousand vertices, stored seven ways. Every one of them keeps the whole mesh; only one of them is small.",
        es: "Una figura de 1,9 millones de triángulos y 950 mil vértices, guardada de siete maneras. Todas guardan la malla entera; una sola es chica.",
      }}
    >
      <Figure
        caption={{
          en: "Same mesh in every row, lossless · bars drawn to the same scale · .bread v2 is about 7.6 MB",
          es: "La misma malla en cada fila, sin pérdida · barras a la misma escala · .bread v2 pesa unos 7,6 MB",
        }}
      >
        <p className="label mb-6">
          <L en="File size of a 1.9 M triangle figure" es="Tamaño de una figura de 1,9 M de triángulos" />
        </p>
        <Bars
          max={94.9}
          unit="MB"
          rows={SIZES.map((s) => ({ ...s, shown: s.value.toFixed(1) }))}
        />
      </Figure>

      <div>
        <p className="label mb-5">
          <L en="Mesh version 2 against version 1 · same content, bit for bit" es="Malla versión 2 contra versión 1 · mismo contenido, bit a bit" />
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          <Stat value="−24.7" unit="%" tone en="on a corpus of 22 meshes, 255 MB as STL" es="en un corpus de 22 mallas, 255 MB en STL" />
          <Stat value="5.9–9.1" unit="×" en="smaller than the STL, mesh by mesh" es="más chico que el STL, malla por malla" />
          <Stat value="−36" unit="%" en="on a large mesh of supports" es="en una malla grande de soportes" />
          <Stat value="10–35" unit="%" en="smaller, on 15 real Breadslicer projects" es="más chicos, en 15 proyectos reales de Breadslicer" />
        </div>
        <p className="mt-6 text-sm text-muted">
          <L
            en="By kind of model: −15 % on the 1.9 M figure, −19 to −27 % on sculptures, −1 to −8 % on CAD parts, whose flat faces leave little to predict."
            es="Por tipo de modelo: −15 % en la figura de 1,9 M, −19 a −27 % en esculturas, −1 a −8 % en piezas CAD, cuyas caras planas dejan poco para predecir."
          />
        </p>
      </div>

      <div>
        <p className="label mb-5">
          <L en="Speed, determinism and weight" es="Velocidad, determinismo y peso" />
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          <Stat value="~50" unit="ms" en="to open the 1.9 M figure, native, version 1" es="para abrir la figura de 1,9 M, nativo, versión 1" />
          <Stat value="205" unit="ms" en="to open it cold in WebAssembly, version 2" es="para abrirla en frío en WebAssembly, versión 2" />
          <Stat value="~0.5" unit="s" en="to save 2 million triangles" es="para guardar 2 millones de triángulos" />
          <Stat value="62" unit="KB" tone en="the web reader, brotli; 119 KB with the writer" es="el lector web, con brotli; 119 KB con el escritor" />
        </div>
        <p className="mt-6 text-sm text-muted">
          <L
            en="The same file comes out as the same bytes on Windows, Linux and WebAssembly. Measured on a desktop PC; WebAssembly in Node 26 on V8, the engine of Chrome."
            es="El mismo archivo sale con los mismos bytes en Windows, Linux y WebAssembly. Medido en una PC de escritorio; WebAssembly en Node 26 sobre V8, el motor de Chrome."
          />
        </p>
      </div>
    </Section>
  )
}

export function Holds() {
  const keeps = {
    en: [
      "Every vertex coordinate, bit for bit: negative zero, subnormals and NaN payloads included.",
      "Every triangle, in the same order, starting at the same corner: winding and first corner both survive.",
      "A scene: named parts, groups, meshes shared between parts, copies of whole subtrees, and a transform on every node.",
      "Room for a slicer: editable supports, hollowed models, paint on faces, a thumbnail and a preview of the supports.",
    ],
    es: [
      "Cada coordenada de cada vértice, bit a bit: el cero negativo, los subnormales y los NaN con su contenido incluidos.",
      "Cada triángulo, en el mismo orden y empezando por la misma esquina: sobreviven el sentido de giro y la primera esquina.",
      "Una escena: partes con nombre, grupos, mallas compartidas entre partes, copias de subárboles enteros y una transformación en cada nodo.",
      "Lugar para un slicer: soportes editables, modelos ahuecados, pintura en las caras, una miniatura y una vista previa de los soportes.",
    ],
  }
  const leaves = {
    en: [
      "Colours, textures, UV coordinates, materials and animation. That is glTF's job, and .bread does not compete with it.",
      "The facet normals an STL stores with every triangle. They are file data, not geometry: any program computes them from the corners.",
    ],
    es: [
      "Colores, texturas, coordenadas UV, materiales y animación. Eso es trabajo de glTF, y .bread no compite con él.",
      "Las normales que el STL guarda con cada triángulo. Son datos del archivo, no geometría: cualquier programa las calcula desde las esquinas.",
    ],
  }
  return (
    <Section
      id="holds"
      lead={{
        en: "Geometry, and only geometry, kept exactly. One file carries a whole kit of parts, with their names, ready for whoever opens it next.",
        es: "Geometría, y solo geometría, guardada exacta. Un archivo lleva un kit entero de partes, con sus nombres, listo para quien lo abra después.",
      }}
    >
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="label mb-4" style={{ color: "var(--tone)" }}>
            <L en="Kept" es="Se guarda" />
          </p>
          <B
            en={<ul>{keeps.en.map((t) => <li key={t}>{t}</li>)}</ul>}
            es={<ul>{keeps.es.map((t) => <li key={t}>{t}</li>)}</ul>}
          />
        </div>
        <div>
          <p className="label mb-4">
            <L en="Left out, on purpose" es="Se deja afuera, a propósito" />
          </p>
          <B
            en={<ul>{leaves.en.map((t) => <li key={t}>{t}</li>)}</ul>}
            es={<ul>{leaves.es.map((t) => <li key={t}>{t}</li>)}</ul>}
          />
        </div>
      </div>

      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              <b>Who it is for.</b> Designers who hand models to someone else, such as a client, and anyone who wants to take a
              pre-supported model out of a slicer with its supports still editable. It replaces STL; it is not another
              scene format for games or rendering.
            </p>
            <p>
              <b>Where it comes from.</b> It started as the project file of Breadslicer, a resin slicer. It is now a format of its
              own, with its own specification and a reference implementation under the Apache-2.0 licence, while Breadslicer
              stays AGPL. The application chunks are Breadslicer's; any other program can skip them and still read the same
              meshes in the same scene.
            </p>
          </>
        }
        es={
          <>
            <p>
              <b>Para quién es.</b> Para diseñadores que le entregan modelos a otra persona, por ejemplo a un cliente, y para
              cualquiera que quiera sacar de un slicer un modelo presoportado con los soportes todavía editables. Reemplaza al
              STL; no es otro formato de escenas para juegos o render.
            </p>
            <p>
              <b>De dónde viene.</b> Empezó como el archivo de proyecto de Breadslicer, un slicer de resina. Hoy es un formato
              propio, con su especificación y una implementación de referencia bajo licencia Apache-2.0, mientras que Breadslicer
              sigue siendo AGPL. Los chunks de aplicación son los de Breadslicer; cualquier otro programa puede saltearlos y
              leer igual las mismas mallas en la misma escena.
            </p>
          </>
        }
      />
    </Section>
  )
}

// Un chunk a alto nivel: qué lleva la cabecera y el payload comprimido.
// Sin offsets ni tamaños: el layout exacto sale con la spec congelada.
const CHUNK = [
  { name: "tag", en: "what it holds", es: "qué guarda" },
  { name: "version", en: "of this chunk", es: "de este chunk" },
  { name: "lengths", en: "raw and stored", es: "crudo y guardado" },
  { name: "CRC-32", en: "of the stored bytes", es: "de los bytes guardados" },
]

function ChunkDiagram() {
  return (
    <Figure
      caption={{
        en: "One chunk: a short header, then the payload compressed with zstd · the next chunk starts right after it",
        es: "Un chunk: una cabecera corta y después el payload comprimido con zstd · el chunk siguiente empieza justo después",
      }}
    >
      <div className="grid grid-cols-2 gap-px font-mono text-[11px] sm:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)]">
        {CHUNK.map((c) => (
          <div key={c.name} className="border border-line-strong bg-panel-2 px-3 py-3">
            <div className="text-[13px] text-ink">{c.name}</div>
            <div className="mt-1 text-faint">
              <L en={c.en} es={c.es} />
            </div>
          </div>
        ))}
        <div
          className="col-span-2 border border-dashed px-3 py-3 sm:col-span-1"
          style={{ borderColor: "var(--tone)", background: "repeating-linear-gradient(135deg, rgba(215,167,90,.08) 0 6px, transparent 6px 12px)" }}
        >
          <div className="text-[13px]" style={{ color: "var(--tone)" }}>
            payload · zstd
          </div>
          <div className="mt-1 text-faint">
            <L en="the data itself, compressed" es="los datos, comprimidos" />
          </div>
        </div>
      </div>
    </Figure>
  )
}

const READ_RULES = {
  en: [
    ["fewer than 8 bytes, or 8 bytes that are not the magic", "refuse: it is not a .bread file"],
    ["a container version newer than the reader knows", "refuse the file"],
    ["the file ends inside a header or inside stored bytes", "refuse: it is cut short"],
    ["a CRC that does not match, in any chunk", "refuse: it is damaged"],
    ["a tag the reader does not know", "skip the chunk and go on"],
    ["a known tag at a newer chunk version", "refuse the file"],
    ["stored bytes that are not one valid frame, or that do not decompress to exactly the raw length", "refuse: it is damaged"],
  ],
  es: [
    ["menos de 8 bytes, u 8 bytes que no son el magic", "rechazar: no es un archivo .bread"],
    ["una versión de contenedor más nueva que las que conoce el lector", "rechazar el archivo"],
    ["el archivo termina dentro de una cabecera o de los bytes guardados", "rechazar: está cortado"],
    ["un CRC que no coincide, en cualquier chunk", "rechazar: está dañado"],
    ["un tag que el lector no conoce", "saltear el chunk y seguir"],
    ["un tag conocido con una versión de chunk más nueva", "rechazar el archivo"],
    ["bytes guardados que no son un frame válido, o que no descomprimen a exactamente el largo crudo", "rechazar: está dañado"],
  ],
}

const REGISTRY = [
  { tag: "SCNE", v: "1", n: { en: "exactly one", es: "exactamente uno" }, h: { en: "the scene: nodes, transforms and the meshes they use", es: "la escena: nodos, transformaciones y las mallas que usan" } },
  { tag: "MESH", v: "2", n: { en: "any number", es: "cualquier cantidad" }, h: { en: "one triangle mesh; version 1 is still read", es: "una malla de triángulos; la versión 1 se sigue leyendo" } },
  { tag: "THMB", v: "1", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "a thumbnail, as a PNG of up to 512 × 512", es: "una miniatura, como PNG de hasta 512 × 512" } },
  { tag: "PROJ", v: "1", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "application data: project settings", es: "datos de aplicación: ajustes del proyecto" } },
  { tag: "SUPP", v: "2", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "application data: editable supports", es: "datos de aplicación: soportes editables" } },
  { tag: "HOLW", v: "2", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "application data: hollowed models", es: "datos de aplicación: modelos ahuecados" } },
  { tag: "SPRV", v: "1", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "a preview of the supports, for readers that skip SUPP", es: "una vista previa de los soportes, para lectores que saltean SUPP" } },
  { tag: "SURF", v: "1", n: { en: "at most one", es: "a lo sumo uno" }, h: { en: "paint on the faces of models", es: "pintura en las caras de los modelos" } },
]

export function FileAnatomy() {
  return (
    <Section
      id="file"
      lead={{
        en: "A ten-byte header, then chunks, one after another, until the file ends. No index, no end marker, no padding.",
        es: "Una cabecera de diez bytes y después chunks, uno detrás de otro, hasta que termina el archivo. Sin índice, sin marca de fin, sin relleno.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              The magic is built the way PNG's is. <code>BREAD</code> names the format to anyone looking at the bytes. The NUL
              byte makes tools that guess whether a file is text treat it as binary. CR LF catches a file that went through a
              text-mode transfer: turning line endings into LF, or into CR LF, changes the magic. Anything a transfer breaks
              further on is caught by the chunk checksums.
            </p>
            <p>
              Each chunk carries a four-byte tag that says what it holds, a version of its own, and a payload that is
              compressed and guarded by a checksum. All numbers are little-endian, with no padding or alignment.
            </p>
          </>
        }
        es={
          <>
            <p>
              El magic está armado como el de PNG. <code>BREAD</code> le dice el formato a cualquiera que mire los bytes. El
              byte NUL hace que las herramientas que adivinan si un archivo es texto lo traten como binario. CR LF detecta un
              archivo que pasó por una transferencia en modo texto: pasar los finales de línea a LF, o a CR LF, cambia el
              magic. Lo que una transferencia rompa más adelante lo detectan los checksums de los chunks.
            </p>
            <p>
              Cada chunk lleva un tag de cuatro bytes que dice qué guarda, una versión propia y un payload comprimido y
              protegido por un checksum. Todos los números son little-endian, sin relleno ni alineación.
            </p>
          </>
        }
      />

      <ChunkDiagram />

      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Stored bytes.</b> One Zstandard frame (RFC 8878) that decompresses to the payload: no dictionary, and a window
            of at most 8 MB, so every decoder can read it. The compression level is the writer's choice; two writers may store
            the same payload as different bytes. The checksum is the CRC-32 of zlib, gzip and PNG, over the stored bytes only,
            and stored little-endian like everything else:
          </p>
        }
        es={
          <p>
            <b>Bytes guardados.</b> Un frame de Zstandard (RFC 8878) que descomprime al payload: sin diccionario y con una
            ventana de 8 MB como mucho, para que cualquier decodificador lo pueda leer. El nivel de compresión lo elige quien
            escribe; dos escritores pueden guardar el mismo payload con bytes distintos. El checksum es el CRC-32 de zlib, gzip
            y PNG, solo sobre los bytes guardados, y se guarda en little-endian como todo lo demás:
          </p>
        }
      />
      <TexBlock tag="4.3" es={String.raw`\begin{array}{l}
g(x) = \texttt{0x04C11DB7}\ \ (\text{reflejado: } \texttt{0xEDB88320}),\qquad \text{init} = \text{xorout} = \texttt{0xFFFFFFFF} \\[6pt]
\crc(\texttt{"123456789"}) = \texttt{0xCBF43926}
\end{array}`}>{String.raw`\begin{array}{l}
g(x) = \texttt{0x04C11DB7}\ \ (\text{reflected: } \texttt{0xEDB88320}),\qquad \text{init} = \text{xorout} = \texttt{0xFFFFFFFF} \\[6pt]
\crc(\texttt{"123456789"}) = \texttt{0xCBF43926}
\end{array}`}</TexBlock>

      <div>
        <p className="label mb-4">
          <L en="What a reader must do" es="Qué tiene que hacer un lector" />
        </p>
        <div className="overflow-x-auto">
          {(["en", "es"] as const).map((lang) => (
            <table key={lang} className={`spec-table l-${lang}`} lang={lang}>
              <thead>
                <tr>
                  <th>{lang === "en" ? "It finds" : "Encuentra"}</th>
                  <th>{lang === "en" ? "It must" : "Tiene que"}</th>
                </tr>
              </thead>
              <tbody>
                {READ_RULES[lang].map(([a, b]) => (
                  <tr key={a}>
                    <td className="!whitespace-normal !text-body">{a}</td>
                    <td className={b.startsWith("skip") || b.startsWith("saltear") ? "" : "text-ink"} style={b.startsWith("skip") || b.startsWith("saltear") ? { color: "var(--tone)" } : undefined}>
                      {b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        <p className="mt-5 max-w-[44rem] text-sm text-muted">
          <L
            en="Skipping unknown tags is how new kinds of chunks arrive without breaking old readers. Refusing a known tag at a newer version is the other half: skipping it could lose data the rest of the file depends on."
            es="Saltear los tags desconocidos es lo que permite sumar chunks nuevos sin romper lectores viejos. Rechazar un tag conocido en una versión más nueva es la otra mitad: saltearlo podría perder datos de los que depende el resto del archivo."
          />
        </p>
      </div>

      <div>
        <p className="label mb-4">
          <L en="The chunk registry" es="El registro de chunks" />
        </p>
        <div className="overflow-x-auto">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>
                  <L en="Version" es="Versión" />
                </th>
                <th>
                  <L en="Per file" es="Por archivo" />
                </th>
                <th>
                  <L en="Holds" es="Guarda" />
                </th>
              </tr>
            </thead>
            <tbody>
              {REGISTRY.map((r) => (
                <tr key={r.tag}>
                  <td>
                    <code>{r.tag}</code>
                  </td>
                  <td className="font-mono">{r.v}</td>
                  <td className="whitespace-nowrap text-muted">
                    <L en={r.n.en} es={r.n.es} />
                  </td>
                  <td>
                    <L en={r.h.en} es={r.h.es} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <B
          className="mt-6 max-w-[44rem]"
          en={
            <p>
              A tag is four ASCII letters or digits, and the case of its first letter says who owns it: <b>uppercase</b> tags
              are official and listed here; <b>lowercase</b> tags are private, for a program's own data, and no official chunk
              will ever use one. A private chunk may not change what the official chunks mean, so a reader that skips it still
              reads the same meshes in the same scene.
            </p>
          }
          es={
            <p>
              Un tag son cuatro letras o dígitos ASCII, y la mayúscula o minúscula de la primera letra dice de quién es: los
              tags en <b>mayúscula</b> son oficiales y están en esta lista; los de <b>minúscula</b> son privados, para datos
              propios de un programa, y ningún chunk oficial va a usar uno. Un chunk privado no puede cambiar lo que significan
              los oficiales, así que un lector que lo saltea lee las mismas mallas en la misma escena.
            </p>
          }
        />
      </div>
    </Section>
  )
}

