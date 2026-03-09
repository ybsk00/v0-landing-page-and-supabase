"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, ArrowRight } from "lucide-react"
import { INDUSTRIES } from "@/lib/industries"
import { ChatBubble } from "./ChatBubble"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

export function ChatDemo() {
  const [activeTab, setActiveTab] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 마운트 시 URL tab 파라미터로 초기 탭 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab) {
        const idx = INDUSTRIES.findIndex((ind) => ind.id === tab)
        if (idx >= 0) setActiveTab(idx)
      }
    }
    setMounted(true)
  }, [])

  const currentIndustry = INDUSTRIES[activeTab]
  const messages = currentIndustry.demoMessages

  // 메시지 순차 표시 타이머
  useEffect(() => {
    if (!mounted) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (visibleMessages >= messages.length) {
      // 모든 메시지 표시 완료 → 3초 후 리셋
      timerRef.current = setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setVisibleMessages(0)
          setIsTransitioning(false)
        }, 300)
      }, 3000)
    } else {
      // 다음 메시지 표시
      timerRef.current = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1)
      }, 1200)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [visibleMessages, messages.length, mounted])

  // 탭 전환
  const handleTabChange = (tabIndex: number) => {
    if (tabIndex === activeTab) return
    if (timerRef.current) clearTimeout(timerRef.current)

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(tabIndex)
      setVisibleMessages(0)
      setIsTransitioning(false)
    }, 300)
  }

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
        <div className="flex gap-1.5 md:gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {INDUSTRIES.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => handleTabChange(i)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
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
            style={{ opacity: isTransitioning ? 0 : 1 }}
          >
            {messages.slice(0, visibleMessages).map((msg, i) => (
              <ChatBubble key={`${activeTab}-${i}`} role={msg.role} text={msg.text} />
            ))}
            {visibleMessages < messages.length && visibleMessages > 0 && (
              <ChatBubble role="bot" text="" isTyping />
            )}
            {visibleMessages === 0 && !isTransitioning && (
              <ChatBubble role="bot" text="" isTyping />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-400 hover:to-cyan-300 transition-all shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
          >
            우리 회사에도 적용하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
