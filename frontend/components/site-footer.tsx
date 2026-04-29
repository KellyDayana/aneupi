import Link from "next/link"

export function SiteFooter({ variant = 'full' }: { variant?: 'full' | 'minimal' }) {
  const year = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className="bg-[#003952] text-white mt-4 font-['Arial',_sans-serif]">
        {/* Usamos un grid de 3 columnas en pantallas medianas/grandes. 
          Esto garantiza que el botón quede a la izquierda y el texto exactamente al centro.
          Al quitar 'container mx-auto', permitimos que se expanda al 100% del ancho.
        */}
        <div className="w-full px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          
          {/* 1. Izquierda: Botón administrador (más pequeño) */}
          <div className="flex justify-start">
            <Link
              href="/login"
              className="inline-flex rounded-full bg-yellow-500 px-3 py-1 text-[12px] font-semibold text-[#003952] transition hover:bg-yellow-400"
            >
              |
            </Link>
          </div>

          {/* 2. Centro: Párrafo de derechos de autor */}
          <div className="flex justify-center text-center">
            <p className="text-gray-400 text-[14px]">
              © {year} ANEUPI TV Internacional. Todos los derechos reservados.
            </p>
          </div>

          {/* 3. Derecha: Columna vacía para mantener el balance y el centro perfecto */}
          <div className="hidden md:block"></div>
          
        </div>
      </footer>
    )
  }

  return null
}