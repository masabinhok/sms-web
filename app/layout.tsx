import type { Metadata } from "next";
import { Work_Sans} from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "School Management System",
  description: "A simple school management system built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`app ${workSans.className}`}>
        {children}
      </body>
    </html>
  );
}
