import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "ANEUPI TV Internacional",
  description: "Plataforma de streaming con noticias nacionales, cobertura deportiva y entretenimiento de calidad",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <LanguageProvider>
          <UserProvider>{children}</UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}