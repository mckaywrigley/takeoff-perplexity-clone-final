"use server"

import { db } from "@/db/db"
import { InsertSource, sourcesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export const createSources = async (data: InsertSource[]) => {
  try {
    const newSources = await db.insert(sourcesTable).values(data).returning()
    return newSources
  } catch (error) {
    console.error("Error creating source:", error)
    throw new Error("Failed to create source")
  }
}

export const getSourcesByChatId = async (chatId: string) => {
  try {
    return db.query.sources.findMany({
      where: eq(sourcesTable.chatId, chatId)
    })
  } catch (error) {
    console.error("Error getting sources:", error)
    throw new Error("Failed to get sources")
  }
}
