"use client"

import { ArrowRight } from "lucide-react"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* 태그라인 */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
          <span className="text-teal-400 text-sm font-medium">AI 고객응대 챗봇</span>
        </div>

        {/* 헤드라인 */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          style={{ wordBreak: "keep-all" }}
        >
          고객이 물어보면{" "}
          <br className="hidden md:block" />
          <span className="text-gradient-animate">우리 데이터로</span>{" "}
          <br className="hidden md:block" />
          답합니다
        </h1>

        {/* 서브카피 */}
        <p
          className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto"
          style={{ wordBreak: "keep-all" }}
        >
          일반 AI 챗봇은 우리 회사를 모릅니다.
          <br />
          상품, 서비스, 가격, 운영시간 —
          <br />
          우리 데이터 기반 RAG 챗봇이 24시간 정확하게 안내합니다.
        </p>

        {/* CTA 버튼 */}
        <button
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-400 hover:to-cyan-300 transition-all shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
        >
          무료 상담 받기
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* 신뢰 마이크로카피 */}
        <p className="mt-4 text-sm text-gray-500">
          * 설치비 0원 · 5분 세팅 · 무료 체험
        </p>
      </div>
    </section>
  )
}
