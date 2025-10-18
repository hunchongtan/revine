"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function YearSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentYear = searchParams.get("year") || "all"

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams)
    if (year === "all") {
      params.delete("year")
    } else {
      params.set("year", year)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <Select value={currentYear} onValueChange={handleYearChange}>
      <SelectTrigger
        className="w-32 border border-[#e6e6e6] bg-white text-sm font-medium text-[#8a8a8a] transition-colors rounded-md px-3"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-lg">
        <SelectItem value="all">All Years</SelectItem>
        <SelectItem value="2013">2013</SelectItem>
        <SelectItem value="2014">2014</SelectItem>
        <SelectItem value="2015">2015</SelectItem>
        <SelectItem value="2016">2016</SelectItem>
      </SelectContent>
    </Select>
  )
}
