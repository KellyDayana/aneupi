"use client"
import { useState, useEffect, useCallback } from "react"
import { MessageCircle, Send, CornerDownRight } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Comentario {
  comentarioId: number
  mensaje: string
  fecha_hora: string
  usuario: { nombre_completo: string }
  respuestas?: Comentario[]
}

interface Props {
  articuloId: number
  usuarioId?: number
  nombreUsuario?: string
}

export function ArticuloComentarios({ articuloId, usuarioId = 5, nombreUsuario = "Usuario" }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [respondiendo, setRespondiendo] = useState<number | null>(null)
  const [respuestaMensaje, setRespuestaMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)

  const fetchComentarios = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/articulos/${articuloId}/comentarios`)
      const data = await res.json()
      if (data.success) setComentarios(data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [articuloId])

  useEffect(() => { fetchComentarios() }, [fetchComentarios])

  const enviarComentario = async (mensaje: string, respuestaAId?: number) => {
    if (!mensaje.trim() || enviando) return
    setEnviando(true)
    try {
      const res = await fetch(`${API}/api/articulos/${articuloId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje, usuarioId, articuloId, respuestaAId }),
      })
      if (!res.ok) throw new Error()
      setNuevoMensaje("")
      setRespuestaMensaje("")
      setRespondiendo(null)
      fetchComentarios()
    } catch (e) {
      console.error(e)
    } finally {
      setEnviando(false)
    }
  }

  const formatFecha = (f: string) =>
    new Date(f).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
        <MessageCircle className="w-5 h-5 text-[#003952]" />
        Comentarios ({comentarios.length})
      </h3>

      {/* Formulario nuevo comentario */}
      <div className="flex gap-2 mb-6">
        <input
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003952]/30"
          onKeyDown={(e) => e.key === "Enter" && enviarComentario(nuevoMensaje)}
        />
        <button
          onClick={() => enviarComentario(nuevoMensaje)}
          disabled={enviando || !nuevoMensaje.trim()}
          className="px-4 py-2 bg-[#003952] text-white rounded-lg text-sm font-medium hover:bg-[#002a3a] disabled:opacity-50 flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de comentarios */}
      {loading ? (
        <p className="text-sm text-gray-400">Cargando comentarios...</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-gray-400">Sé el primero en comentar.</p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <div key={c.comentarioId} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#003952]">{c.usuario?.nombre_completo}</span>
                <span className="text-xs text-gray-400">{formatFecha(c.fecha_hora)}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{c.mensaje}</p>
              <button
                onClick={() => setRespondiendo(respondiendo === c.comentarioId ? null : c.comentarioId)}
                className="text-xs text-[#003952] hover:underline flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3" /> Responder
              </button>

              {/* Formulario de respuesta */}
              {respondiendo === c.comentarioId && (
                <div className="flex gap-2 mt-2">
                  <input
                    value={respuestaMensaje}
                    onChange={(e) => setRespuestaMensaje(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#003952]/30"
                    onKeyDown={(e) => e.key === "Enter" && enviarComentario(respuestaMensaje, c.comentarioId)}
                  />
                  <button
                    onClick={() => enviarComentario(respuestaMensaje, c.comentarioId)}
                    disabled={enviando || !respuestaMensaje.trim()}
                    className="px-3 py-1.5 bg-[#003952] text-white rounded-lg text-xs disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Respuestas */}
              {c.respuestas && c.respuestas.length > 0 && (
                <div className="mt-3 ml-4 space-y-2 border-l-2 border-gray-200 pl-3">
                  {c.respuestas.map((r) => (
                    <div key={r.comentarioId} className="bg-white rounded p-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-[#003952]">{r.usuario?.nombre_completo}</span>
                        <span className="text-xs text-gray-400">{formatFecha(r.fecha_hora)}</span>
                      </div>
                      <p className="text-xs text-gray-700">{r.mensaje}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
