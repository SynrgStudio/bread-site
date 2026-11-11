import Logo from "@/components/logo"
import LangToggle from "@/components/lang-toggle"
import { Coords } from "@/components/technical"

export default function TopBar() {
  return (
    <header className="topbar sticky top-0 z-50 border-b border-line">
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <a href="#top" className="display flex items-center gap-2.5 text-lg" style={{ letterSpacing: "-0.02em" }}>
          <Logo className="h-6 w-6" />
          <span>
            <span className="text-faint">.</span>bread
          </span>
        </a>
        <span className="mr-auto">
          <Coords />
        </span>
        <nav className="flex items-center gap-6 font-mono text-xs text-muted sm:gap-8">
          <a href="#numbers" className="hidden transition-colors hover:text-ink sm:block">
            <span className="l-en">Numbers</span>
            <span className="l-es">Números</span>
          </a>
          <a href="#predict" className="hidden transition-colors hover:text-ink md:block">
            <span className="l-en">Math</span>
            <span className="l-es">Matemática</span>
          </a>
          <a href="https://synrgs.tech" className="whitespace-nowrap transition-colors hover:text-ink">
            synrgs.tech ↗
          </a>
          <LangToggle />
        </nav>
      </div>
    </header>
  )
}
