import TopBar from "@/components/top-bar"
import Hero from "@/components/hero"
import Toc from "@/components/toc"
import { Guides, Sheet } from "@/components/technical"
import { FileAnatomy, Holds, Numbers } from "@/components/part-1"
import { Mesh, Order, Scene } from "@/components/part-2"
import { Limits, Predict, Rans } from "@/components/part-3"
import { Footer, Slicer, Status, Tests } from "@/components/part-4"

export default function Page() {
  return (
    <>
      <Sheet />
      <Guides />
      <TopBar />
      <main>
        <Hero />
        <div className="wrap grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-24 pt-24">
              <Toc />
            </div>
          </aside>
          <div className="min-w-0">
            <Numbers />
            <Holds />
            <FileAnatomy />
            <Scene />
            <Mesh />
            <Order />
            <Predict />
            <Rans />
            <Limits />
            <Slicer />
            <Tests />
            <Status />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
