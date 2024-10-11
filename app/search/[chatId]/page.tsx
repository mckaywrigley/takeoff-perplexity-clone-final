"use server"

import { getMessagesByChatIdAction } from "@/actions/db/messages-actions"
import { getSourcesByChatIdAction } from "@/actions/db/sources-actions"
import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import ChatArea from "../_components/chat-area"
import ChatAreaSkeleton from "../_components/chat-area-skeleton"

export default async function ChatPage({
  params
}: {
  params: { chatId: string }
}) {
  const { userId } = auth()

  if (!userId) {
    return <div>Please log in to view this page.</div>
  }

  return (
    <div className="h-screen flex-1">
      <Suspense fallback={<ChatAreaSkeleton />}>
        <ChatContentFetcher userId={userId} chatId={params.chatId} />
      </Suspense>
    </div>
  )
}

async function ChatContentFetcher({
  userId,
  chatId
}: {
  userId: string
  chatId: string
}) {
  const { data: messages } = await getMessagesByChatIdAction(chatId)
  const { data: sources } = await getSourcesByChatIdAction(chatId)

  return (
    <ChatArea
      initialMessages={messages || []}
      initialSources={sources || []}
      userId={userId}
    />
  )
}
