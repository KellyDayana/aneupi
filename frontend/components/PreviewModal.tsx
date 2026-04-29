import React from 'react'
import DOMPurify from 'isomorphic-dompurify'

type Props = {
  open: boolean
  onClose: () => void
  original?: any
  draft?: any
}

export default function PreviewModal({ open, onClose, original, draft }: Props) {
  if (!open) return null

  const renderContent = (obj: any) => {
    if (!obj) return <div className="text-sm text-muted-foreground">No disponible</div>
    if (typeof obj === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj) }} />
    }
    if (obj.html) {
      return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj.html) }} />
    }
    return <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(obj, null, 2)}</pre>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
      <div className="w-full max-w-6xl bg-white rounded shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Preview — Original ↔ Borrador</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 border">Cerrar</button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 h-[70vh] overflow-auto">
          <section className="border p-4">
            <h4 className="mb-2 font-medium">Original</h4>
            {renderContent(original)}
          </section>

          <section className="border p-4">
            <h4 className="mb-2 font-medium">Borrador</h4>
            {renderContent(draft)}
          </section>
        </div>
      </div>
    </div>
  )
}