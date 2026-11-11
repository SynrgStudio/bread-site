import type { Metadata } from "next"
import localFont from "next/font/local"
import "katex/dist/katex.min.css"
import "./globals.css"

// Las mismas tipografías recortadas que synrgs.tech.
const sans = localFont({
  src: "./fonts/archivo.woff2",
  weight: "400 700",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false, // las de respaldo están en globals.css, medidas a mano
})
const mono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: ".bread — a small, lossless 3D file format",
  description:
    "The .bread file format: triangle meshes and the scene that places them, bit for bit, in a twelfth of an STL. The format, its numbers and all of its math.",
  metadataBase: new URL("https://bread.synrgs.tech"),
}

// Antes de pintar: el idioma guardado, o el del navegador la primera vez.
const LANG_SCRIPT = `try{var s=localStorage.getItem("lang"),l=s==="en"||s==="es"?s:(navigator.language||"").toLowerCase().indexOf("es")===0?"es":"en",r=document.documentElement;r.dataset.lang=l;r.lang=l}catch(e){}`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
