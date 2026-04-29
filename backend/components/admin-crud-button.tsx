"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { NewsCrudModal } from "./news-crud-modal"

interface AdminCrudButtonProps {
  section: string
}

export function AdminCrudButton({ section }: AdminCrudButtonProps) {
  const { userRole } = useUser()
  const [crudModalOpen, setCrudModalOpen] = useState(false)

  if (userRole !== "superadmin") {
    return null
  }

  return (
    <>
      <button
        onClick={() => setCrudModalOpen(true)}
        className="fixed top-24 right-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105 z-40 flex items-center gap-2 font-bold"
        title="Administrar Noticias"
      >
        <Settings className="w-5 h-5" />
        <span>MODIFICAR</span>
      </button>

      <NewsCrudModal isOpen={crudModalOpen} onClose={() => setCrudModalOpen(false)} section={section} />
    </>
  )
}
