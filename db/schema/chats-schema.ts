import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertChat = typeof chatsTable.$inferInsert
export type SelectChat = typeof chatsTable.$inferSelect
