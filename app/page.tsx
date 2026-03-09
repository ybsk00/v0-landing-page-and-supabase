"use client"

import { useEffect } from "react"
import { ParticleBG } from "@/components/landing/ParticleBG"
import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { ChatDemo } from "@/components/landing/ChatDemo"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { UseCases } from "@/components/landing/UseCases"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTASection } from "@/components/landing/CTASection"
import { FAQSection } from "@/components/landing/FAQSection"
import { ConsultForm } from "@/components/landing/ConsultForm"
import { Footer } from "@/components/landing/Footer"
import { FloatingCTA } from "@/components/landing/FloatingCTA"
import { sendMetaConversionEvent, getMetaBrowserId, getMetaClickId } from "@/lib/meta-conversion"

export default function Home() {
  useEffect(() => {
    const sendViewContentEvent = async () => {
      try {
        await sendMetaConversionEvent({
          eventName: "ViewContent",
          eventSourceUrl: window.location.href,
          userAgent: navigator.userAgent,
          fbp: getMetaBrowserId() ?? undefined,
          fbc: getMetaClickId() ?? undefined,
        })
      } catch (error) {
        console.error("[landing] Meta ViewContent error:", error)
      }
    }

    sendViewContentEvent()
  }, [])

  return (
    <main className="min-h-screen font-sans relative">
      <ParticleBG />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <ChatDemo />
        <UseCases />
        <CTASection />
        <HowItWorks />
        <FAQSection />
        <ConsultForm />
        <Footer />
        <FloatingCTA />
      </div>
    </main>
  )
}
