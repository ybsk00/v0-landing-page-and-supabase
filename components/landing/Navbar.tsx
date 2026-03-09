"use client"

import { ArrowRight } from "lucide-react"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-8 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5">
      <span className="text-sm font-semibold text-white/80 tracking-wide select-none">
        LumiBreeze
      </span>
      <button
        onClick={scrollToForm}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-400 hover:to-cyan-300 transition-all shadow-lg shadow-teal-500/20"
      >
        무료 상담 받기
      </button>
    </header>
  )
}
