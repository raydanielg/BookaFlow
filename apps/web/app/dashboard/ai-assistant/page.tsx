"use client"

import { useEffect, useState, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  Calendar03Icon,
  StarIcon,
  UserGroupIcon,
  AlertIcon,
  SendIcon,
} from "@hugeicons/core-free-icons"

import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"

type Insight = {
  type: string
  icon: string
  title: string
  detail: string
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  suggestions?: string[]
}

const INSIGHT_ICONS: Record<string, any> = {
  "trending-up": TrendingUpIcon,
  "trending-down": TrendingDownIcon,
  calendar: Calendar03Icon,
  star: StarIcon,
  users: UserGroupIcon,
  alert: AlertIcon,
  sparkles: SparklesIcon,
}

const INSIGHT_STYLES: Record<string, string> = {
  positive: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20",
  warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20",
  info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20",
}

export default function AIAssistantPage() {
  const { businessId, loading } = useAuth()
  const [insights, setInsights] = useState<Insight[]>([])
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your BookaFlow AI assistant. Ask me about your appointments, revenue, customers, or services.",
      suggestions: ["How many appointments this week?", "What's my revenue?", "Show me insights"],
    },
  ])
  const [input, setInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!businessId) return
    api.getInsights(businessId).then((data: any) => {
      setInsights(data.insights || [])
      setInsightsLoading(false)
    }).catch(() => setInsightsLoading(false))
  }, [businessId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (msg: string) => {
    if (!msg.trim() || !businessId || chatLoading) return

    setInput("")
    setChatLoading(true)
    setMessages((prev) => [...prev, { role: "user", content: msg }])

    try {
      const data: any = await api.aiChat(businessId, msg)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.response,
        suggestions: data.suggestions,
      }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't process that request. Please try again.",
      }])
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Skeleton className="h-8 w-48" /></div>
  }

  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Get insights about your business and chat with your AI copilot."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* AI Insights */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold tracking-tight">AI Insights</h2>
          {insightsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {insights.map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.icon] || SparklesIcon
                return (
                  <Card key={i} className={`gap-0 border p-4 ${INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.info}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <HugeiconsIcon icon={Icon} className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{insight.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{insight.detail}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* AI Chat */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold tracking-tight">Chat with AI</h2>
          <Card className="flex flex-col gap-0 p-0 overflow-hidden" style={{ height: 500 }}>
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      {msg.role === "assistant" && (
                        <div className="mb-1 flex items-center gap-1.5">
                          <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-primary" />
                          <span className="text-xs font-semibold text-primary">BookaFlow AI</span>
                        </div>
                      )}
                      <p>{msg.content}</p>
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((s, si) => (
                            <button
                              key={si}
                              onClick={() => sendMessage(s)}
                              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl bg-muted px-3.5 py-2.5">
                      <div className="flex gap-1">
                        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your business..."
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || chatLoading}>
                  <HugeiconsIcon icon={SendIcon} className="size-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
