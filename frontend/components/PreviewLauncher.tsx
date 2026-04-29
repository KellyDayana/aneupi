import React, { useState } from 'react'
import PreviewModal from '@/components/PreviewModal'

type Props = {
  path: string
  draft: any
  label?: string
}

export default function PreviewLauncher({ path, draft, label = 'Preview' }: Props) {
  const [open, setOpen] = useState(false)
  const [original, setOriginal] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openPreview() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/original?path=${encodeURIComponent(path)}`)
      if (!res.ok) {
        const text = await res.text().catch(() => null)
        throw new Error(text || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setOriginal(data)
      setOpen(true)
    } catch (err: any) {
      setError(err?.message || 'Error al obtener original')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={openPreview}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Cargando...' : label}
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <PreviewModal open={open} onClose={() => setOpen(false)} original={original} draft={draft} />
    </>
  )
}