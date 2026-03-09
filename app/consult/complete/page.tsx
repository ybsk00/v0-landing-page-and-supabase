"use client"

import { useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

declare global {
  interface Window {
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

export default function ConsultCompletePage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: "Consultation Complete",
        content_category: "AI Chatbot",
      })
      console.log("[v0] Meta Pixel ViewContent event sent on complete page")
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-2xl w-full text-center space-y-8 py-12">
        <div className="flex justify-center">
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">상담 신청이 완료되었습니다</h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          빠른 시일 내에 담당자가 연락드리겠습니다.
          <br />
          AI 챗봇으로 고객 응대를 혁신하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              메인으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg text-left">
          <h2 className="font-semibold text-lg mb-3">다음 단계</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 담당 매니저가 24시간 내 연락드립니다</li>
            <li>• 업종 현황 및 요구사항을 파악합니다</li>
            <li>• 맞춤형 AI 챗봇 데모를 제공합니다</li>
            <li>• 도입 로드맵을 함께 계획합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
