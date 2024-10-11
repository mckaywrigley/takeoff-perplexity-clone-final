"use server"

import { db } from "@/db/db"
import { chatsTable, InsertChat } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getChatsByUserId = async (userId: string) => {
  try {
    return await db.query.chats.findMany({
      where: eq(chatsTable.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)]
    })
  } catch (error) {
    console.error("Error getting chats:", error)
    throw new Error("Failed to get chats")
  }
}

export const createChat = async (data: InsertChat) => {
  try {
    const [newChat] = await db.insert(chatsTable).values(data).returning()
    return newChat
  } catch (error) {
    console.error("Error creating chat:", error)
    throw new Error("Failed to create chat")
  }
}

export const deleteChat = async (chatId: string) => {
  try {
    await db.delete(chatsTable).where(eq(chatsTable.id, chatId))
  } catch (error) {
    console.error("Error deleting chat:", error)
    throw new Error("Failed to delete chat")
  }
}
