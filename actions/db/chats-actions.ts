"use server"

import {
  createChat,
  deleteChat,
  getChatsByUserId
} from "@/db/queries/chats-queries"
import { InsertChat, SelectChat } from "@/db/schema"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createChatAction(
  data: InsertChat
): Promise<ActionState<SelectChat>> {
  try {
    const newChat = await createChat(data)
    revalidatePath("/")
    return {
      isSuccess: true,
      message: "Chat created successfully",
      data: newChat
    }
  } catch (error) {
    console.error("Error creating chat:", error)
    return { isSuccess: false, message: "Failed to create chat" }
  }
}

export async function getChatsByUserIdAction(
  userId: string
): Promise<ActionState<SelectChat[]>> {
  try {
    const chats = await getChatsByUserId(userId)
    return {
      isSuccess: true,
      message: "Chats retrieved successfully",
      data: chats
    }
  } catch (error) {
    console.error("Error getting chats:", error)
    return { isSuccess: false, message: "Failed to get chats" }
  }
}

export async function deleteChatAction(
  chatId: string
): Promise<ActionState<void>> {
  try {
    await deleteChat(chatId)
    revalidatePath("/")
    return {
      isSuccess: true,
      message: "Chat deleted successfully"
    }
  } catch (error) {
    console.error("Error deleting chat:", error)
    return { isSuccess: false, message: "Failed to delete chat" }
  }
}
