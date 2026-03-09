"use client"

import { useState, useEffect, useRef } from "react"

interface CounterProps {
  value: string
  duration?: number
}

export function Counter({ value, duration = 1500 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateValue()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function animateValue() {
    // Extract numeric part and suffix
    const match = value.match(/^([\d.]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const target = parseFloat(match[1])
    const suffix = match[2]
    const isDecimal = match[1].includes(".")
    const startTime = performance.now()

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      const current = target * eased
      if (isDecimal) {
        setDisplayValue(current.toFixed(1) + suffix)
      } else {
        setDisplayValue(Math.floor(current) + suffix)
      }

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(update)
  }

  return <div ref={ref}>{displayValue}</div>
}
