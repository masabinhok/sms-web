import { Footer } from "@/components/sections/Footer"
import { Navbar } from "@/components/sections/Navbar"
import { SchoolProvider } from "@/components/SchoolProvider"
import { ReactNode } from "react"

export default function PublicLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <SchoolProvider>
      <section>
        <Navbar />
        {children}
        <Footer />
      </section>
    </SchoolProvider>
  )
}
