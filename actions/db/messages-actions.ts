"use server";

import { createMessage, getMessagesByChatId } from "@/db/queries/messages-queries";
import { InsertMessage, SelectMessage } from "@/db/schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function createMessageAction(message: InsertMessage): Promise<ActionState<SelectMessage>> {
  try {
    const newMessage = await createMessage(message);
    revalidatePath("/");
    return { isSuccess: true, message: "Message created successfully", data: newMessage };
  } catch (error) {
    console.error("Error creating message:", error);
    return { isSuccess: false, message: "Failed to create message" };
  }
}

export async function getMessagesByChatIdAction(chatId: string): Promise<ActionState<SelectMessage[]>> {
  try {
    const messages = await getMessagesByChatId(chatId);
    return { isSuccess: true, message: "Messages retrieved successfully", data: messages };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { isSuccess: false, message: "Failed to get messages" };
  }
}
