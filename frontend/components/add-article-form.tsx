"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from '@/hooks/use-toast'
import { X, BookOpen, Cloud, FolderIcon, Clock, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const CATEGORY_ID_MAP: Record<string, number> = {
  "Tecnología": 3,
  "Medio Ambiente": 3,
  "Educación": 3,
  "Gastronomía": 3,
  "Negocios": 3,
  "Arte y Cultura": 3,
}

interface AddArticleFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (article: any) => void
}

export function AddArticleForm({ isOpen, onClose, onSubmit }: AddArticleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    readTime: "",
    imageSource: "url",
    imageUrl: "",
    imageFile: null as File | null,
  })
  const [imageError, setImageError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<"idle" | "pending" | "published">("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { toast } = useToast()
  const { token, userId, userRole } = useUser()

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        const msg = 'La imagen no debe pesar más de 1 MB.'
        setImageError(msg)
        toast({ title: 'Imagen demasiado grande', description: msg, variant: 'destructive' })
        e.currentTarget.value = ''
        setFormData((prev) => ({ ...prev, imageFile: null }))
        return
      }
      setImageError(null)
      setFormData((prev) => ({ ...prev, imageFile: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.imageFile && formData.imageFile.size > MAX_IMAGE_SIZE) {
      const msg = 'La imagen no debe pesar más de 1 MB.'
      setImageError(msg)
      toast({ title: 'Imagen demasiado grande', description: msg, variant: 'destructive' })
      return
    }

    setSubmitError(null)
    setSubmitting(true)
    try {
      const readTimeMinutes = parseInt(formData.readTime) || 5
      const imageUrl = formData.imageSource === "url" ? formData.imageUrl : ""

      const body = {
        titulo: formData.title,
        descripcion: formData.description,
        contenido: formData.description,
        url_imagen: imageUrl || "https://via.placeholder.com/300",
        url_preview_imagen: imageUrl || "https://via.placeholder.com/150",
        tiempo_lectura: readTimeMinutes,
        // Si hay userId del contexto lo usa, si no usa 5 (Admin ANEUPI) como autor por defecto
        autorId: userId || 5,
        categoriaId: CATEGORY_ID_MAP[formData.category] ?? 3,
      }

      // Armar headers — con token si existe, sin él si no
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const res = await fetch(`${API_URL}/api/articulos`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al enviar el artículo")

      const esAdmin = userRole === "superadmin"
      setSubmitResult(esAdmin ? "published" : "pending")

      if (esAdmin && data.data) {
        onSubmit({
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          readTime: `${readTimeMinutes} min`,
          imageSource: formData.imageSource,
          imageUrl,
          imageFile: formData.imageFile,
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setSubmitError(msg)
      toast({
        title: 'Error al enviar',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubmitResult("idle")
    setFormData({
      title: "", author: "", description: "", category: "",
      readTime: "", imageSource: "url", imageUrl: "", imageFile: null,
    })
    onClose()
  }

  if (!isOpen) return null

  // Pantalla de resultado tras envío
  if (submitResult !== "idle") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            submitResult === "pending" ? "bg-blue-100" : "bg-green-100"
          }`}>
            <BookOpen className={`w-8 h-8 ${submitResult === "pending" ? "text-blue-600" : "text-green-600"}`} />
          </div>
          {submitResult === "pending" ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Artículo enviado para revisión!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Tu artículo fue recibido correctamente. Será revisado por nuestro equipo editorial y publicado una vez aprobado.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Artículo publicado!</h2>
              <p className="text-gray-500 text-sm mb-6">El artículo fue creado y publicado exitosamente.</p>
            </>
          )}
          <Button onClick={handleClose} className="bg-[#0D3F50] text-white hover:bg-[#0A2D3A] px-8">
            Cerrar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        <div className="bg-[#0D3F50] px-6 py-5 flex items-center justify-between rounded-t-lg">
          <h1 className="text-2xl font-bold text-white flex-1 text-center">Agregar Nuevo Artículo</h1>
          <button onClick={handleClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-[#0D3F50] px-6 py-4 mx-6 mt-6 rounded-lg flex items-center justify-center gap-3">
          <BookOpen className="w-6 h-6 text-yellow-400" />
          <h2 className="text-white font-bold text-center text-lg tracking-wide">INFORMACIÓN DEL ARTÍCULO</h2>
          <BookOpen className="w-6 h-6 text-yellow-400" />
        </div>

        {userRole !== "superadmin" && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            Tu artículo será enviado para revisión editorial antes de publicarse.
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-yellow-600">●</span>
                Título del Artículo:
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ingresa un título atractivo..."
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50] focus:ring-opacity-30 text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-yellow-600">●</span>
                Autor:
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Nombre del autor..."
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50] focus:ring-opacity-30 text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="text-yellow-600">●</span>
                <span className="text-yellow-600">●</span>
              </span>
              Descripción del Artículo:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Escribe una descripción atractiva que capture la atención del lector..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50] focus:ring-opacity-30 text-gray-800 placeholder-gray-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-yellow-600" />
                Categoría:
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D3F50] text-gray-700 font-medium cursor-pointer"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Medio Ambiente">Medio Ambiente</option>
                <option value="Educación">Educación</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Negocios">Negocios</option>
                <option value="Arte y Cultura">Arte y Cultura</option>
              </select>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-700" />
                Tiempo de Lectura:
              </label>
              <select
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D3F50] text-gray-700 font-medium cursor-pointer"
              >
                <option value="">Selecciona el tiempo</option>
                <option value="3">3 min</option>
                <option value="5">5 min</option>
                <option value="8">8 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
              </select>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-yellow-600" />
              Imagen del Artículo:
            </label>
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, imageSource: "url" }))}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  formData.imageSource === "url"
                    ? "bg-[#0D3F50] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, imageSource: "file" }))}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  formData.imageSource === "file"
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Archivo
              </button>
            </div>

            {formData.imageSource === "file" ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100 transition bg-white">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <Cloud className="w-12 h-12 mx-auto text-[#0D3F50] mb-4" />
                  <button
                    type="button"
                    className="px-8 py-2 bg-[#0D3F50] text-white rounded-lg font-semibold hover:bg-[#0A2D3A] transition mb-2"
                  >
                    Seleccionar imagen
                  </button>
                  <p className="text-xs text-gray-500 mt-3">PNG, JPG, GIF</p>
                </label>
                {formData.imageFile && (
                  <p className="text-sm text-gray-600 mt-4">Archivo seleccionado: {formData.imageFile.name}</p>
                )}
                {imageError && <p className="text-sm text-red-600 mt-2">{imageError}</p>}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de la imagen</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50] focus:ring-opacity-30 text-gray-800 placeholder-gray-400"
                />
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                    <div className="w-full h-48 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                      <img src={formData.imageUrl} alt="Vista previa" className="object-contain w-full h-full" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t border-gray-300">
            {submitError && (
              <p className="flex-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                ⚠️ {submitError}
              </p>
            )}
            <Button
              type="button"
              onClick={handleClose}
              className="px-8 py-2 bg-[#0D3F50] text-white hover:bg-[#0A2D3A] rounded-lg font-semibold transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 bg-[#0D3F50] text-white hover:bg-[#0A2D3A] rounded-lg font-semibold transition flex items-center gap-2 disabled:opacity-60"
            >
              <span>+</span>
              {submitting
                ? "Enviando..."
                : userRole === "superadmin"
                ? "Publicar Artículo"
                : "Enviar para Revisión"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
