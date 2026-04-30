"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface AddNewsButtonProps {
  section: string
  /** ID de categoría correspondiente a la sección. Si no se pasa, se usa 1 como fallback. */
  categoriaId?: number
}

type SubmitStatus = "idle" | "loading" | "success_pending" | "success_published" | "error"

export function AddNewsButton({ section, categoriaId = 1 }: AddNewsButtonProps) {
  const { isLoggedIn, token, userId, userRole } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const emptyForm = {
    titulo: "",
    descripcion: "",
    contenido: "",
    url_imagen: "",
    url_preview_imagen: "",
    tiempo_lectura: 5,
  }
  const [formData, setFormData] = useState(emptyForm)

  const handleClose = () => {
    setIsOpen(false)
    setSubmitStatus("idle")
    setErrorMsg(null)
    setFormData(emptyForm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn || !token || !userId) {
      setErrorMsg("Debes iniciar sesión para enviar un artículo.")
      return
    }

    setSubmitStatus("loading")
    setErrorMsg(null)

    try {
      const res = await fetch(`${API_URL}/api/articulos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          autorId: userId,
          categoriaId,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al enviar el artículo")

      // Si el admin lo crea directamente queda publicado; si es usuario normal, queda pendiente
      const esAdmin = userRole === "admin"
      setSubmitStatus(esAdmin ? "success_published" : "success_pending")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido")
      setSubmitStatus("error")
    }
  }

  // No mostrar el botón si el usuario no está autenticado
  if (!isLoggedIn) return null

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-[#003952] p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 group"
        aria-label="Agregar artículo"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#003952] text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Enviar Artículo — {section.toUpperCase()}</h2>
              <button onClick={handleClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Resultado del envío */}
            {(submitStatus === "success_pending" || submitStatus === "success_published") && (
              <div className="p-6">
                <div className={`flex flex-col items-center gap-4 py-8 text-center ${submitStatus === "success_pending" ? "text-blue-700" : "text-green-700"}`}>
                  <CheckCircle className="w-16 h-16" />
                  {submitStatus === "success_pending" ? (
                    <>
                      <h3 className="text-xl font-bold">¡Artículo enviado para revisión!</h3>
                      <p className="text-gray-600 max-w-sm">
                        Tu artículo fue recibido correctamente. Será revisado por nuestro equipo editorial y publicado una vez aprobado.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">¡Artículo publicado!</h3>
                      <p className="text-gray-600 max-w-sm">
                        El artículo fue creado y publicado exitosamente.
                      </p>
                    </>
                  )}
                  <Button onClick={handleClose} className="mt-2 bg-[#003952] hover:bg-[#004a66]">
                    Cerrar
                  </Button>
                </div>
              </div>
            )}

            {/* Formulario */}
            {(submitStatus === "idle" || submitStatus === "loading" || submitStatus === "error") && (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {userRole !== "admin" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                    Tu artículo será enviado para revisión editorial antes de publicarse.
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ingrese el título del artículo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción / Extracto *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Breve resumen del artículo"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido *</Label>
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder="Contenido completo del artículo"
                    required
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempo_lectura">Tiempo de lectura estimado (minutos) *</Label>
                  <Input
                    id="tiempo_lectura"
                    type="number"
                    min={1}
                    value={formData.tiempo_lectura}
                    onChange={(e) => setFormData({ ...formData, tiempo_lectura: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url_imagen">URL de Imagen de portada</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url_imagen"
                      value={formData.url_imagen}
                      onChange={(e) => setFormData({ ...formData, url_imagen: e.target.value, url_preview_imagen: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon" aria-label="Subir imagen">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.url_imagen && (
                    <div className="mt-2 relative h-40 rounded overflow-hidden border">
                      <img
                        src={formData.url_imagen}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="flex-1 bg-[#003952] hover:bg-[#004a66]"
                  >
                    {submitStatus === "loading"
                      ? "Enviando..."
                      : userRole === "admin"
                      ? "Publicar Artículo"
                      : "Enviar para Revisión"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
