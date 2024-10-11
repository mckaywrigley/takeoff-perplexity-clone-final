"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "./search-input"

export default function ChatAreaSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <SearchInput className="mx-auto w-full max-w-2xl" onSearch={() => {}} />
      <div className="grow space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}
