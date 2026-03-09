"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MessageCircle, ArrowRight } from "lucide-react"
import { INDUSTRIES } from "@/lib/industries"
import { ChatBubble } from "./ChatBubble"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function ChatDemoInner() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState(() => {
    const idx = INDUSTRIES.findIndex((ind) => ind.id === tabParam)
    return idx >= 0 ? idx : 0
  })
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const genRef = useRef(0)

  const currentIndustry = INDUSTRIES[activeTab]
  const messages = currentIndustry.demoMessages

  const resetDemo = useCallback(
    (tabIndex: number) => {
      genRef.current++
      setOpacity(0)
      setTimeout(() => {
        setActiveTab(tabIndex)
        setVisibleMessages(0)
        setOpacity(1)
      }, 300)
    },
    []
  )

  useEffect(() => {
    if (visibleMessages >= messages.length) {
      // Loop: restart after 3s
      const gen = genRef.current
      const timer = setTimeout(() => {
        if (gen !== genRef.current) return
        setOpacity(0)
        setTimeout(() => {
          if (gen !== genRef.current) return
          setVisibleMessages(0)
          setOpacity(1)
        }, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }

    const gen = genRef.current
    const timer = setTimeout(() => {
      if (gen !== genRef.current) return
      setVisibleMessages((prev) => prev + 1)
    }, 1200)
    return () => clearTimeout(timer)
  }, [visibleMessages, messages.length])

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ wordBreak: "keep-all" }}
        >
          실제 챗봇 대화를 확인하세요
        </h2>
        <p className="text-gray-400 text-center mb-8" style={{ wordBreak: "keep-all" }}>
          업종별 맞춤 AI 챗봇이 고객 문의에 정확하게 답변합니다
        </p>

        {/* 업종 탭 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {INDUSTRIES.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => {
                if (i !== activeTab) resetDemo(i)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                i === activeTab
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* 챗봇 UI 목업 */}
        <div className="glass-card-static p-4 md:p-6">
          {/* 챗봇 헤더 */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI 상담 챗봇</div>
              <div className="text-xs text-teal-400">온라인</div>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div
            className="space-y-4 min-h-[300px] transition-opacity duration-300"
            style={{ opacity }}
          >
            {messages.slice(0, visibleMessages).map((msg, i) => (
              <ChatBubble key={`${activeTab}-${i}`} role={msg.role} text={msg.text} />
            ))}
            {visibleMessages < messages.length && (
              <ChatBubble role="bot" text="" isTyping />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-400 hover:to-cyan-300 transition-all shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
          >
            우리 회사에도 적용하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export function ChatDemo() {
  return (
    <Suspense fallback={null}>
      <ChatDemoInner />
    </Suspense>
  )
}
