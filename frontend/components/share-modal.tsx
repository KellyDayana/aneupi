"use client"

import { useState, useEffect } from "react"
import { LinkIcon, Check } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url?: string
  title?: string
}

export function ShareModal({ isOpen, onClose, url = "", title = "" }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState(url)
  const { t } = useLanguage()
  const shareTitle = title || t("share.defaultTitle")

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [url])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  const shareOptions = [
    {
      name: "Gatito Plis",
      icon: "https://aneupi.com/assets/gatitoplis-CY6tDKz6.png",
      url: "https://aneupi.com/",
      bgColor: "bg-black",
    },
    {
      name: "Facebook",
      icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bgColor: "bg-[#1877F2]",
    },
    {
      name: "X",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      bgColor: "bg-black",
    },
    {
      name: "Instagram",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
      url: "https://www.instagram.com/",
      bgColor: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    },
    {
      name: "WhatsApp",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
      url: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
      bgColor: "bg-[#25D366]",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white border-2 border-[#003952] text-gray-900
        !w-[90vw] sm:!w-[420px] md:!w-[450px]
        !max-w-[450px]
        rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center 
        mx-auto overflow-hidden shadow-2xl"
        style={{
          width: '90vw',
          maxWidth: '450px'
        }}
      >
        <DialogTitle className="text-lg md:text-xl font-bold text-[#003952] text-center mb-4">
          {t("share.title")}
        </DialogTitle>

        <div className="grid grid-cols-3 gap-4 sm:gap-5 w-full justify-items-center">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 ${option.name === "Gatito Plis" ? "bg-white" : option.bgColor} rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${option.name === "Gatito Plis" ? "p-0" : ""}`}
              >
                <img
                  src={option.icon}
                  alt={option.name}
                  className={`${option.name === "Gatito Plis" ? "w-full h-full rounded-full" : "w-7 h-7 sm:w-8 sm:h-8"} object-contain`}
                  style={option.name === "X" ? { filter: "invert(1)" } : {}}
                />
              </div>
              <span className="text-xs text-gray-700 group-hover:text-[#003952] transition-colors leading-tight text-center font-medium">
                {option.name}
              </span>
            </a>
          ))}

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
              {copied ? (
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              ) : (
                <LinkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700" />
              )}
            </div>
            <span className="text-xs text-gray-700 group-hover:text-[#003952] transition-colors leading-tight text-center font-medium">
              {copied ? t("share.copied") : t("share.copyLink")}
            </span>
          </button>
        </div>

        {copied && (
          <div className="mt-4 bg-green-100 border border-green-500 text-green-700 px-3 py-2 rounded-lg text-xs text-center w-full">
            {t("share.linkCopied")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
