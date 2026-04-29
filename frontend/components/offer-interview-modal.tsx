"use client"

import type React from "react"

import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useLanguage } from "@/contexts/language-context"

interface OfferInterviewModalProps {
  isOpen: boolean
  onClose: () => void
}

const translations = {
  es: {
    title: "Ofrecer una Entrevista",
    subtitle: "Completa la información para proponer una entrevista al equipo de ANEUPI Noticias.",
    personalData: "Datos Personales",
    fullName: "Nombre completo",
    profession: "Profesión",
    identification: "Cédula o identificación",
    email: "Correo electrónico",
    phone: "Teléfono de contacto",
    interviewInfo: "Información de Entrevista",
    interviewTitle: "Tema o título de la entrevista",
    description: "Descripción breve del contenido o propósito",
    interviewType: "Seleccione el tipo de entrevista",
    institutional: "Institucional",
    artistic: "Artística",
    sports: "Deportiva",
    political: "Política",
    other: "Otro",
    date: "Seleccione una fecha",
    cancel: "Cancelar",
    submit: "Enviar solicitud",
    success: "Tu solicitud ha sido enviada exitosamente.",
  },
  en: {
    title: "Offer an Interview",
    subtitle: "Complete the information to propose an interview to the ANEUPI News team.",
    personalData: "Personal Data",
    fullName: "Full name",
    profession: "Profession",
    identification: "ID or identification",
    email: "Email address",
    phone: "Contact phone",
    interviewInfo: "Interview Information",
    interviewTitle: "Interview topic or title",
    description: "Brief description of content or purpose",
    interviewType: "Select interview type",
    institutional: "Institutional",
    artistic: "Artistic",
    sports: "Sports",
    political: "Political",
    other: "Other",
    date: "Select a date",
    cancel: "Cancel",
    submit: "Submit request",
    success: "Your request has been sent successfully.",
  },
}

export function OfferInterviewModal({ isOpen, onClose }: OfferInterviewModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(t.success)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-xl bg-white shadow-2xl border-2 border-yellow-400">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-[#003952] p-3 border-b border-yellow-400/30">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5">
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            {t.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Data Section */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">
                {t.personalData}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input type="text" placeholder={t.fullName} required className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9" />
                <Input type="text" placeholder={t.profession} required className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9" />
                <Input
                  type="text"
                  placeholder={t.identification}
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9"
                />
                <Input
                  type="tel"
                  placeholder={t.phone}
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9"
                />
                <Input 
                  type="email" 
                  placeholder={t.email} 
                  required 
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9 md:col-span-2" 
                />
              </div>
            </div>

            {/* Interview Information Section */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">{t.interviewInfo}</h3>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder={t.interviewTitle}
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9"
                />
                <textarea
                  placeholder={t.description}
                  required
                  className="w-full h-20 px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003952] placeholder:text-gray-500 text-sm resize-none"
                />
                <select
                  required
                  defaultValue=""
                  className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003952] text-sm h-9"
                >
                  <option value="" disabled>
                    {t.interviewType}
                  </option>
                  <option value="institutional">{t.institutional}</option>
                  <option value="artistic">{t.artistic}</option>
                  <option value="sports">{t.sports}</option>
                  <option value="political">{t.political}</option>
                  <option value="other">{t.other}</option>
                </select>
                <Input
                  type="date"
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm h-9"
                  placeholder={t.date}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold h-9"
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-[#003952] text-white px-4 py-1.5 rounded-md hover:bg-[#002a3a] transition-colors font-semibold text-sm shadow h-9"
              >
                {t.submit}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
