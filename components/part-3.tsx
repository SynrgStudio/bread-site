import { B, L } from "@/components/lang"
import Section from "@/components/section"
import { Figure } from "@/components/figures"
import { Tex, TexBlock } from "@/components/tex"
import { ResidualCalc, SymbolCalc } from "@/components/calc"

// § 07 a § 09: la predicción de vértices, rANS y las cotas de memoria.

// El paralelogramo: A y B comparten arista con un triángulo ya conocido,
// cuyo tercer vértice es C. La predicción es P = A + B − C.
function Parallelogram() {
  const A = { x: 170, y: 30 }
  const Bp = { x: 230, y: 200 }
  const C = { x: 50, y: 160 }
  const P = { x: A.x + Bp.x - C.x, y: A.y + Bp.y - C.y } // (350, 70)
  const M = { x: (A.x + Bp.x) / 2, y: (A.y + Bp.y) / 2 }
  const V = { x: 368, y: 52 } // el vértice de verdad, cerca de la predicción
  const ink = "rgba(240,240,237,.75)"
  return (
    <Figure
      caption={{
        en: "Parallelogram prediction · the new triangle ABv mirrors the known triangle ABC across their shared edge · only the gap between v and P is stored",
        es: "Predicción por paralelogramo · el triángulo nuevo ABv refleja al conocido ABC a través de la arista que comparten · solo se guarda la distancia entre v y P",
      }}
    >
      <svg viewBox="0 0 420 230" className="mx-auto w-full max-w-[560px] font-mono" role="img" aria-label="P = A + B − C">
        <polygon points={`${A.x},${A.y} ${Bp.x},${Bp.y} ${C.x},${C.y}`} fill="rgba(240,240,237,.06)" stroke={ink} strokeWidth="1.2" />
        <path d={`M${A.x} ${A.y}L${P.x} ${P.y}L${Bp.x} ${Bp.y}`} fill="none" stroke="var(--tone)" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d={`M${C.x} ${C.y}L${P.x} ${P.y}`} stroke="rgba(240,240,237,.22)" strokeDasharray="2 5" />
        <path d={`M${A.x} ${A.y}L${V.x} ${V.y}L${Bp.x} ${Bp.y}`} fill="none" stroke="rgba(240,240,237,.35)" />
        <path d={`M${P.x} ${P.y}L${V.x} ${V.y}`} stroke="var(--tone)" strokeWidth="2" />
        {[
          { p: A, t: "A", dx: -6, dy: -10 },
          { p: Bp, t: "B", dx: -4, dy: 22 },
          { p: C, t: "C", dx: -20, dy: 6 },
        ].map(({ p, t, dx, dy }) => (
          <g key={t}>
            <rect x={p.x - 3} y={p.y - 3} width="6" height="6" fill="#f0f0ed" />
            <text x={p.x + dx} y={p.y + dy} fontSize="14" fill="#f0f0ed">
              {t}
            </text>
          </g>
        ))}
        <circle cx={M.x} cy={M.y} r="3.5" fill="none" stroke="rgba(240,240,237,.6)" />
        <text x={M.x + 10} y={M.y + 4} fontSize="11" fill="#83878b">
          ½(A+B)
        </text>
        <circle cx={P.x} cy={P.y} r="5" fill="none" stroke="var(--tone)" strokeWidth="1.5" />
        <text x={P.x - 4} y={P.y + 30} fontSize="12" fill="var(--tone)">
          P = A+B−C
        </text>
        <rect x={V.x - 3} y={V.y - 3} width="6" height="6" fill="var(--tone)" />
        <text x={V.x + 8} y={V.y - 6} fontSize="14" fill="var(--tone)">
          v
        </text>
      </svg>
    </Figure>
  )
}

