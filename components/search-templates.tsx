"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useCallback } from "react"

export function SearchTemplates() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      router.push(`/?${params.toString()}`)
    },
    [searchParams, router],
  )

  return (
    <Input
      placeholder="Search templates..."
      defaultValue={currentSearch}
      onChange={(e) => handleSearch(e.target.value)}
      className="flex-1 border border-[#e6e6e6] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00bf8f] rounded-md px-3"
    />
  )
}
