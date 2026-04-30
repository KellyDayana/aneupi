"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle, ChevronDown } from "lucide-react"
import { useUser } from "@/contexts/user-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Articulo {
  articuloId: number
  titulo: string
  descripcion: string
  estado: string
  motivo_rechazo?: string | null
  fechaPublicacion: string
  tiempo_lectura: number
  autor: { usuarioId: number; nombre_completo: string; email: string }
  categoria: { categoriaId: number; nombre: string }
}

type FiltroEstado = "TODOS" | "PENDIENTE_APROBACION" | "PUBLICADO" | "RECHAZADO" | "OCULTO"

const ESTADO_LABELS: Record<string, { label: string; color: string }> = {
  PENDIENTE_APROBACION: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  PUBLICADO: { label: "Publicado", color: "bg-green-100 text-green-800 border-green-200" },
  RECHAZADO: { label: "Rechazado", color: "bg-red-100 text-red-800 border-red-200" },
  OCULTO: { label: "Oculto", color: "bg-gray-100 text-gray-700 border-gray-200" },
  APROBADO: { label: "Aprobado", color: "bg-blue-100 text-blue-800 border-blue-200" },
  PROGRAMADO: { label: "Programado", color: "bg-purple-100 text-purple-800 border-purple-200" },
}

// ─── Modal de rechazo ────────────────────────────────────────────────────────
function RechazarModal({
  articulo,
  onConfirm,
  onCancel,
}: {
  articulo: Articulo
  onConfirm: (motivo: string) => void
  onCancel: () => void
}) {
  const [motivo, setMotivo] = useState("")
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Rechazar artículo</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">"{articulo.titulo}"</p>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo de rechazo <span className="text-gray-400">(opcional)</span>
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={4}
          placeholder="Explica brevemente por qué se rechaza este artículo..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onConfirm(motivo)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Confirmar rechazo
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Panel principal ─────────────────────────────────────────────────────────
export function ArticulosRevisionPanel() {
  const { token } = useUser()
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [filtro, setFiltro] = useState<FiltroEstado>("PENDIENTE_APROBACION")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [articuloARechazar, setArticuloARechazar] = useState<Articulo | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const fetchArticulos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      let url: string
      if (filtro === "PENDIENTE_APROBACION") {
        url = `${API_URL}/api/articulos/pendientes`
      } else if (filtro === "TODOS") {
        url = `${API_URL}/api/articulos?take=50`
      } else {
        url = `${API_URL}/api/articulos?estado=${filtro}&take=50`
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar artículos")
      setArticulos(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [token, filtro])

  useEffect(() => {
    fetchArticulos()
  }, [fetchArticulos])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleAprobar = async (articulo: Articulo) => {
    if (!token) return
    setActionLoading(articulo.articuloId)
    try {
      const res = await fetch(`${API_URL}/api/articulos/${articulo.articuloId}/aprobar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al aprobar")
      showSuccess(`"${articulo.titulo}" fue aprobado y publicado.`)
      fetchArticulos()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRechazar = async (motivo: string) => {
    if (!token || !articuloARechazar) return
    setActionLoading(articuloARechazar.articuloId)
    const titulo = articuloARechazar.titulo
    try {
      const res = await fetch(`${API_URL}/api/articulos/${articuloARechazar.articuloId}/rechazar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo_rechazo: motivo || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al rechazar")
      showSuccess(`"${titulo}" fue rechazado.`)
      setArticuloARechazar(null)
      fetchArticulos()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar")
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

  const pendientesCount = articulos.filter((a) => a.estado === "PENDIENTE_APROBACION").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revisión de Artículos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los artículos enviados por los usuarios
          </p>
        </div>
        <button
          onClick={fetchArticulos}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-2">
        {(["PENDIENTE_APROBACION", "PUBLICADO", "RECHAZADO", "OCULTO", "TODOS"] as FiltroEstado[]).map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filtro === estado
                ? "bg-[#003952] text-white border-[#003952]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#003952] hover:text-[#003952]"
            }`}
          >
            {estado === "PENDIENTE_APROBACION" ? (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pendientes
                {pendientesCount > 0 && filtro !== "PENDIENTE_APROBACION" && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {pendientesCount}
                  </span>
                )}
              </span>
            ) : estado === "PUBLICADO" ? (
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Publicados</span>
            ) : estado === "RECHAZADO" ? (
              <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Rechazados</span>
            ) : estado === "TODOS" ? (
              "Todos"
            ) : (
              ESTADO_LABELS[estado]?.label || estado
            )}
          </button>
        ))}
      </div>

      {/* Mensajes de feedback */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Tabla de artículos */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-[#003952]" />
          <span className="ml-2 text-gray-500">Cargando...</span>
        </div>
      ) : articulos.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No hay artículos en este estado</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Título</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Autor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articulos.map((articulo) => (
                <tr key={articulo.articuloId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{articulo.titulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{articulo.descripcion}</p>
                      {articulo.motivo_rechazo && (
                        <p className="text-xs text-red-600 mt-1 italic line-clamp-1">
                          Motivo: {articulo.motivo_rechazo}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-gray-700">{articulo.autor?.nombre_completo}</p>
                    <p className="text-xs text-gray-400">{articulo.autor?.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-gray-600">
                    {articulo.categoria?.nombre}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-gray-500 whitespace-nowrap">
                    {formatDate(articulo.fechaPublicacion)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        ESTADO_LABELS[articulo.estado]?.color || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {ESTADO_LABELS[articulo.estado]?.label || articulo.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {articulo.estado === "PENDIENTE_APROBACION" && (
                        <>
                          <button
                            onClick={() => handleAprobar(articulo)}
                            disabled={actionLoading === articulo.articuloId}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            title="Aprobar y publicar"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => setArticuloARechazar(articulo)}
                            disabled={actionLoading === articulo.articuloId}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            title="Rechazar artículo"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Rechazar
                          </button>
                        </>
                      )}
                      {articulo.estado !== "PENDIENTE_APROBACION" && (
                        <span className="text-xs text-gray-400 italic">Sin acciones</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de rechazo */}
      {articuloARechazar && (
        <RechazarModal
          articulo={articuloARechazar}
          onConfirm={handleRechazar}
          onCancel={() => setArticuloARechazar(null)}
        />
      )}
    </div>
  )
}
