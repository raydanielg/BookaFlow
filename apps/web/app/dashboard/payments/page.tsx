"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  TimeQuarterPassIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { MetricCard } from "@/components/shared/metric-card"

type Transaction = {
  id: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  amount: number
  currency: string
  method: string
  status: string
  reference: string | null
  serviceName: string | null
  description: string | null
  createdAt: string
}

type Plan = {
  id: string
  name: string
  price: number
  interval: string
  features: string
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Completed" },
  PENDING: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  FAILED: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Failed" },
  REFUNDED: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400", label: "Refunded" },
  CANCELLED: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
}

const METHOD_LABELS: Record<string, string> = {
  CASH: "Cash", CARD: "Card", M_PESA: "M-Pesa", TIGO_PESA: "Tigo Pesa", AIRTEL_MONEY: "Airtel Money", BANK: "Bank Transfer", OTHER: "Other",
}

function formatTZS(value: number) {
  if (value >= 1000000) return `TZS ${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `TZS ${Math.round(value / 1000)}K`
  return `TZS ${Math.round(value)}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function PaymentsPage() {
  const { businessId, loading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({ totalReceived: 0, totalPending: 0, totalRefunded: 0, count: 0 })
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<{ plan: Plan | null; status: string } | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [showRecord, setShowRecord] = useState(false)

  const fetchData = () => {
    if (!businessId) return
    Promise.all([
      api.getTransactions(businessId),
      api.getPlans().catch(() => ({ plans: [] })),
      api.getSubscription(businessId).catch(() => ({ subscription: null, plan: null })),
    ]).then(([txData, planData, subData]: any) => {
      setTransactions(txData.transactions || [])
      setSummary(txData.summary || { totalReceived: 0, totalPending: 0, totalRefunded: 0, count: 0 })
      setPlans(planData.plans || [])
      setSubscription({ plan: subData.plan, status: subData.subscription?.status || "none" })
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [businessId])

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Skeleton className="h-8 w-48" /></div>
  }

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track transactions and manage your subscription."
        actions={
          <Button size="sm" onClick={() => setShowRecord(true)}>
            <HugeiconsIcon icon={CreditCardIcon} className="size-4" />
            Record payment
          </Button>
        }
      />

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Received"
          value={formatTZS(summary.totalReceived)}
          icon={ArrowUp01Icon}
          loading={dataLoading}
          hint={`${summary.count} transactions`}
        />
        <MetricCard
          label="Pending"
          value={formatTZS(summary.totalPending)}
          icon={TimeQuarterPassIcon}
          loading={dataLoading}
          hint="Awaiting payment"
        />
        <MetricCard
          label="Refunded"
          value={formatTZS(summary.totalRefunded)}
          icon={ArrowDown01Icon}
          loading={dataLoading}
          hint="Refunded to customers"
        />
        <MetricCard
          label="Transactions"
          value={String(summary.count)}
          icon={CreditCardIcon}
          loading={dataLoading}
          hint="All time"
        />
      </div>

      {/* Subscription Plans */}
      {plans.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-1 text-base font-semibold tracking-tight">Subscription Plan</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            {subscription?.plan ? `Current: ${subscription.plan.name} (${subscription.status})` : "No active subscription — you're on Free"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-4 ${subscription?.plan?.id === plan.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
              >
                <p className="text-sm font-semibold">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {plan.price === 0 ? "Free" : formatTZS(plan.price)}
                  {plan.price > 0 && <span className="text-xs font-normal text-muted-foreground">/{plan.interval}</span>}
                </p>
                <div className="mt-3 flex flex-col gap-1">
                  {plan.features.split(",").map((f, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3 text-emerald-500" />
                      {f.trim()}
                    </p>
                  ))}
                </div>
                {subscription?.plan?.id !== plan.id && (
                  <Button size="sm" variant="outline" className="mt-3 w-full">
                    {plan.price === 0 ? "Current plan" : "Upgrade"}
                  </Button>
                )}
                {subscription?.plan?.id === plan.id && (
                  <p className="mt-3 text-center text-xs font-medium text-primary">Current plan</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transactions table */}
      <Card className="gap-0 p-0 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">Transactions</h2>
        </div>
        {dataLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => {
                  const st = STATUS_STYLES[t.status] || { bg: "bg-muted", text: "text-muted-foreground", label: t.status }
                  return (
                    <tr key={t.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.customerName}</p>
                        {t.serviceName && <p className="text-xs text-muted-foreground">{t.serviceName}</p>}
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{formatTZS(t.amount)}</td>
                      <td className="px-4 py-3 text-xs">{METHOD_LABELS[t.method] || t.method}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(t.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showRecord && (
        <RecordPaymentModal
          businessId={businessId}
          onClose={() => setShowRecord(false)}
          onRecorded={() => { setShowRecord(false); fetchData() }}
        />
      )}
    </>
  )
}

function RecordPaymentModal({ businessId, onClose, onRecorded }: { businessId: string | null; onClose: () => void; onRecorded: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail"),
      amount: parseFloat(formData.get("amount") as string),
      method: formData.get("method"),
      status: formData.get("status"),
      serviceName: formData.get("serviceName"),
      description: formData.get("description"),
    }

    try {
      await api.recordPayment(businessId, body)
      onRecorded()
    } catch (err: any) {
      setError(err.message || "Failed to record payment")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Record Payment</h2>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Customer Name *</Label>
            <Input name="customerName" required placeholder="John Doe" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Phone</Label>
              <Input name="customerPhone" placeholder="+255..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Email</Label>
              <Input name="customerEmail" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Amount (TZS) *</Label>
              <Input name="amount" type="number" required placeholder="50000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Method</Label>
              <select name="method" className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="CASH">Cash</option>
                <option value="M_PESA">M-Pesa</option>
                <option value="CARD">Card</option>
                <option value="BANK">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Status</Label>
              <select name="status" className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Service (optional)</Label>
              <Input name="serviceName" placeholder="Haircut" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Description</Label>
            <Input name="description" placeholder="Payment for..." />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" loading={saving}>Record payment</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
