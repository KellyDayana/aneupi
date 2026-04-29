import type { Metadata } from "next"
import { AdminProtectedLayout } from "@/components/admin-protected-layout"

export const metadata: Metadata = {
  title: "Admin ANEUPI",
  description: "Panel de control para administradores",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <div className="bg-gray-50 min-h-screen">
        <AdminProtectedLayout>{children}</AdminProtectedLayout>
      </div>
  )
}