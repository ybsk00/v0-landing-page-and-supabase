"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "우리 회사에 맞게 설정할 수 있나요?",
    a: "네, 회사별로 독립된 지식 DB를 구축합니다. 서비스 정보, 가격, 운영시간, FAQ 등을 맞춤 설정할 수 있습니다.",
  },
  {
    q: "고객이 AI라는 걸 알면 거부감이 있지 않을까요?",
    a: "실제 도입 기업에서 고객의 89%가 'AI 응답에 만족한다'고 답했습니다. 정확하고 빠른 응답이 핵심입니다.",
  },
  {
    q: "부정확한 답변이 나갈 수 있지 않나요?",
    a: "RAG 기반으로 우리 회사 DB에 입력된 검증된 정보만 응답합니다. 없는 정보는 '확인 후 안내드리겠습니다'로 응답하여 할루시네이션을 방지합니다.",
  },
  {
    q: "비용은 얼마인가요?",
    a: "업종과 규모에 따라 맞춤 견적을 제공합니다. 무료 상담을 신청하시면 상세 안내드립니다.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          style={{ wordBreak: "keep-all" }}
        >
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card-static overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4" style={{ wordBreak: "keep-all" }}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 pb-5 text-gray-400 leading-relaxed" style={{ wordBreak: "keep-all" }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
