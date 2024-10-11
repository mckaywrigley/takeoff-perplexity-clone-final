"use server"

import { auth } from "@clerk/nextjs/server"
import ChatArea from "./_components/chat-area"

export default async function NewChatPage() {
  const { userId } = auth()

  if (!userId) {
    return <div>Please log in to view this page.</div>
  }

  return <ChatArea initialMessages={[]} initialSources={[]} userId={userId} />
}
