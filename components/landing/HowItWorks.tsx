"use client"

import { FileText, Brain, Rocket } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "Step 1",
    title: "데이터 입력",
    desc: "서비스, 가격, 운영시간, 자주 묻는 질문 등 우리 회사 정보를 입력합니다.",
  },
  {
    icon: Brain,
    step: "Step 2",
    title: "AI 학습 자동 완료",
    desc: "입력된 정보를 자동으로 학습하고 지식 DB를 구축합니다.",
  },
  {
    icon: Rocket,
    step: "Step 3",
    title: "웹사이트에 챗봇 설치",
    desc: "1줄 코드만 삽입하면 바로 운영이 시작됩니다.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          style={{ wordBreak: "keep-all" }}
        >
          간편한 구축 프로세스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="glass-card p-6 md:p-8 text-center relative">
              {/* 연결선 (데스크톱) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-teal-500/50 to-transparent" />
              )}
              <div className="text-xs font-semibold text-teal-400 mb-3 tracking-widest uppercase">
                {s.step}
              </div>
              <div className="icon-container mx-auto mb-4">
                <s.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ wordBreak: "keep-all" }}>
                {s.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
