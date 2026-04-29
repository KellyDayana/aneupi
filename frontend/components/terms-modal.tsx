"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="bg-[#003952] px-6 py-4 flex items-center justify-between">
          <div className="text-center w-full">
            <div className="text-xs text-white uppercase font-semibold tracking-wider">Plataforma institucional</div>
            <div className="text-2xl font-extrabold text-yellow-400 leading-none">ANEUPI</div>
          </div>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="ml-4 bg-white/10 hover:bg-white/20 rounded-full p-2 border border-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-center text-[#003952] mb-2">¡Bienvenido!</h3>
          <p className="text-gray-600 text-center mb-4">
            Para acceder a la sección de Artículos, por favor revisa y acepta los términos y condiciones y las reglas de uso.
          </p>

          <div className="max-h-48 overflow-y-auto text-sm text-gray-700 mb-4 border border-gray-100 p-4 rounded">
            <p className="mb-2 font-semibold">Reglas de uso principales</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Respeto y cordialidad en comentarios y publicaciones.</li>
              <li>No publicar contenido ilegal, discriminatorio o que infrinja derechos de terceros.</li>
              <li>No compartir datos personales de terceros sin consentimiento.</li>
              <li>El equipo puede eliminar o moderar contenido que infrinja estas reglas.</li>
              <li>Uso responsable y con fines informativos.</li>
            </ul>
          </div>

          <label className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Acepto los términos y condiciones y las reglas de uso</span>
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!accepted) return
                onAccept()
              }}
              disabled={!accepted}
              className={`px-4 py-2 rounded-md text-white ${
                accepted ? "bg-[#003952] hover:bg-[#002a3a]" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Aceptar y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