export function Predict() {
  return (
    <Section
      id="predict"
      lead={{
        en: "Most of a mesh is coordinates, and most coordinates sit almost where their neighbours say they should. Version 2 stores only how far off they are.",
        es: "Casi toda una malla son coordenadas, y casi todas están casi donde sus vecinos dicen que deberían estar. La versión 2 guarda solo cuánto se corren.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <p>
            Vertices are decoded in increasing number, so vertex <Tex>v</Tex> is predicted from vertices{" "}
            <Tex>{String.raw`0 \ldots v-1`}</Tex> and the triangles, turned by their corners. Every triangle that has{" "}
            <Tex>v</Tex> as a corner is visited once, in increasing order. Let <Tex>a</Tex> and <Tex>b</Tex> be the two corners
            after <Tex>v</Tex>, with coordinates <Tex>A</Tex> and <Tex>B</Tex>. Three sums collect what the known neighbours
            say:
          </p>
        }
        es={
          <p>
            Los vértices se decodifican en número creciente, así que el vértice <Tex>v</Tex> se predice a partir de los
            vértices <Tex>{String.raw`0 \ldots v-1`}</Tex> y de los triángulos, girados según sus esquinas. Cada triángulo que
            tiene a <Tex>v</Tex> como esquina se visita una vez, en orden creciente. Sean <Tex>a</Tex> y <Tex>b</Tex> las dos
            esquinas que siguen a <Tex>v</Tex>, con coordenadas <Tex>A</Tex> y <Tex>B</Tex>. Tres sumas juntan lo que dicen los
            vecinos conocidos:
          </p>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            k: "para",
            en: "when a, b < v and another triangle across edge ab has a known third corner c",
            es: "cuando a, b < v y otro triángulo del otro lado de la arista ab tiene una tercera esquina c conocida",
            f: String.raw`A + B - C`,
          },
          {
            k: "mid",
            en: "when a, b < v but nothing known lies across the edge",
            es: "cuando a, b < v pero del otro lado de la arista no hay nada conocido",
            f: String.raw`\tfrac{1}{2}(A + B)`,
          },
          {
            k: "near",
            en: "every known corner, alone",
            es: "cada esquina conocida, sola",
            f: String.raw`A\ \ (a < v),\qquad B\ \ (b < v)`,
          },
        ].map((s, i) => (
          <div key={s.k} className="frame p-5">
            <p className="label mb-3" style={{ color: "var(--tone)" }}>
              {String(i + 1)} · {s.k}
            </p>
            <div className="text-ink">
              <Tex>{s.f}</Tex>
            </div>
            <p className="mt-3 text-sm leading-snug text-muted">
              <L en={s.en} es={s.es} />
            </p>
          </div>
        ))}
      </div>
      <Parallelogram />
      <B
        className="max-w-[44rem]"
        en={
          <p>
            The prediction is the average of the first sum that got anything, in that order. If none did, it is the previous
            vertex, or the origin for vertex 0:
          </p>
        }
        es={
          <p>
            La predicción es el promedio de la primera suma que recibió algo, en ese orden. Si ninguna recibió nada, es el
            vértice anterior, o el origen para el vértice 0:
          </p>
        }
      />
      <TexBlock tag="6.8" es={String.raw`P(v) = \begin{cases}
\dfrac{1}{|\mathcal{P}|}\displaystyle\sum_{\mathcal{P}} (A + B - C) & \mathcal{P} \neq \varnothing \\[10pt]
\dfrac{1}{|\mathcal{M}|}\displaystyle\sum_{\mathcal{M}} \tfrac{1}{2}(A + B) & \mathcal{P} = \varnothing,\ \mathcal{M} \neq \varnothing \\[10pt]
\dfrac{1}{|\mathcal{N}|}\displaystyle\sum_{\mathcal{N}} X & \mathcal{P} = \mathcal{M} = \varnothing,\ \mathcal{N} \neq \varnothing \\[10pt]
x_{v-1} \ \text{ o } \ (0,0,0) & \text{si no}
\end{cases}
\qquad \hat{p} = \operatorname{f32}\big(P(v)\big)`}>{String.raw`P(v) = \begin{cases}
\dfrac{1}{|\mathcal{P}|}\displaystyle\sum_{\mathcal{P}} (A + B - C) & \mathcal{P} \neq \varnothing \\[10pt]
\dfrac{1}{|\mathcal{M}|}\displaystyle\sum_{\mathcal{M}} \tfrac{1}{2}(A + B) & \mathcal{P} = \varnothing,\ \mathcal{M} \neq \varnothing \\[10pt]
\dfrac{1}{|\mathcal{N}|}\displaystyle\sum_{\mathcal{N}} X & \mathcal{P} = \mathcal{M} = \varnothing,\ \mathcal{N} \neq \varnothing \\[10pt]
x_{v-1} \ \text{ or } \ (0,0,0) & \text{otherwise}
\end{cases}
\qquad \hat{p} = \operatorname{f32}\big(P(v)\big)`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Exact on every machine.</b> Every value is an IEEE 754 binary64, every operation rounds to nearest, ties to
            even, in the order written, with no fused multiply-add. The average is rounded to <code>f32</code> once, at the
            end, and a component that is not finite becomes <Tex>+0</Tex>. That is what lets a writer on Windows and a reader in
            a browser compute the same prediction, bit for bit.
          </p>
        }
        es={
          <p>
            <b>Exacto en cualquier máquina.</b> Cada valor es un binary64 de IEEE 754, cada operación redondea al más cercano,
            con empates al par, en el orden escrito, sin multiplicación-suma fusionada. El promedio se redondea a{" "}
            <code>f32</code> una sola vez, al final, y una componente que no es finita pasa a <Tex>+0</Tex>. Eso es lo que
            permite que quien escribe en Windows y quien lee en un navegador calculen la misma predicción, bit a bit.
          </p>
        }
      />

      <div>
        <p className="label mb-4">
          <L en="The residual" es="El residuo" />
        </p>
        <B
          className="max-w-[44rem]"
          en={
            <p>
              The difference is not taken between floats, which could round, but between their bits. <Tex>\ord</Tex> maps the
              32 bits <Tex>u</Tex> of an <code>f32</code> to an unsigned integer that orders the way the values do; the gap
              between the two is then folded so that small gaps, either way, become small numbers:
            </p>
          }
          es={
            <p>
              La diferencia no se toma entre floats, que podrían redondear, sino entre sus bits. <Tex>\ord</Tex> lleva los 32
              bits <Tex>u</Tex> de un <code>f32</code> a un entero sin signo que se ordena como los valores; la distancia entre
              los dos se pliega para que las distancias chicas, para cualquier lado, sean números chicos:
            </p>
          }
        />
      </div>
      <TexBlock tag="6.8" es={String.raw`\begin{aligned}
\ord(u) &= \begin{cases} \lnot u & \text{si } u \text{ tiene el bit de signo prendido} \\ u \lor 2^{31} & \text{si no} \end{cases} \\[6pt]
d &= \big(\ord(x) - \ord(\hat p)\big) \bmod 2^{32} \\[4pt]
r &= \zz(d) = \begin{cases} 2d & d \ge 0 \\ -2d - 1 & d < 0 \end{cases} \quad (d \text{ leído como } \texttt{i32})
\end{aligned}`}>{String.raw`\begin{aligned}
\ord(u) &= \begin{cases} \lnot u & \text{if the sign bit of } u \text{ is set} \\ u \lor 2^{31} & \text{otherwise} \end{cases} \\[6pt]
d &= \big(\ord(x) - \ord(\hat p)\big) \bmod 2^{32} \\[4pt]
r &= \zz(d) = \begin{cases} 2d & d \ge 0 \\ -2d - 1 & d < 0 \end{cases} \quad (d \text{ read as an } \texttt{i32})
\end{aligned}`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            A reader undoes both steps: <Tex>x</Tex> is the <code>f32</code> whose <Tex>\ord</Tex> is{" "}
            <Tex>{String.raw`(\ord(\hat p) + d) \bmod 2^{32}`}</Tex>. Every residual gives back some <code>f32</code>, NaN
            payloads and <Tex>-0.0</Tex> included, so coordinates come back bit for bit, however bad the prediction was. Try
            it:
          </p>
        }
        es={
          <p>
            Un lector deshace los dos pasos: <Tex>x</Tex> es el <code>f32</code> cuyo <Tex>\ord</Tex> es{" "}
            <Tex>{String.raw`(\ord(\hat p) + d) \bmod 2^{32}`}</Tex>. Cualquier residuo devuelve algún <code>f32</code>, los
            NaN con su contenido y el <Tex>-0.0</Tex> incluidos, así que las coordenadas vuelven bit a bit, por mala que haya
            sido la predicción. Probalo:
          </p>
        }
      />
      <ResidualCalc />
    </Section>
  )
}

