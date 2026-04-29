"use client"

import Link from "next/link"

export default function EditorialPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Editorial ANEUPI</h1>
          <p className="text-gray-600 mb-4">Bienvenido a la sección Editorial. Aquí publicaremos columnas y opiniones institucionales.</p>

          <div className="space-y-2">
            <Link href="/articulos" className="block text-[#003952] font-medium hover:underline">
              ← Volver a Artículos
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
