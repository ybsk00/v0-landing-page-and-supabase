"use client"

import { Phone, MessageCircle, AlertTriangle } from "lucide-react"

const problems = [
  {
    icon: Phone,
    title: "단순 반복 문의가 하루 수십 건",
    desc: "야간·주말에도 문의가 쏟아지지만, 직원이 직접 응대하기엔 시간과 인력이 부족합니다.",
  },
  {
    icon: MessageCircle,
    title: "일반 AI 챗봇은 엉뚱한 답변",
    desc: "우리 회사 정보가 없는 AI 챗봇은 잘못된 가격, 없는 서비스를 안내합니다.",
  },
  {
    icon: AlertTriangle,
    title: "부정확한 정보 제공 리스크",
    desc: "할루시네이션으로 인한 잘못된 안내는 고객 신뢰를 떨어뜨리고 클레임으로 이어집니다.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          style={{ wordBreak: "keep-all" }}
        >
          이런 상황, 겪고 계시지 않나요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="glass-card p-6 md:p-8">
              <div className="icon-container mb-4">
                <p.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ wordBreak: "keep-all" }}>
                {p.title}
              </h3>
              <p className="text-gray-400 leading-relaxed" style={{ wordBreak: "keep-all" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
