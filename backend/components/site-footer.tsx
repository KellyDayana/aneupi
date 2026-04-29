import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-[#003952] text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Us Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Nosotros</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              ANEUPI TV Internacional es tu fuente confiable de noticias nacionales, cobertura deportiva y
              entretenimiento de calidad.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Quito, Ecuador</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+593 2 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>contacto@aneupi.tv</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/noticias" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/mundo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Mundo
                </Link>
              </li>
              <li>
                <Link href="/estilo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Estilo
                </Link>
              </li>
              <li>
                <Link href="/tv-en-vivo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  TV en Vivo
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Más Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/especiales" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Especiales
                </Link>
              </li>
              <li>
                <Link href="/newsletters" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Newsletters
                </Link>
              </li>
              <li>
                <Link href="/articulos" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Artículos
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Síguenos</h3>
            <p className="text-gray-300 text-sm mb-4">Mantente conectado con nosotros en redes sociales</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-yellow-400 hover:text-[#003952] p-2 rounded-full transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-yellow-400 hover:text-[#003952] p-2 rounded-full transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-yellow-400 hover:text-[#003952] p-2 rounded-full transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-yellow-400 hover:text-[#003952] p-2 rounded-full transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-yellow-400 hover:text-[#003952] p-2 rounded-full transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ANEUPI TV Internacional. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
