"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Plus, Edit, Trash2, RefreshCw, AlertCircle } from "lucide-react"
import { ArticulosRevisionPanel } from "@/components/articulos-revision-panel"
import { useUser } from "@/contexts/user-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface NewsCrudModalProps {
  isOpen: boolean
  onClose: () => void
  section: string
}

interface Articulo {
  articuloId: number
  titulo: string
  descripcion: string
  estado: string
  fechaPublicacion: string
  autor: { nombre_completo: string }
  categoria: { nombre: string }
}

const ESTADO_LABELS: Record<string, { label: string; color: string }> = {
  PENDIENTE_APROBACION: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  PUBLICADO: { label: "Publicado", color: "bg-green-100 text-green-800" },
  RECHAZADO: { label: "Rechazado", color: "bg-red-100 text-red-800" },
  OCULTO: { label: "Oculto", color: "bg-gray-100 text-gray-700" },
  APROBADO: { label: "Aprobado", color: "bg-blue-100 text-blue-800" },
}

type Tab = "lista" | "revision"

export function NewsCrudModal({ isOpen, onClose, section }: NewsCrudModalProps) {
  const { token } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>("lista")
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendientesCount, setPendientesCount] = useState(0)

  // Formulario de creación/edición
  const emptyForm = { titulo: "", descripcion: "", contenido: "", url_imagen: "", url_preview_imagen: "", tiempo_lectura: 5, categoriaId: 1 }
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const fetchArticulos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [allRes, pendRes] = await Promise.all([
        fetch(`${API_URL}/api/articulos?take=50`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/articulos/pendientes`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const allData = await allRes.json()
      const pendData = await pendRes.json()
      if (!allRes.ok) throw new Error(allData.error || "Error al cargar artículos")
      setArticulos(allData.data)
      setPendientesCount(pendData.count ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (isOpen) fetchArticulos()
  }, [isOpen, fetchArticulos])

  if (!isOpen) return null

  const handleEdit = (articulo: Articulo) => {
    setEditingId(articulo.articuloId)
    setFormData({
      titulo: articulo.titulo,
      descripcion: articulo.descripcion,
      contenido: "",
      url_imagen: "",
      url_preview_imagen: "",
      tiempo_lectura: 5,
      categoriaId: 1,
    })
    setFormError(null)
    setFormSuccess(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de ocultar este artículo?") || !token) return
    try {
      const res = await fetch(`${API_URL}/api/articulos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Error al ocultar el artículo")
      fetchArticulos()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion) {
      setFormError("Título y descripción son requeridos")
      return
    }
    if (!token) return
    setFormLoading(true)
    setFormError(null)
    setFormSuccess(null)

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/api/articulos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ titulo: formData.titulo, descripcion: formData.descripcion }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al actualizar")
        setFormSuccess("Artículo actualizado correctamente")
        setEditingId(null)
        setFormData(emptyForm)
        fetchArticulos()
      } else {
        const res = await fetch(`${API_URL}/api/articulos`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...formData, autorId: 1 }), // autorId del admin actual
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al crear")
        setFormSuccess("Artículo creado y publicado correctamente")
        setFormData(emptyForm)
        fetchArticulos()
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setFormLoading(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-[#003952] text-white flex-shrink-0">
          <h2 className="text-2xl font-bold">Administrar Artículos — {section.toUpperCase()}</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab("lista")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "lista"
                ? "border-[#003952] text-[#003952]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Lista de Artículos
          </button>
          <button
            onClick={() => setActiveTab("revision")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "revision"
                ? "border-[#003952] text-[#003952]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Revisión de Artículos
            {pendientesCount > 0 && (
              <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {pendientesCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── TAB: Lista de artículos ── */}
          {activeTab === "lista" && (
            <div className="space-y-6">
              {/* Formulario */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">{editingId ? "Editar Artículo" : "Agregar Nuevo Artículo"}</h3>

                {formError && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {formSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent text-sm"
                      placeholder="Título del artículo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Extracto *</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent text-sm"
                      rows={3}
                      placeholder="Breve descripción del artículo"
                    />
                  </div>
                  {!editingId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                        <textarea
                          value={formData.contenido}
                          onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent text-sm"
                          rows={5}
                          placeholder="Contenido completo del artículo"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                          <input
                            type="text"
                            value={formData.url_imagen}
                            onChange={(e) => setFormData({ ...formData, url_imagen: e.target.value, url_preview_imagen: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent text-sm"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de lectura (min)</label>
                          <input
                            type="number"
                            min={1}
                            value={formData.tiempo_lectura}
                            onChange={(e) => setFormData({ ...formData, tiempo_lectura: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={formLoading}
                      className="flex-1 bg-[#003952] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#004a66] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : editingId ? (
                        <><Edit className="w-4 h-4" /> Actualizar</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Agregar Artículo</>
                      )}
                    </button>
                    {editingId && (
                      <button
                        onClick={() => { setEditingId(null); setFormData(emptyForm); setFormError(null) }}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Artículos ({articulos.length})</h3>
                  <button onClick={fetchArticulos} disabled={loading} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <RefreshCw className="w-5 h-5 animate-spin text-[#003952]" />
                    <span className="ml-2 text-gray-500 text-sm">Cargando...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {articulos.map((articulo) => (
                      <div
                        key={articulo.articuloId}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-bold text-gray-900 truncate">{articulo.titulo}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_LABELS[articulo.estado]?.color || "bg-gray-100 text-gray-700"}`}>
                                {ESTADO_LABELS[articulo.estado]?.label || articulo.estado}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{articulo.descripcion}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                              <span>{articulo.autor?.nombre_completo}</span>
                              <span>·</span>
                              <span>{articulo.categoria?.nombre}</span>
                              <span>·</span>
                              <span>{formatDate(articulo.fechaPublicacion)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(articulo)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(articulo.articuloId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Ocultar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {articulos.length === 0 && !loading && (
                      <p className="text-center text-gray-400 py-8">No hay artículos registrados</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: Revisión ── */}
          {activeTab === "revision" && <ArticulosRevisionPanel />}
        </div>
      </div>
    </div>
  )
}
