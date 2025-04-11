
import Headers from "@/components/home/header"
import Hero from "@/components/home/hero-section"
import CodePlayground from "@/components/home/playground"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Headers/>
      <Hero />
      <CodePlayground/>
    </div>
  )
}
