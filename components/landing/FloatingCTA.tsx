"use client"

import { useState, useEffect } from "react"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden bg-[#0a0f1a]/90 backdrop-blur-xl border-t border-white/5">
      <button
        onClick={scrollToForm}
        className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-teal-500 to-cyan-400 shadow-lg shadow-teal-500/25"
      >
        무료 상담 받기
      </button>
    </div>
  )
}
