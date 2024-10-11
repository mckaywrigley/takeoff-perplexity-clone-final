"use server"

import { db } from "@/db/db"
import { InsertMessage, messagesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export const createMessage = async (message: InsertMessage) => {
  try {
    const [newMessage] = await db
      .insert(messagesTable)
      .values(message)
      .returning()
    return newMessage
  } catch (error) {
    console.error("Error creating message:", error)
    throw new Error("Failed to create message")
  }
}

export const getMessagesByChatId = async (chatId: string) => {
  try {
    return db.query.messages.findMany({
      where: eq(messagesTable.chatId, chatId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)]
    })
  } catch (error) {
    console.error("Error getting messages:", error)
    throw new Error("Failed to get messages")
  }
}
