import { Navbar } from "@/components/sections/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        <Navbar/>
        {children}
    </main>
  );
}
