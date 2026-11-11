import type { ReactNode } from "react"
import { L } from "@/components/lang"
import { sectionNumber, sections, type SectionId } from "@/lib/toc"

// Una sección de la spec explicada: número, título, bajada y contenido.
export default function Section({
  id,
  lead,
  children,
}: {
  id: SectionId
  lead?: { en: ReactNode; es: ReactNode }
  children: ReactNode
}) {
  const s = sections.find((x) => x.id === id)!
  return (
    <section id={id} className="relative border-t border-line py-16 sm:py-24">
      <p className="label mb-5 flex items-center gap-3">
        <span style={{ color: "var(--tone)" }}>§ {sectionNumber(id)}</span>
        <span className="h-px w-8 bg-line-strong" />
        <span>.bread</span>
      </p>
      <h2 className="display text-[2rem] sm:text-5xl">
        <L en={s.en} es={s.es} />
      </h2>
      {lead && (
        <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-body sm:text-xl">
          <L en={lead.en} es={lead.es} />
        </p>
      )}
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10">{children}</div>
    </section>
  )
}
