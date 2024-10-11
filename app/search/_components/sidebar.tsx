"use client"

import { deleteChatAction } from "@/actions/db/chats-actions"
import { Button } from "@/components/ui/button"
import { SelectChat } from "@/db/schema"
import { cn } from "@/lib/utils"
import { PlusCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SidebarProps {
  initialChats: SelectChat[]
  className?: string
}

export default function Sidebar({ initialChats, className }: SidebarProps) {
  const [chats, setChats] = useState<SelectChat[]>(initialChats)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  const params = useParams()
  const router = useRouter()
  const currentChatId = params.chatId

  useEffect(() => {
    setChats(initialChats)
  }, [initialChats])

  const handleNewSearch = () => {
    router.push("/search?new=true")
  }

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const startingChats = [...chats]
    setChats(startingChats.filter(chat => chat.id !== chatId))
    const result = await deleteChatAction(chatId)
    if (result.isSuccess) {
      router.refresh()
    } else {
      console.error(result.message)
      setChats(startingChats)
    }
  }

  return (
    <div className={cn("bg-secondary flex flex-col", className)}>
      <div className="flex items-center justify-between p-4 text-xl font-bold">
        <div>Searches</div>

        <Button size="sm" onClick={handleNewSearch}>
          <PlusCircle className="mr-2 size-4" />
          New Search
        </Button>
      </div>

      <div className="flex-1 overflow-auto pb-6">
        {chats.length === 0 ? (
          <div className="text-muted-foreground p-4 text-center">
            No searches yet.
          </div>
        ) : (
          chats.map(chat => (
            <Link
              key={chat.id}
              href={`/search/${chat.id}`}
              className={cn(
                "hover:bg-primary hover:text-primary-foreground flex items-center justify-between px-4 py-2 hover:opacity-80",
                chat.id === currentChatId
                  ? "bg-primary text-primary-foreground"
                  : ""
              )}
              title={chat.name || "Untitled Search"}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <span className="w-full overflow-hidden truncate text-ellipsis">
                {chat.name || "Untitled Search"}
              </span>
              {hoveredChatId === chat.id && (
                <button
                  onClick={e => handleDeleteChat(e, chat.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
