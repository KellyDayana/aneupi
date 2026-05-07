"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, RefreshCw, AlertCircle, Clock, RotateCcw } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface ArticuloEliminado {
  articuloId: number
  titulo: string
  descripcion: string
  fechaEliminacion: string
  nombre_autor?: string | null
  autor: { nombre_completo: string; email: string }
  categoria: { nombre: string }
}

function diasRestantes(fechaEliminacion: string): number {
  const eliminado = new Date(fechaEliminacion)
  const expira = new Date(eliminado)
  expira.setDate(expira.getDate() + 30)
  const hoy = new Date()
  const diff = Math.ceil((expira.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export function ArticulosPapelera() {
  const [articulos, setArticulos] = useState<ArticuloEliminado[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eliminandoId, setEliminandoId] = useState<number | null>(null)
  const [restaurandoId, setRestaurandoId] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const fetchEliminados = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/articulos/eliminados`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar papelera")
      setArticulos(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEliminados() }, [fetchEliminados])

  const restaurarArticulo = async (articulo: ArticuloEliminado) => {
    setRestaurandoId(articulo.articuloId)
    try {
      const res = await fetch(`${API_URL}/api/articulos/${articulo.articuloId}/restaurar`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Error al restaurar")
      setSuccessMsg(`"${articulo.titulo}" restaurado y publicado nuevamente.`)
      setTimeout(() => setSuccessMsg(null), 3000)
      fetchEliminados()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restaurar")
    } finally {
      setRestaurandoId(null)
    }
  }

  const eliminarPermanente = async (articulo: ArticuloEliminado) => {
    if (!confirm(`¿Eliminar permanentemente "${articulo.titulo}"? Esta acción no se puede deshacer.`)) return
    setEliminandoId(articulo.articuloId)
    try {
      const res = await fetch(`${API_URL}/api/articulos/${articulo.articuloId}/permanente`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar")
      setSuccessMsg(`"${articulo.titulo}" eliminado permanentemente.`)
      setTimeout(() => setSuccessMsg(null), 3000)
      fetchEliminados()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setEliminandoId(null)
    }
  }

  const formatFecha = (f: string) =>
    new Date(f).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#003952] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Papelera de Artículos
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Los artículos se eliminan permanentemente después de 30 días
          </p>
        </div>
        <button
          onClick={fetchEliminados}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Los artículos en la papelera se eliminan automáticamente al cumplirse 30 días desde su eliminación. Puedes eliminarlos antes de forma permanente.</p>
      </div>

      {/* Feedback */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">✕</button>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-[#003952]" />
          <span className="ml-2 text-gray-500">Cargando...</span>
        </div>
      ) : articulos.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Trash2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">La papelera está vacía</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Título</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Autor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Eliminado</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Expira en</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articulos.map((articulo) => {
                const dias = diasRestantes(articulo.fechaEliminacion)
                return (
                  <tr key={articulo.articuloId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900 line-clamp-1">{articulo.titulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{articulo.descripcion}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-gray-600 text-xs">
                      {articulo.nombre_autor || articulo.autor?.nombre_completo}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-gray-600 text-xs">
                      {articulo.categoria?.nombre}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatFecha(articulo.fechaEliminacion)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        dias <= 3
                          ? "bg-red-100 text-red-700"
                          : dias <= 7
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Clock className="w-3 h-3" />
                        {dias} día{dias !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => restaurarArticulo(articulo)}
                          disabled={restaurandoId === articulo.articuloId}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                          title="Restaurar artículo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                        <button
                          onClick={() => eliminarPermanente(articulo)}
                          disabled={eliminandoId === articulo.articuloId}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
