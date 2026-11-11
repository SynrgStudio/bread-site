import { B, L } from "@/components/lang"
import Section from "@/components/section"
import { Figure } from "@/components/figures"
import { Tex, TexBlock } from "@/components/tex"

// § 04 a § 06: la escena, la malla y el orden de los triángulos.

function SceneTree() {
  const t = "text-[color:var(--tone)]"
  return (
    <Figure
      caption={{
        en: "A kit of parts as a scene · arm R shows the same mesh as arm L, mirrored, and it is stored once · each reference places one more bolt",
        es: "Un kit de partes como escena · arm R muestra la misma malla que arm L, espejada, y se guarda una vez · cada referencia pone un tornillo más",
      }}
    >
      <pre className="overflow-x-auto font-mono text-[12px] leading-[1.9] text-muted sm:text-[13px]">
        <span className="text-faint">roots</span>
        {"\n└─ "}<span className="text-ink">group</span>{'      "kit"'}
        {"\n   ├─ "}<span className="text-ink">leaf</span>{'    "base"            '}<span className={t}>→ mesh 0</span>
        {"\n   ├─ "}<span className="text-ink">leaf</span>{'    "arm L"           '}<span className={t}>→ mesh 1</span>
        {"\n   ├─ "}<span className="text-ink">leaf</span>{'    "arm R"   M = −x  '}<span className={t}>→ mesh 1</span>
        {"\n   ├─ "}<span className="text-ink">reference</span>{"          T₁  "}<span className={t}>→ subtree 0</span>
        {"\n   └─ "}<span className="text-ink">reference</span>{"          T₂  "}<span className={t}>→ subtree 0</span>
        {"\n\n"}<span className="text-faint">subtree 0</span>
        {"\n└─ "}<span className="text-ink">group</span>{'      "bolt"'}
        {"\n   └─ "}<span className="text-ink">leaf</span>{'    "thread"          '}<span className={t}>→ mesh 2</span>
      </pre>
    </Figure>
  )
}

const RECORDS = [
  { k: "0", en: "group: node fields, then its children", es: "grupo: campos de nodo y después sus hijos" },
  { k: "1", en: "leaf: node fields, then a mesh index", es: "hoja: campos de nodo y después un índice de malla" },
  { k: "2", en: "leaf with a shared mesh: through the list of mesh resources, so editing it changes every leaf that shows it", es: "hoja con malla compartida: a través de la lista de recursos, así editarla cambia todas las hojas que la muestran" },
  { k: "4", en: "reference: node fields, then a subtree index; one more copy of that subtree", es: "referencia: campos de nodo y después un índice de subárbol; una copia más de ese subárbol" },
  { k: "5", en: "subtree: a node index, the root of the next subtree", es: "subárbol: un índice de nodo, la raíz del subárbol siguiente" },
]

