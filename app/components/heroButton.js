"use client"

import { useState } from "react"

export default function CustomButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <button
        className="relative text-xl text-white px-6 py-2 border border-neutral-400/80 rounded-md overflow-hidden group transition-all hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] duration-300 ease-in-out hover:border-white cursor-pointer bg-neutral-950/70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
          Learn more
        </span>
        <div
          className={`absolute inset-0 bg-emerald-700/15 transform transition-transform duration-300 ease-out ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
      </button>
    </div>
  )
}

