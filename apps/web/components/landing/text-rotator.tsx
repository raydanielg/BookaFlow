"use client"

import { useEffect, useState } from "react"

const defaultPhrases = [
  { text: "salons", color: "text-primary" },
  { text: "clinics", color: "text-primary" },
  { text: "spas", color: "text-primary" },
  { text: "gyms", color: "text-primary" },
  { text: "studios", color: "text-primary" },
  { text: "wellness centers", color: "text-primary" },
]

export function TextRotator({
  phrases = defaultPhrases,
  intervalMs = 2800,
}: {
  phrases?: { text: string; color: string }[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length)
        setVisible(true)
      }, 400)
    }, intervalMs)
    return () => clearInterval(interval)
  }, [phrases.length, intervalMs])

  const current = phrases[index] ?? phrases[0]!

  return (
    <span
      className={`inline-block transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${current.color}`}
    >
      {current.text}
    </span>
  )
}
