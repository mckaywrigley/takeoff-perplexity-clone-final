import { chatsTable, messagesTable, sourcesTable } from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { profilesTable } from "./schema"

config({ path: ".env.local" })

const schema = {
  profiles: profilesTable,
  chats: chatsTable,
  messages: messagesTable,
  sources: sourcesTable
}

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema })
