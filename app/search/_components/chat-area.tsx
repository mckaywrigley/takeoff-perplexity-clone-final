"use client"

import { createChatAction } from "@/actions/db/chats-actions"
import { createMessageAction } from "@/actions/db/messages-actions"
import { createSourcesAction } from "@/actions/db/sources-actions"
import { searchExaAction } from "@/actions/exa-actions"
import { generateOpenAIResponseAction } from "@/actions/openai-actions"
import { Markdown } from "@/components/markdown/markdown"
import { InsertSource, SelectMessage, SelectSource } from "@/db/schema"
import { cn } from "@/lib/utils"
import { readStreamableValue } from "ai/rsc"
import { ExternalLink, Lightbulb, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { SearchInput } from "./search-input"

interface ChatAreaProps {
  initialMessages: SelectMessage[]
  initialSources: SelectSource[]
  userId: string
  className?: string
}

export default function ChatArea({
  initialMessages,
  initialSources,
  userId,
  className
}: ChatAreaProps) {
  const [messages, setMessages] = useState<SelectMessage[]>(initialMessages)
  const [sources, setSources] = useState<SelectSource[]>(initialSources)
  const [isSearching, setIsSearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const isNewSearch = searchParams.get("new") === "true"
    if (isNewSearch) {
      setMessages([])
      setSources([])
      router.replace("/search", undefined)
    }
  }, [searchParams, router])

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    let currentChatId = "temp-chat-id"
    let isNewChat = true

    const userMessageId = Date.now().toString()
    const assistantMessageId = `${Date.now() + 1}`

    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: query,
        chatId: currentChatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "Searching for information...",
        chatId: currentChatId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    const exaResult = await searchExaAction(query)
    if (!exaResult.isSuccess || !exaResult.data) {
      console.error("Failed to get Exa results:", exaResult.message)
      setIsSearching(false)
      return
    }

    setSources(
      (exaResult.data.results || []).map((result, i) => ({
        id: `${Date.now()}-${i}`,
        chatId: currentChatId,
        url: result.url,
        title: result.title,
        text: result.text,
        summary: result.summary,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    setIsSearching(false)
    setIsGenerating(true) // Start generating

    const openAIResult = await generateOpenAIResponseAction(
      query,
      exaResult.data.results.map(result => ({
        chatId: currentChatId,
        url: result.url,
        title: result.title,
        text: result.text,
        summary: result.summary
      }))
    )
    if (!openAIResult.isSuccess || !openAIResult.data) {
      console.error("Failed to generate OpenAI response:", openAIResult.message)
      setIsGenerating(false)
      return
    }

    setIsGenerating(false)

    let fullContent = ""
    try {
      for await (const chunk of readStreamableValue(openAIResult.data)) {
        if (chunk) {
          fullContent += chunk
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          )
        }
      }
    } catch (error) {
      console.error("Error streaming OpenAI response:", error)
    }

    if (isNewChat) {
      const result = await createChatAction({
        userId,
        name: query.slice(0, 50)
      })
      if (result.isSuccess && result.data) {
        currentChatId = result.data.id
        isNewChat = false
      } else {
        console.error("Failed to create new chat")
        return
      }
    }

    const userMessageResult = await createMessageAction({
      chatId: currentChatId,
      role: "user",
      content: query
    })

    if (!userMessageResult.isSuccess || !userMessageResult.data) {
      console.error("Failed to create user message:", userMessageResult.message)
    }

    const assistantMessageResult = await createMessageAction({
      chatId: currentChatId,
      role: "assistant",
      content: fullContent
    })

    const sourcesToInsert: InsertSource[] = exaResult.data.results.map(
      (source: any) => ({
        chatId: currentChatId,
        url: source.url,
        title: source.title,
        description: source.description
      })
    )
    const saveSourcesResult = await createSourcesAction(sourcesToInsert)

    if (!saveSourcesResult.isSuccess) {
      console.error("Failed to save sources:", saveSourcesResult.message)
    }

    if (!assistantMessageResult.isSuccess || !assistantMessageResult.data) {
      console.error(
        "Failed to create assistant message:",
        assistantMessageResult.message
      )
    }

    if (isNewChat) {
      window.history.pushState(null, "", `/search/${currentChatId}`)
    }
  }

  return (
    <div
      className={cn(
        "mx-auto flex h-full flex-col overflow-y-auto pb-24",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex h-full grow flex-col items-center justify-center gap-6">
          <div className="text-4xl font-bold">Ask anything</div>

          <SearchInput
            ref={searchInputRef}
            className="w-full max-w-2xl"
            onSearch={handleSearch}
          />
        </div>
      ) : (
        <div className="mx-auto mt-4 w-full max-w-2xl grow space-y-6">
          {messages.map(message => (
            <div key={message.id}>
              {message.role === "user" && (
                <div className="mb-4 text-2xl font-bold">{message.content}</div>
              )}

              {message.role === "user" && (
                <div className="overflow-x-auto pb-2">
                  <div className="max-content mb-4 flex gap-4">
                    {sources.map((source, idx) => {
                      const domain = new URL(source.url).hostname.replace(
                        "www.",
                        ""
                      )
                      return (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-secondary hover:bg-secondary/80 relative flex size-24 shrink-0 flex-col justify-between overflow-hidden rounded-md p-2 transition-colors"
                        >
                          <span className="text-muted-foreground absolute right-1 top-1 text-xs font-semibold">
                            {idx + 1}
                          </span>
                          <span className="line-clamp-2 text-xs font-medium">
                            {source.title}
                          </span>
                          <div className="flex w-full items-center justify-between">
                            <span className="text-muted-foreground truncate text-xs">
                              {domain}
                            </span>
                            <ExternalLink className="text-muted-foreground size-3" />
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {message.role === "assistant" && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb className="size-5" />
                    <div className="text-xl font-bold">Answer</div>
                  </div>
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Searching for information...</span>
                    </div>
                  ) : isGenerating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Generating response...</span>
                    </div>
                  ) : (
                    <>
                      <Markdown content={message.content} />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
