import { Footer } from "@/components/sections/Footer"
import { Navbar } from "@/components/sections/Navbar"
import { ReactNode } from "react"

export default function PublicLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <section>
      <Navbar />
      {children}
      <Footer />
    </section>
  )
}
