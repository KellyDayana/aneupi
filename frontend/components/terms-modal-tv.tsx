"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { apiPersistence } from "@/lib/api-persistence"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onAccept: () => void
}

export function TermsModal({ isOpen, onAccept }: TermsModalProps) {
  const { t } = useLanguage()
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    if (accepted) {
      setIsLoading(true)
      try {
        await apiPersistence.setSinglePreference("tvLiveTermsAccepted", true)
        onAccept()
      } catch (error) {
        console.error("Error saving terms acceptance to API:", error)
        // Fallback a localStorage
        try {
          localStorage.setItem("tvLiveTermsAccepted", "true")
          onAccept()
        } catch (fallbackError) {
          console.error("Error saving terms acceptance to localStorage:", fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="!p-0 bg-white border-none rounded-2xl overflow-hidden shadow-2xl
        !w-[95vw] sm:!w-[600px] md:!w-[700px]
        !max-w-[700px]"
        style={{
          width: '95vw',
          maxWidth: '700px'
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Términos y Condiciones</DialogTitle>
        </VisuallyHidden>
        {/* Header con fondo oscuro */}
        <div className="relative bg-[#003952] pt-8 pb-6 px-6">
          {/* Botón cerrar */}
          <button
            onClick={() => {}}
            disabled
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors opacity-50 cursor-not-allowed"
            aria-label={t("general.close")}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Logo y título */}
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-white text-sm font-semibold tracking-wider mb-1">
                PLATAFORMA INSTITUCIONAL
              </h3>
              <h2 className="text-yellow-400 text-4xl font-bold tracking-wide">
                ANEUPI
              </h2>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          {/* Título de bienvenida */}
          <h2 className="text-3xl font-bold text-[#003952] text-center mb-4">
            {t("terms.welcome") || "¡Bienvenido!"}
          </h2>

          {/* Subtítulo */}
          <p className="text-gray-600 text-center mb-6 text-sm">
            {t("terms.subtitle")}
          </p>

          {/* Reglas principales */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t("terms.mainRules") || "Reglas de uso principales"}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-5 max-h-64 overflow-y-auto border border-gray-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#003952] mt-2"></span>
                  <span className="text-sm leading-relaxed">
                    <strong>{t("terms.rule1Title")}</strong> {t("terms.rule1")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#003952] mt-2"></span>
                  <span className="text-sm leading-relaxed">
                    <strong>{t("terms.rule2Title")}</strong> {t("terms.rule2")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#003952] mt-2"></span>
                  <span className="text-sm leading-relaxed">
                    <strong>{t("terms.rule3Title")}</strong> {t("terms.rule3")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#003952] mt-2"></span>
                  <span className="text-sm leading-relaxed">
                    <strong>{t("terms.rule4Title")}</strong> {t("terms.rule4")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#003952] mt-2"></span>
                  <span className="text-sm leading-relaxed">
                    <strong>{t("terms.rule5Title")}</strong> {t("terms.rule5")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Checkbox de aceptación */}
          <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[#003952] border-gray-300 rounded focus:ring-[#003952] focus:ring-2 cursor-pointer"
            />
            <label 
              htmlFor="accept-terms" 
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              {t("terms.accept")}
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {}}
              disabled
              className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              {t("terms.cancel") || "Cancelar"}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!accepted}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                accepted
                  ? "bg-[#003952] text-white hover:bg-[#002a3a] shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {t("terms.acceptAndContinue")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}