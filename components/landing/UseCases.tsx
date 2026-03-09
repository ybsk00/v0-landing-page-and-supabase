"use client"

import {
  Stethoscope,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

function scrollToForm() {
  const formEl = document.getElementById("cta-form")
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

interface UseCase {
  icon: LucideIcon
  label: string
  title: string
  examples: string[]
  color: string
}

const useCases: UseCase[] = [
  {
    icon: Stethoscope,
    label: "병원·의원",
    title: "진료시간, 의료진 안내부터 예약까지",
    examples: [
      "진료과목·의료진 안내",
      "진료시간·휴진일 응답",
      "예약 유도 자동화",
      "의료법 준수 필터링",
    ],
    color: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: ShoppingBag,
    label: "쇼핑몰·커머스",
    title: "배송, 교환, 상품 문의 자동 응대",
    examples: [
      "주문·배송 상태 안내",
      "교환·반품 절차 안내",
      "상품 추천·비교",
      "재고·가격 문의 처리",
    ],
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: GraduationCap,
    label: "교육·학원",
    title: "수강 상담부터 레벨테스트 예약까지",
    examples: [
      "커리큘럼·수강료 안내",
      "레벨테스트 예약 유도",
      "시간표·잔여석 확인",
      "학원 위치·주차 안내",
    ],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Briefcase,
    label: "전문서비스",
    title: "반복 상담 질문을 AI가 대신 응대",
    examples: [
      "서비스 절차·비용 안내",
      "상담 예약 자동 유도",
      "필요 서류·준비물 안내",
      "FAQ 자동 응답",
    ],
    color: "from-amber-500/20 to-orange-500/20",
  },
]

export function UseCases() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ wordBreak: "keep-all" }}
        >
          어떤 업종이든 적용 가능합니다
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto" style={{ wordBreak: "keep-all" }}>
          우리 데이터만 학습한 AI 챗봇이 고객에게 정확한 정보를 안내합니다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="glass-card p-6 md:p-8">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${uc.color} border border-white/10 mb-4`}>
                <uc.icon className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{uc.label}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3" style={{ wordBreak: "keep-all" }}>
                {uc.title}
              </h3>
              <ul className="space-y-2">
                {uc.examples.map((ex, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 중간 CTA */}
        <div className="text-center mt-12">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white hover:from-teal-400 hover:to-cyan-300 transition-all shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
          >
            도입 문의하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