export function Rans() {
  return (
    <Section
      id="rans"
      lead={{
        en: "Residuals are small and lopsided: exactly what an entropy coder eats. Version 2 codes them with static rANS, in 102 contexts.",
        es: "Los residuos son chicos y desparejos: justo lo que come un codificador de entropía. La versión 2 los codifica con rANS estático, en 102 contextos.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Symbols.</b> A residual <Tex>r</Tex> can take any of 2³² values, too many for a table. So it is split: its bit
            length and its top bits become one of 132 symbols, and the bits below go out raw. With <Tex>{String.raw`L = \bitlen(r)`}</Tex>:
          </p>
        }
        es={
          <p>
            <b>Símbolos.</b> Un residuo <Tex>r</Tex> puede valer cualquiera de 2³² valores, demasiados para una tabla. Entonces
            se parte: su largo en bits y sus bits de arriba forman uno de 132 símbolos, y los bits de abajo van crudos. Con{" "}
            <Tex>{String.raw`L = \bitlen(r)`}</Tex>:
          </p>
        }
      />
      <TexBlock tag="6.9" es={String.raw`\begin{aligned}
L \le 1:&\quad s = 4L,\ \text{sin bits crudos} \\[4pt]
L \ge 2:&\quad n = L - 1,\quad h = \min(n, 2),\quad m = n - h \\
&\quad s = 4L + \Big( \big(\lfloor r / 2^{m} \rfloor \bmod 2^{h}\big) \ll (2 - h) \Big),\qquad \text{crudos} = r \bmod 2^{m} \\[4pt]
\text{vuelta:}&\quad r = 2^{n} + \Big( \big((s \bmod 4) \gg (2 - h)\big) \ll m \Big) + \text{crudos}
\end{aligned}`}>{String.raw`\begin{aligned}
L \le 1:&\quad s = 4L,\ \text{no raw bits} \\[4pt]
L \ge 2:&\quad n = L - 1,\quad h = \min(n, 2),\quad m = n - h \\
&\quad s = 4L + \Big( \big(\lfloor r / 2^{m} \rfloor \bmod 2^{h}\big) \ll (2 - h) \Big),\qquad \text{raw} = r \bmod 2^{m} \\[4pt]
\text{back:}&\quad r = 2^{n} + \Big( \big((s \bmod 4) \gg (2 - h)\big) \ll m \Big) + \text{raw}
\end{aligned}`}</TexBlock>
      <SymbolCalc />
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              A reader refuses a symbol no residual gives: one with <Tex>{String.raw`L \le 1`}</Tex> and{" "}
              <Tex>{String.raw`s \bmod 4 \ne 0`}</Tex>, or one whose lowest <Tex>2-h</Tex> bits are not zero.
            </p>
            <p>
              <b>Contexts.</b> Residuals are coded vertex by vertex, x then y then z, and each one in a context that says how
              big its neighbours were, because big residuals come in clumps. Component <Tex>c</Tex> (0 x, 1 y, 2 z) gets
              context:
            </p>
          </>
        }
        es={
          <>
            <p>
              Un lector rechaza un símbolo que ningún residuo da: uno con <Tex>{String.raw`L \le 1`}</Tex> y{" "}
              <Tex>{String.raw`s \bmod 4 \ne 0`}</Tex>, o uno cuyos <Tex>2-h</Tex> bits más bajos no son cero.
            </p>
            <p>
              <b>Contextos.</b> Los residuos se codifican vértice por vértice, x, después y, después z, y cada uno en un contexto
              que dice qué tan grandes fueron sus vecinos, porque los residuos grandes vienen juntos. La componente{" "}
              <Tex>c</Tex> (0 x, 1 y, 2 z) usa el contexto:
            </p>
          </>
        }
      />
      <TexBlock tag="6.9" es={String.raw`\kappa = 34c + \begin{cases}
\max\big(\bitlen r_x',\ \bitlen r_y',\ \bitlen r_z'\big) & c = 0 \quad (\text{el vértice anterior; } 0 \text{ para el vértice } 0) \\
\bitlen r_x & c = 1 \\
\big\lceil (\bitlen r_x + \bitlen r_y) / 2 \big\rceil & c = 2
\end{cases}
\qquad \kappa \in [0, 101]`}>{String.raw`\kappa = 34c + \begin{cases}
\max\big(\bitlen r_x',\ \bitlen r_y',\ \bitlen r_z'\big) & c = 0 \quad (\text{the vertex before; } 0 \text{ for vertex } 0) \\
\bitlen r_x & c = 1 \\
\big\lceil (\bitlen r_x + \bitlen r_y) / 2 \big\rceil & c = 2
\end{cases}
\qquad \kappa \in [0, 101]`}</TexBlock>
      <B
        className="max-w-[44rem]"
        en={
          <p>
            <b>Tables.</b> A bit stream: for each context, one bit saying whether it has a table; a table gives each of the 132
            symbols one bit, and a frequency minus 1 in 12 bits when the bit is set. Each table's frequencies add up to exactly{" "}
            <Tex>{String.raw`2^{12} = 4096`}</Tex>, and a symbol owns the 4096 slots from the sum of the frequencies before it.
          </p>
        }
        es={
          <p>
            <b>Tablas.</b> Un bit stream: por cada contexto, un bit que dice si tiene tabla; una tabla le da a cada uno de los
            132 símbolos un bit, y una frecuencia menos 1 en 12 bits cuando el bit está prendido. Las frecuencias de cada tabla
            suman exactamente <Tex>{String.raw`2^{12} = 4096`}</Tex>, y cada símbolo es dueño de los slots que empiezan en la
            suma de las frecuencias anteriores.
          </p>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="label mb-3">
            <L en="Decoding one symbol" es="Decodificar un símbolo" />
          </p>
          <TexBlock es={String.raw`\begin{array}{l}
\text{slot} = x \bmod 4096 \\
x \leftarrow f \cdot \lfloor x / 2^{12} \rfloor + \text{slot} - \text{start} \\
\textbf{mientras } x < 2^{23}:\ \ x \leftarrow 256\,x + \text{byte siguiente}
\end{array}`}>{String.raw`\begin{array}{l}
\text{slot} = x \bmod 4096 \\
x \leftarrow f \cdot \lfloor x / 2^{12} \rfloor + \text{slot} - \text{start} \\
\textbf{while } x < 2^{23}:\ \ x \leftarrow 256\,x + \text{next byte}
\end{array}`}</TexBlock>
        </div>
        <div>
          <p className="label mb-3">
            <L en="Encoding, in reverse" es="Codificar, al revés" />
          </p>
          <TexBlock es={String.raw`\begin{array}{l}
x_0 = 2^{23} \\
\textbf{mientras } x \ge 2^{19} f:\ \ \text{emitir } x \bmod 256,\ \ x \leftarrow \lfloor x / 256 \rfloor \\
x \leftarrow 4096 \lfloor x / f \rfloor + \text{start} + (x \bmod f)
\end{array}`}>{String.raw`\begin{array}{l}
x_0 = 2^{23} \\
\textbf{while } x \ge 2^{19} f:\ \ \text{emit } x \bmod 256,\ \ x \leftarrow \lfloor x / 256 \rfloor \\
x \leftarrow 4096 \lfloor x / f \rfloor + \text{start} + (x \bmod f)
\end{array}`}</TexBlock>
        </div>
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              The state is 32 bits and starts as the first four bytes, big-endian. The writer codes the symbols last to first
              and reverses its bytes, so the reader goes first to last. A stream must end with no bytes left and the state back
              at exactly <Tex>{String.raw`2^{23}`}</Tex>: a free check that the whole stream was read.
            </p>
            <p>
              <b>The other codings.</b> Coding 0 stores the vertices with the meshopt attribute codec, as in version 1. Coding 2
              stores the residuals as 12 byte planes, plane <Tex>4c + i</Tex> holding byte <Tex>i</Tex> of every residual of
              component <Tex>c</Tex>, and lets the chunk's zstd squeeze them. A writer may use any coding the mesh meets the
              rules of, and should keep whichever comes out smallest once compressed.
            </p>
          </>
        }
        es={
          <>
            <p>
              El estado es de 32 bits y arranca con los primeros cuatro bytes, en big-endian. Quien escribe codifica los
              símbolos del último al primero y da vuelta sus bytes, así quien lee va del primero al último. Un stream tiene que
              terminar sin bytes sobrantes y con el estado de vuelta en exactamente <Tex>{String.raw`2^{23}`}</Tex>: un control
              gratis de que se leyó el stream entero.
            </p>
            <p>
              <b>Las otras codificaciones.</b> La 0 guarda los vértices con el códec de atributos de meshopt, como en la
              versión 1. La 2 guarda los residuos como 12 planos de bytes, con el plano <Tex>4c + i</Tex> llevando el byte{" "}
              <Tex>i</Tex> de cada residuo de la componente <Tex>c</Tex>, y deja que el zstd del chunk los apriete. Quien
              escribe puede usar cualquier codificación cuyas reglas cumpla la malla, y debería quedarse con la que salga más
              chica una vez comprimida.
            </p>
          </>
        }
      />
    </Section>
  )
}

