"use client"

import { ShieldCheck, Database, Clock, CalendarCheck, CheckCircle2, X } from "lucide-react"
import { Counter } from "./Counter"

const solutions = [
  {
    icon: ShieldCheck,
    title: "할루시네이션 제로",
    desc: "우리 회사 DB에 있는 정보만 답변합니다. 없는 정보는 \"확인 후 안내드리겠습니다\"로 응답합니다.",
  },
  {
    icon: Database,
    title: "우리 회사 전용 DB",
    desc: "서비스, 가격, 운영시간, FAQ까지. 우리 회사 맞춤 지식 DB를 구축합니다.",
  },
  {
    icon: Clock,
    title: "24시간 고객 응대",
    desc: "야간·주말·공휴일에도 고객 문의에 즉시 응답합니다. 평균 응답 시간 3초.",
  },
  {
    icon: CalendarCheck,
    title: "문의를 전환으로 연결",
    desc: "고객 질문 → 맞춤 서비스 안내 → 상담/예약 유도까지 자동으로 진행합니다.",
  },
]

const stats = [
  { value: "93%", label: "자동 응답률", desc: "고객 문의를 AI가 자동 처리" },
  { value: "3초", label: "평균 응답 시간", desc: "고객 대기 시간 제로" },
  { value: "47%↑", label: "전환율 향상", desc: "문의 → 전환율 증가" },
  { value: "2주", label: "구축 완료 기간", desc: "상담부터 운영 시작까지" },
]

const comparisons = [
  {
    before: "반복 문의에 직원이 직접 응대",
    after: "AI가 24시간 자동 응답",
  },
  {
    before: "일반 챗봇이 엉뚱한 정보 안내",
    after: "우리 데이터 기반 정확한 답변",
  },
  {
    before: "부정확한 답변으로 클레임 발생",
    after: "검증된 정보만 답변, 리스크 제로",
  },
  {
    before: "야간/주말 문의 → 고객 이탈",
    after: "24시간 응대 → 전환 증가",
  },
  {
    before: "웹사이트 방문자 → 그냥 이탈",
    after: "챗봇 상담 → 전환 완료",
  },
]

export function CTASection() {
  return (
    <>
      {/* 솔루션 섹션 */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            RAG 기반 AI 챗봇은 다릅니다
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto" style={{ wordBreak: "keep-all" }}>
            우리 회사 데이터만 학습한 AI가 고객에게 정확한 정보를 안내합니다
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <div key={i} className="glass-card p-6 md:p-8">
                <div className="icon-container mb-4">
                  <s.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ wordBreak: "keep-all" }}>
                  {s.title}
                </h3>
                <p className="text-gray-400 leading-relaxed" style={{ wordBreak: "keep-all" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성과 지표 */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            style={{ wordBreak: "keep-all" }}
          >
            도입 기업의 실제 성과
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="glass-card-static p-6 text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-gradient-animate mb-2">
                  <Counter value={s.value} />
                </div>
                <div className="text-white font-semibold mb-1">{s.label}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 도입 전/후 비교 */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            style={{ wordBreak: "keep-all" }}
          >
            도입 전 vs 도입 후
          </h2>
          <div className="space-y-4">
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-gray-300" style={{ wordBreak: "keep-all" }}>{c.before}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/5 border border-teal-500/15">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-white font-medium" style={{ wordBreak: "keep-all" }}>{c.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
