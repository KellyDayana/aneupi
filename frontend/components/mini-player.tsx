"use client"

import type React from "react"

import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useState, useRef, useEffect } from "react"

interface MiniPlayerProps {
  isOpen: boolean
  onClose: () => void
  channel: {
    title: string
    description: string
    thumbnail: string
    viewers: string
  }
  children?: ReactNode
}

export function MiniPlayer({ isOpen, onClose, channel }: MiniPlayerProps) {
  const [position, setPosition] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const miniPlayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return
    setIsDragging(true)
    if (miniPlayerRef.current) {
      const rect = miniPlayerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={miniPlayerRef}
      onMouseDown={handleMouseDown}
      className="fixed z-50 w-72 bg-white rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-all"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "move",
      }}
    >
      {/* Header - showing only "EN VIVO" */}
      <div className="bg-[#003952] p-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold text-xs">EN VIVO</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar reproductor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <img src={channel.thumbnail || "/placeholder.svg"} alt={channel.title} className="w-full h-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer - channel name display at bottom, smaller text */}
      <div className="bg-[#003952] p-2 text-center">
        <p className="text-white text-xs font-medium line-clamp-1">{channel.title}</p>
      </div>
    </div>
  )
}
