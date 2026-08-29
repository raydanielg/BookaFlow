"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"

export interface Column<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  secondary?: boolean
  align?: "left" | "right"
  className?: string
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  onRowClick?: (row: T) => void
  rowKey: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  error = null,
  onRetry,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  onRowClick,
  rowKey,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  const hasToolbar = Boolean(onSearchChange || filters)

  return (
    <div className="space-y-4">
      {hasToolbar ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {onSearchChange ? (
            <div className="relative w-full sm:max-w-xs">
              <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-9"
                aria-label={searchPlaceholder}
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}

          {filters ? (
            <div className="flex flex-wrap items-center gap-2">{filters}</div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/60",
        )}
      >
        {loading ? (
          <div className="p-2">
            <TableSkeleton cols={columns.length} />
          </div>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={onRetry}
            className="border-0 bg-transparent"
          />
        ) : data.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className="border-0"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead
                      key={col.id}
                      style={col.width ? { width: col.width } : undefined}
                      className={cn(
                        "whitespace-nowrap",
                        col.align === "right" && "text-right",
                        col.secondary && "hidden md:table-cell",
                      )}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    className={cn(
                      onRowClick &&
                        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    )}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={cn(
                          col.align === "right" && "text-right",
                          col.secondary && "hidden md:table-cell",
                          col.className,
                        )}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