export function Scene() {
  return (
    <Section
      id="scene"
      lead={{
        en: "A tree of groups and leaves. Every node has a transform, every leaf shows one mesh, and anything used twice is stored once.",
        es: "Un árbol de grupos y hojas. Cada nodo tiene una transformación, cada hoja muestra una malla, y lo que se usa dos veces se guarda una.",
      }}
    >
      <SceneTree />

      <div>
        <p className="label mb-4">
          <L en="Records · each starts with a u8 kind" es="Registros · cada uno empieza con un u8 de tipo" />
        </p>
        <table className="spec-table">
          <thead>
            <tr>
              <th>
                <L en="Kind" es="Tipo" />
              </th>
              <th>
                <L en="Record" es="Registro" />
              </th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map((r) => (
              <tr key={r.k}>
                <td className="font-mono">{r.k}</td>
                <td>
                  <L en={r.en} es={r.es} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-muted">
          <L
            en="Any other kind, 3 included, makes the payload malformed. The result of an operation on several meshes, such as a boolean difference, is stored as a leaf that shows the resulting mesh."
            es="Cualquier otro tipo, el 3 incluido, hace que el payload esté mal formado. El resultado de una operación entre mallas, como una diferencia booleana, se guarda como una hoja que muestra la malla resultante."
          />
        </p>
      </div>

      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Transforms.</b> A node with a transform stores twelve <code>f64</code>: a 3 × 3 matrix <Tex>M</Tex>, row by row,
            and a translation <Tex>t</Tex>. It takes a point from the node's own space to its parent's:
          </p>
        }
        es={
          <p>
            <b>Transformaciones.</b> Un nodo con transformación guarda doce <code>f64</code>: una matriz <Tex>M</Tex> de 3 × 3,
            fila por fila, y una traslación <Tex>t</Tex>. Lleva un punto del espacio del nodo al de su padre:
          </p>
        }
      />
      <TexBlock tag="5.2">{String.raw`p' = M\,p + t
\qquad\Longleftrightarrow\qquad
\begin{pmatrix} x' \\ y' \\ z' \end{pmatrix} =
\begin{pmatrix} m_{00} & m_{01} & m_{02} \\ m_{10} & m_{11} & m_{12} \\ m_{20} & m_{21} & m_{22} \end{pmatrix}
\begin{pmatrix} x \\ y \\ z \end{pmatrix} +
\begin{pmatrix} t_x \\ t_y \\ t_z \end{pmatrix}`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            Walking down from each root, starting with the identity, every node's world transform is its parent's composed with
            its own, and a leaf sends each vertex <Tex>v</Tex> of its mesh to <Tex>{String.raw`W(\text{leaf})(v)`}</Tex>. A
            reference continues into its subtree as if it were its only child.
          </p>
        }
        es={
          <p>
            Bajando desde cada raíz y empezando por la identidad, la transformación de mundo de cada nodo es la de su padre
            compuesta con la propia, y una hoja manda cada vértice <Tex>v</Tex> de su malla a{" "}
            <Tex>{String.raw`W(\text{hoja})(v)`}</Tex>. Una referencia sigue por su subárbol como si fuera su único hijo.
          </p>
        }
      />
      <TexBlock tag="5.4" es={String.raw`W(\text{nodo}) = W(\text{padre}) \circ T(\text{nodo}),\qquad (A \circ B)(p) = A\big(B(p)\big)`}>{String.raw`W(\text{node}) = W(\text{parent}) \circ T(\text{node}),\qquad (A \circ B)(p) = A\big(B(p)\big)`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              Transforms are <code>f64</code> and vertices <code>f32</code>, so world positions are computed in{" "}
              <code>f64</code> and rounded to <code>f32</code> only at the end, if at all.
            </p>
            <p>
              <b>No cycles, without checking for them.</b> Records are listed children first: every record names only nodes,
              meshes and subtrees listed before it. So no node can contain itself and no subtree can reach itself through
              references, and a reader proves it just by reading in order. It still checks that each node has at most one
              place: one group's child, a root, or a subtree's root.
            </p>
          </>
        }
        es={
          <>
            <p>
              Las transformaciones son <code>f64</code> y los vértices <code>f32</code>, así que las posiciones de mundo se
              calculan en <code>f64</code> y se redondean a <code>f32</code> recién al final, si hace falta.
            </p>
            <p>
              <b>Sin ciclos, sin buscarlos.</b> Los registros van con los hijos primero: cada registro nombra solo nodos, mallas
              y subárboles listados antes. Así ningún nodo puede contenerse a sí mismo y ningún subárbol puede llegar a sí mismo
              por referencias, y un lector lo demuestra con solo leer en orden. Igual verifica que cada nodo tenga a lo sumo un
              lugar: hijo de un grupo, raíz, o raíz de un subárbol.
            </p>
          </>
        }
      />
    </Section>
  )
}

const V2_LAYOUT = [
  { f: "metadata", t: "", en: "the mesh's name and comment, as in version 1", es: "el nombre y el comentario de la malla, como en la versión 1" },
  { f: "vertex count", t: "u32", en: "how many vertices", es: "cuántos vértices" },
  { f: "triangle count", t: "u32", en: "how many triangles", es: "cuántos triángulos" },
  { f: "connectivity", t: "u8", en: "0 A, triangles in their own order · 1 B, reordered", es: "0 A, triángulos en su orden · 1 B, reordenados" },
  { f: "vertex coding", t: "u8", en: "0 meshopt · 1 prediction + rANS · 2 prediction + byte planes", es: "0 meshopt · 1 predicción + rANS · 2 predicción + planos de bytes" },
  { f: "parts", t: "bytes", en: "index buffer, permutation (B only), corners, then the vertex parts", es: "buffer de índices, permutación (solo B), esquinas y las partes de vértices" },
]

export function Mesh() {
  return (
    <Section
      id="mesh"
      lead={{
        en: "Vertices and the triangles that name them. A writer may not reorder anything to compress better: it has to find another way.",
        es: "Vértices y los triángulos que los nombran. Quien escribe no puede reordenar nada para comprimir mejor: tiene que encontrar otra manera.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              <b>Version 1</b> stands on two published bitstreams, the ones meshoptimizer wrote for glTF. Vertices, three{" "}
              <code>f32</code> each, go through the <i>attribute codec</i> (<code>KHR_meshopt_compression</code>, mode 0, byte
              stride 12, no filter, first byte <code>0xA1</code>). It works on bytes and keeps every one, so it keeps every bit of
              every coordinate. Triangles go through the <i>triangle codec</i> (mode 1, first byte <code>0xE1</code>).
            </p>
            <p>
              The triangle codec may hand a triangle back starting at another corner: <Tex>(a,b,c)</Tex> can come back as{" "}
              <Tex>(b,c,a)</Tex> or <Tex>(c,a,b)</Tex>, with the same winding. A list of rotations turns those back, each one a{" "}
              <code>u32</code> gap from the previous one and a <code>u8</code> corner:
            </p>
          </>
        }
        es={
          <>
            <p>
              <b>La versión 1</b> se apoya en dos bitstreams publicados, los que meshoptimizer escribió para glTF. Los
              vértices, tres <code>f32</code> cada uno, pasan por el <i>códec de atributos</i> (
              <code>KHR_meshopt_compression</code>, modo 0, paso de 12 bytes, sin filtro, primer byte <code>0xA1</code>).
              Trabaja sobre bytes y los guarda todos, así que guarda cada bit de cada coordenada. Los triángulos pasan por el{" "}
              <i>códec de triángulos</i> (modo 1, primer byte <code>0xE1</code>).
            </p>
            <p>
              El códec de triángulos puede devolver un triángulo empezando por otra esquina: <Tex>(a,b,c)</Tex> puede volver
              como <Tex>(b,c,a)</Tex> o <Tex>(c,a,b)</Tex>, con el mismo sentido de giro. Una lista de rotaciones los da vuelta,
              cada una con un <code>u32</code> de distancia a la anterior y un <code>u8</code> de esquina:
            </p>
          </>
        }
      />
      <TexBlock tag="6.5">{String.raw`(s_0,\,s_1,\,s_2)\ \xrightarrow{\ c\ }\ \big(s_{c},\ s_{(c+1) \bmod 3},\ s_{(c+2) \bmod 3}\big),\qquad c \in \{1, 2\}`}</TexBlock>

      <div>
        <p className="label mb-4">
          <L en="Version 2 · the chunk writers should write" es="Versión 2 · la que deberían escribir todos" />
        </p>
        <div className="overflow-x-auto">
          <table className="spec-table">
            <thead>
              <tr>
                <th>
                  <L en="Field" es="Campo" />
                </th>
                <th>
                  <L en="Type" es="Tipo" />
                </th>
                <th>
                  <L en="Meaning" es="Significado" />
                </th>
              </tr>
            </thead>
            <tbody>
              {V2_LAYOUT.map((r) => (
                <tr key={r.f}>
                  <td className="font-mono text-[13px]">{r.f}</td>
                  <td className="font-mono text-[13px] text-muted">{r.t}</td>
                  <td>
                    <L en={r.en} es={r.es} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            Version 2 keeps the same mesh in fewer bytes, two ways: triangles can be stored in an order the codec likes, with
            the way back to their own order, and vertices can be <a href="#predict">predicted</a> from the triangles around
            them, so that only the difference is stored. Some parts are <b>bit streams</b>: values packed least significant bit
            first, exactly as long as their bits need, with the unused bits of the last byte at zero. A reader refuses any
            other length.
          </p>
        }
        es={
          <p>
            La versión 2 guarda la misma malla en menos bytes, de dos maneras: los triángulos se pueden guardar en un orden que
            al códec le conviene, con el camino de vuelta a su orden, y los vértices se pueden <a href="#predict">predecir</a>{" "}
            desde los triángulos que los rodean, para guardar solo la diferencia. Algunas partes son <b>bit streams</b>: valores
            empaquetados desde el bit menos significativo, exactamente tan largos como piden sus bits, con los bits sobrantes
            del último byte en cero. Un lector rechaza cualquier otro largo.
          </p>
        }
      />
    </Section>
  )
}

// Conectividad B: el triángulo decodificado j va al lugar p_j de su orden.
const PERM = [3, 0, 4, 1, 5, 2]

function PermutationDiagram() {
  const x = (i: number) => 40 + i * 76
  return (
    <Figure
      caption={{
        en: "Connectivity B · the codec stores triangles in its favourite order; the permutation puts each one back where it was",
        es: "Conectividad B · el códec guarda los triángulos en el orden que más le conviene; la permutación devuelve cada uno a su lugar",
      }}
    >
      <svg viewBox="0 0 500 196" className="mx-auto w-full max-w-[600px] font-mono" role="img" aria-label="permutation">
        <text x="0" y="14" fontSize="10" fill="#83878b" letterSpacing="1">
          DECODING ORDER  j
        </text>
        <text x="0" y="192" fontSize="10" fill="#83878b" letterSpacing="1">
          OWN ORDER  pⱼ
        </text>
        {PERM.map((p, j) => (
          <g key={j}>
            <path
              d={`M${x(j) + 20} 60 C ${x(j) + 20} 100, ${x(p) + 20} 100, ${x(p) + 20} 140`}
              fill="none"
              stroke={j === 0 ? "var(--tone)" : "rgba(240,240,237,.28)"}
              strokeWidth={j === 0 ? 1.6 : 1}
            />
            <rect x={x(j)} y="24" width="40" height="36" fill="#1e2023" stroke="#3d4044" />
            <text x={x(j) + 20} y="47" fontSize="13" fill="#f0f0ed" textAnchor="middle">
              {j}
            </text>
            <text x={x(j) + 36} y="72" fontSize="9" fill={j === 0 ? "var(--tone)" : "#83878b"} textAnchor="end">
              p={p}
            </text>
            <rect x={x(j)} y="140" width="40" height="36" fill="#181a1d" stroke="#3d4044" />
            <text x={x(j) + 20} y="163" fontSize="13" fill="#c9cacb" textAnchor="middle">
              {j}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  )
}

export function Order() {
  return (
    <Section
      id="order"
      lead={{
        en: "The triangle codec compresses best in an order of its own. Version 2 lets it have that order, and stores the way back in a few bits per triangle.",
        es: "El códec de triángulos comprime mejor en un orden propio. La versión 2 le deja ese orden y guarda el camino de vuelta en pocos bits por triángulo.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <p>
            The <b>decoding order</b> is the order triangles are stored in. A <b>corners</b> part, 2 bits per triangle, says
            which corner of each decoded triangle comes first; the value 3 is refused:
          </p>
        }
        es={
          <p>
            El <b>orden de decodificación</b> es el orden en que se guardan los triángulos. Una parte de <b>esquinas</b>, 2
            bits por triángulo, dice qué esquina de cada triángulo decodificado va primero; el valor 3 se rechaza:
          </p>
        }
      />
      <TexBlock tag="6.7">{String.raw`(s_0,\,s_1,\,s_2)\ \xrightarrow{\ r\ }\ \big(s_{r},\ s_{(r+1) \bmod 3},\ s_{(r+2) \bmod 3}\big),\qquad r \in \{0, 1, 2\}`}</TexBlock>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="frame p-6">
          <p className="label mb-3" style={{ color: "var(--tone)" }}>
            <L en="Connectivity A" es="Conectividad A" />
          </p>
          <p className="text-[15px] leading-relaxed">
            <L
              en="Triangles in their own order, vertices numbered as the mesh numbers them. Works for any mesh."
              es="Los triángulos en su orden, los vértices numerados como los numera la malla. Sirve para cualquier malla."
            />
          </p>
        </div>
        <div className="frame p-6">
          <p className="label mb-3" style={{ color: "var(--tone)" }}>
            <L en="Connectivity B" es="Conectividad B" />
          </p>
          <p className="text-[15px] leading-relaxed">
            <L
              en="Triangles in the order the writer picked, usually meshoptimizer's vertex cache order, plus a permutation back."
              es="Los triángulos en el orden que eligió quien escribe, casi siempre el de la caché de vértices de meshoptimizer, más una permutación de vuelta."
            />
          </p>
        </div>
      </div>
      <PermutationDiagram />
      <B
        className="max-w-[44rem]"
        en={
          <p>
            The permutation is a bit stream with one value <Tex>{String.raw`p_j`}</Tex> per decoded triangle, the triangle's
            index in its own order, each in just enough bits for <Tex>t</Tex> triangles:
          </p>
        }
        es={
          <p>
            La permutación es un bit stream con un valor <Tex>{String.raw`p_j`}</Tex> por triángulo decodificado, el índice del
            triángulo en su orden, cada uno en los bits justos para <Tex>t</Tex> triángulos:
          </p>
        }
      />
      <TexBlock tag="6.7" es={String.raw`w = \bitlen\!\big(\max(t,\,2) - 1\big)\ \text{bits por triángulo},\qquad p_j < t,\quad p_j \ne p_k \text{ para } j \ne k`}>{String.raw`w = \bitlen\!\big(\max(t,\,2) - 1\big)\ \text{bits per triangle},\qquad p_j < t,\quad p_j \ne p_k \text{ for } j \ne k`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <>
            <ol>
              <li>
                Put each decoded triangle <Tex>j</Tex>, turned by its corner, at index <Tex>{String.raw`p_j`}</Tex>.
              </li>
              <li>
                Number the vertices by first use: walk the triangles in their own order, corners in order; the first vertex
                met is 0, the next new one 1, and so on.
              </li>
              <li>Give each vertex that number, keeping its coordinates, and rename the corners the same way.</li>
            </ol>
            <p>
              So B only round-trips a mesh whose vertices were already numbered by first use, every vertex used, and a writer
              may use it for nothing else. Meshes welded from an STL are numbered exactly that way. A writer picks B only when
              A's index buffer takes more than 2 bytes per triangle and B stores the triangles smaller.
            </p>
          </>
        }
        es={
          <>
            <ol>
              <li>
                Poner cada triángulo decodificado <Tex>j</Tex>, girado según su esquina, en el índice{" "}
                <Tex>{String.raw`p_j`}</Tex>.
              </li>
              <li>
                Numerar los vértices por primer uso: recorrer los triángulos en su orden y sus esquinas en orden; el primer
                vértice que aparece es el 0, el siguiente nuevo el 1, y así.
              </li>
              <li>Darle a cada vértice ese número, con sus coordenadas, y renombrar las esquinas igual.</li>
            </ol>
            <p>
              Así, B solo devuelve intacta una malla cuyos vértices ya estaban numerados por primer uso, todos usados, y quien
              escribe no puede usarla para otra cosa. Las mallas soldadas desde un STL están numeradas justo así. Se elige B
              solo cuando el buffer de índices de A ocupa más de 2 bytes por triángulo y B guarda los triángulos más chicos.
            </p>
          </>
        }
      />
    </Section>
  )
}
