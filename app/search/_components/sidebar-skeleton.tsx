"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function SidebarSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}
