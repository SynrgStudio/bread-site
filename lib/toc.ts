// Las secciones de la página, en orden. El índice lateral y los números de
// cada encabezado salen de acá.
export const sections = [
  { id: "numbers", en: "The numbers", es: "Los números" },
  { id: "holds", en: "What it holds", es: "Qué guarda" },
  { id: "file", en: "Anatomy of a file", es: "Anatomía de un archivo" },
  { id: "scene", en: "The scene", es: "La escena" },
  { id: "mesh", en: "The mesh", es: "La malla" },
  { id: "order", en: "Triangle order", es: "El orden de los triángulos" },
  { id: "predict", en: "Predicting vertices", es: "Predecir vértices" },
  { id: "rans", en: "Entropy coding", es: "Codificación de entropía" },
  { id: "limits", en: "Safe by arithmetic", es: "Seguro por aritmética" },
  { id: "slicer", en: "Slicer data", es: "Datos de slicer" },
  { id: "tests", en: "Conformance", es: "Conformidad" },
  { id: "status", en: "Status", es: "Estado" },
] as const

export type SectionId = (typeof sections)[number]["id"]

export const sectionNumber = (id: SectionId) =>
  String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0")
