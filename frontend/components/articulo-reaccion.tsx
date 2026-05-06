"use client"
import { useState, useCallback } from "react"
import { Heart } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Props {
  articuloId: number
  initialCount?: number
  initialLiked?: boolean
  usuarioId?: number
}

export function ArticuloReaccion({ articuloId, initialCount = 0, initialLiked = false, usuarioId = 5 }: Props) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const toggle = useCallback(async () => {
    if (loading) return
    // Actualización optimista
    const prevCount = count
    const prevLiked = liked
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/reacciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          tipoEntidad: "ARTICULO",
          entidadId: articuloId,
          tipoReaccion: "CORAZON",
        }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revertir si falla
      setLiked(prevLiked)
      setCount(prevCount)
    } finally {
      setLoading(false)
    }
  }, [liked, count, loading, articuloId, usuarioId])

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        liked
          ? "bg-red-50 text-red-500 border-red-200"
          : "bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-400"
      }`}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
      <span>{count}</span>
    </button>
  )
}