export function Limits() {
  return (
    <Section
      id="limits"
      lead={{
        en: "Lengths come from the file, so a damaged one can be enormous: one flipped bit in a length asks for 2⁶³ bytes. No count in a .bread file can make a reader ask for more memory than the file could fill.",
        es: "Los largos salen del archivo, así que uno dañado puede ser enorme: un bit dado vuelta en un largo pide 2⁶³ bytes. Ningún conteo de un archivo .bread puede hacer que un lector pida más memoria de la que el archivo podría llenar.",
      }}
    >
      <B
        className="max-w-[44rem]"
        en={
          <p>
            The rule is one inequality, checked before allocating anything: items that take at least <Tex>k</Tex> bytes each
            cannot number more than the bytes left, divided by <Tex>k</Tex>. Every structure in the format comes with its{" "}
            <Tex>k</Tex>:
          </p>
        }
        es={
          <p>
            La regla es una desigualdad, que se verifica antes de reservar nada: elementos que ocupan al menos <Tex>k</Tex> bytes
            cada uno no pueden ser más que los bytes que quedan, divididos por <Tex>k</Tex>. Cada estructura del formato trae su{" "}
            <Tex>k</Tex>:
          </p>
        }
      />
      <TexBlock tag="3.3" es={String.raw`\text{conteo} \;\le\; \left\lfloor \frac{\text{bytes restantes}}{k} \right\rfloor`}>{String.raw`\text{count} \;\le\; \left\lfloor \frac{\text{bytes left}}{k} \right\rfloor`}</TexBlock>
      <div className="overflow-x-auto">
        <table className="spec-table">
          <thead>
            <tr>
              <th>
                <L en="What" es="Qué" />
              </th>
              <th>
                <L en="Bound" es="Cota" />
              </th>
              <th>
                <L en="Why" es="Por qué" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                w: { en: "vertices, attribute codec", es: "vértices, códec de atributos" },
                f: String.raw`3n < 256\,L`,
                y: { en: "every block of up to 256 vertices starts with a 3-byte header", es: "cada bloque de hasta 256 vértices empieza con una cabecera de 3 bytes" },
              },
              {
                w: { en: "triangles, triangle codec", es: "triángulos, códec de triángulos" },
                f: String.raw`t \le L - 17`,
                y: { en: "at least one byte per triangle, past the first byte and a 16-byte tail", es: "al menos un byte por triángulo, más el primer byte y una cola de 16" },
              },
              {
                w: { en: "vertices, rANS coding", es: "vértices, codificación rANS" },
                f: String.raw`n \le 3t`,
                y: { en: "a small payload cannot ask for a large mesh", es: "un payload chico no puede pedir una malla grande" },
              },
              {
                w: { en: "support and hollow entries", es: "entradas de soportes y ahuecado" },
                f: String.raw`k = 20`,
                y: { en: "model, part, generator, version, document", es: "modelo, parte, generador, versión, documento" },
              },
              {
                w: { en: "paint entries · runs", es: "entradas de pintura · tramos" },
                f: String.raw`k = 13 \;\cdot\; k = 5`,
                y: { en: "leaf, kind, version, document · length, value", es: "hoja, tipo, versión, documento · largo, valor" },
              },
            ].map((r) => (
              <tr key={r.f}>
                <td className="!whitespace-normal">
                  <L en={r.w.en} es={r.w.es} />
                </td>
                <td className="whitespace-nowrap">
                  <Tex>{r.f}</Tex>
                </td>
                <td className="text-muted">
                  <L en={r.y.en} es={r.y.es} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 font-mono text-[11px] text-faint">
          <L en="L: the bytes of the buffer · n: vertices · t: triangles" es="L: los bytes del buffer · n: vértices · t: triángulos" />
        </p>
      </div>
      <B
        className="max-w-[44rem]"
        en={
          <>
            <p>
              The same goes for the container. Stored bytes are read as they arrive, or checked against what is left of the
              file. Payloads are decompressed as a stream that stops the moment it passes the raw length, instead of
              allocating the raw length up front; the content size a Zstandard frame records is just as untrusted.
            </p>
            <p>
              So memory grows with what a file really holds once decompressed, never with what a damaged length claims. A file
              crafted on purpose cannot make the reference reader ask for huge amounts of memory, or hang it. A reader may
              still set limits of its own, and should then say the file is too large for it, not that it is damaged.
            </p>
          </>
        }
        es={
          <>
            <p>
              Lo mismo vale para el contenedor. Los bytes guardados se leen a medida que llegan, o se comparan con lo que queda
              del archivo. Los payloads se descomprimen como un stream que frena apenas se pasa del largo crudo, en vez de
              reservar el largo crudo de entrada; el tamaño que anota un frame de Zstandard es igual de poco confiable.
            </p>
            <p>
              Así, la memoria crece con lo que el archivo de verdad tiene una vez descomprimido, nunca con lo que dice un largo
              dañado. Un archivo armado a propósito no puede hacer que el lector de referencia pida memoria enorme, ni
              colgarlo. Un lector puede igual poner límites propios, y entonces tiene que decir que el archivo es demasiado
              grande para él, no que está dañado.
            </p>
          </>
        }
      />
    </Section>
  )
}
