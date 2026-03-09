"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { sendMetaConversionEvent, getMetaBrowserId, getMetaClickId } from "@/lib/meta-conversion"
import { CheckCircle2 } from "lucide-react"
import { INDUSTRIES, PLACEHOLDERS } from "@/lib/industries"

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

function ConsultFormInner() {
  const [formData, setFormData] = useState({
    privacyConsent: "",
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    industry: "hospital",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // UTM 파라미터 자동 수집
  const [utmParams, setUtmParams] = useState({
    utm_source: undefined as string | undefined,
    utm_medium: undefined as string | undefined,
    utm_campaign: undefined as string | undefined,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        utm_source: params.get("utm_source") || undefined,
        utm_medium: params.get("utm_medium") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
      })
      // URL tab 파라미터로 업종 초기값 설정
      const tab = params.get("tab")
      if (tab && INDUSTRIES.some((ind) => ind.id === tab)) {
        setFormData((prev) => ({ ...prev, industry: tab }))
      }
    }
  }, [])

  const submitLead = useMutation(api.leads.submitLead)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.privacyConsent !== "yes") {
      alert("개인정보 제공에 동의해주셔야 신청이 가능합니다.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      await submitLead({
        privacy_consent: true,
        company_name: formData.companyName,
        contact_name: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        industry: formData.industry,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      })

      // Google Ads 전환
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16980195675",
          value: 1.0,
          currency: "KRW",
        })
      }

      // Meta Pixel Lead
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "AI Chatbot Lead",
          content_category: "AI Chatbot",
          value: 0,
          currency: "KRW",
        })
      }

      // Meta Conversions API Lead
      try {
        await sendMetaConversionEvent({
          eventName: "Lead",
          eventSourceUrl: window.location.href,
          userAgent: navigator.userAgent,
          email: formData.email,
          phone: formData.phone,
          fbp: getMetaBrowserId() ?? undefined,
          fbc: getMetaClickId() ?? undefined,
        })
      } catch (conversionError) {
        console.error("[landing] Meta Conversions API error:", conversionError)
      }

      // 전환 후 URL 변경 (현행 유지)
      window.location.href = "/consult/complete"
    } catch (error) {
      console.error("[landing] 제출 오류:", error)
      setSubmitStatus("error")
      setIsSubmitting(false)
    }
  }

  const handleFormClick = () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_name: "AI Chatbot Form CTA",
        content_category: "AI Chatbot",
      })
    }
  }

  const currentPlaceholder = PLACEHOLDERS[formData.industry] || PLACEHOLDERS["other"]

  return (
    <section id="cta-form" className="py-16 md:py-24 px-4">
      <div className="max-w-xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ wordBreak: "keep-all" }}>
            무료 상담 신청
          </h2>
          <p className="text-gray-400" style={{ wordBreak: "keep-all" }}>
            우리 회사에 맞는 AI 챗봇을 안내해 드립니다.
            <br />
            상담 신청 후 24시간 내 담당자가 연락드립니다.
          </p>
        </div>

        <div className="glass-card-static p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 개인정보 제공 동의 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-white">
                개인정보 제공에 동의합니까? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3 md:gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="privacyConsent"
                    value="yes"
                    checked={formData.privacyConsent === "yes"}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.value })}
                    className="w-5 h-5 accent-teal-500 bg-white/10 border-white/20"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">예</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="privacyConsent"
                    value="no"
                    checked={formData.privacyConsent === "no"}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.value })}
                    className="w-5 h-5 accent-teal-500 bg-white/10 border-white/20"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">아니오</span>
                </label>
              </div>
            </div>

            {/* 업종 */}
            <div className="space-y-2">
              <label htmlFor="industry" className="block text-base font-medium text-white">
                업종 <span className="text-red-400">*</span>
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50 appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id} className="bg-gray-900 text-white">
                    {ind.label}
                  </option>
                ))}
                <option value="other" className="bg-gray-900 text-white">기타</option>
              </select>
            </div>

            {/* 상호 */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-base font-medium text-white">
                상호 <span className="text-red-400">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                placeholder={currentPlaceholder}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* 성명 */}
            <div className="space-y-2">
              <label htmlFor="contactName" className="block text-base font-medium text-white">
                성명 <span className="text-red-400">*</span>
              </label>
              <input
                id="contactName"
                type="text"
                placeholder="담당자 성함을 입력해주세요"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* 전화번호 */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-base font-medium text-white">
                전화번호 <span className="text-red-400">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-base font-medium text-white">
                이메일 <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleFormClick}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  제출 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  상담 신청하기
                </span>
              )}
            </button>

            {submitStatus === "error" && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-center text-red-400 font-medium">
                  제출 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              </div>
            )}
          </form>

          {/* 폼 하단 신뢰 문구 */}
          <div className="mt-6 space-y-1.5 text-center">
            <p className="text-xs text-gray-500">* 입력하신 정보는 상담 목적으로만 사용됩니다</p>
            <p className="text-xs text-gray-500">* 24시간 내 담당자가 연락드립니다</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ConsultForm() {
  return <ConsultFormInner />
}
