"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ForwardedRef, forwardRef, useState } from "react"

interface SearchInputProps {
  onSearch: (query: string) => void
  className?: string
}

export const SearchInput = forwardRef(function SearchInput(
  { onSearch, className }: SearchInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [query, setQuery] = useState("")

  const handleSearch = async () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={ref}
        className="pr-10"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyPress={e => e.key === "Enter" && handleSearch()}
      />

      <Button
        className="absolute right-0 top-0 h-full"
        variant="ghost"
        size="icon"
        disabled={true}
        onClick={handleSearch}
      >
        <Search className="size-4" />
      </Button>
    </div>
  )
})
