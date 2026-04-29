"use client"

import { useState } from "react"
import { X, Plus, Edit, Trash2 } from "lucide-react"

interface NewsCrudModalProps {
  isOpen: boolean
  onClose: () => void
  section: string
}

interface NewsItem {
  id: number
  title: string
  excerpt: string
  category: string
  date: string
}

export function NewsCrudModal({ isOpen, onClose, section }: NewsCrudModalProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Noticia de ejemplo 1",
      excerpt: "Esta es una noticia de ejemplo para demostrar el CRUD",
      category: section.toUpperCase(),
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      title: "Noticia de ejemplo 2",
      excerpt: "Otra noticia de ejemplo en el sistema",
      category: section.toUpperCase(),
      date: new Date().toLocaleDateString(),
    },
  ])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: section.toUpperCase(),
  })

  if (!isOpen) return null

  const handleAdd = () => {
    if (!formData.title || !formData.excerpt) return

    const newItem: NewsItem = {
      id: Date.now(),
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      date: new Date().toLocaleDateString(),
    }

    setNewsItems([...newsItems, newItem])
    setFormData({ title: "", excerpt: "", category: section.toUpperCase() })
  }

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
    })
  }

  const handleUpdate = () => {
    if (!editingId) return

    setNewsItems(
      newsItems.map((item) =>
        item.id === editingId
          ? { ...item, title: formData.title, excerpt: formData.excerpt, category: formData.category }
          : item,
      ),
    )

    setEditingId(null)
    setFormData({ title: "", excerpt: "", category: section.toUpperCase() })
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      setNewsItems(newsItems.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-[#003952] text-white">
          <h2 className="text-2xl font-bold">Administrar Noticias - {section.toUpperCase()}</h2>
          <button onClick={onClose} className="hover:opacity-70">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Editar Noticia" : "Agregar Nueva Noticia"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent"
                  placeholder="Título de la noticia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extracto</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent"
                  rows={3}
                  placeholder="Breve descripción de la noticia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] focus:border-transparent"
                  placeholder="Categoría"
                />
              </div>
              <div className="flex gap-3">
                {editingId ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setFormData({ title: "", excerpt: "", category: section.toUpperCase() })
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar Noticia
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* News List */}
          <div>
            <h3 className="text-lg font-bold mb-4">Noticias Existentes</h3>
            <div className="space-y-3">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
