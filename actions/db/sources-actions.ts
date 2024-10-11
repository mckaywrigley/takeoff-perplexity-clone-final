"use server";

import { createSources, getSourcesByChatId } from "@/db/queries/sources-queries";
import { InsertSource, SelectSource } from "@/db/schema/sources-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function createSourcesAction(sources: InsertSource[]): Promise<ActionState<InsertSource[]>> {
  try {
    const newSources = await createSources(sources);
    revalidatePath("/");
    return { isSuccess: true, message: "Source created successfully", data: newSources };
  } catch (error) {
    console.error("Error creating source:", error);
    return { isSuccess: false, message: "Failed to create source" };
  }
}

export async function getSourcesByChatIdAction(chatId: string): Promise<ActionState<SelectSource[]>> {
  try {
    const sources = await getSourcesByChatId(chatId);
    return { isSuccess: true, message: "Sources retrieved successfully", data: sources };
  } catch (error) {
    console.error("Error getting sources:", error);
    return { isSuccess: false, message: "Failed to get sources" };
  }
}
