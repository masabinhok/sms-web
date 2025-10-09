import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SCHOOL_CONFIG } from "@/lib/constants";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SCHOOL_CONFIG.SCHOOL_NAME} – ${SCHOOL_CONFIG.MOTTO}`,
  description: `${SCHOOL_CONFIG.SCHOOL_NAME} - Excellence in education, nurturing young minds for a brighter future. Comprehensive academic programs from early years to higher secondary.`,
  keywords: ["school", "education", "academics", "students", "learning", SCHOOL_CONFIG.SCHOOL_NAME],
  authors: [{ name: SCHOOL_CONFIG.SCHOOL_NAME }],
  openGraph: {
    title: `${SCHOOL_CONFIG.SCHOOL_NAME} – ${SCHOOL_CONFIG.MOTTO}`,
    description: `${SCHOOL_CONFIG.SCHOOL_NAME} - Excellence in education, nurturing young minds for a brighter future.`,
    url: SCHOOL_CONFIG.CONTACT.WEBSITE,
    siteName: SCHOOL_CONFIG.SCHOOL_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SCHOOL_CONFIG.SCHOOL_NAME} – ${SCHOOL_CONFIG.MOTTO}`,
    description: `${SCHOOL_CONFIG.SCHOOL_NAME} - Excellence in education, nurturing young minds for a brighter future.`,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
