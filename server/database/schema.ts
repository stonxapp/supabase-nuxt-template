import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Users table definition
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas for validation and type inference
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
})

export const selectUserSchema = createSelectSchema(users)

// Types inferred from schemas
export type User = z.infer<typeof selectUserSchema>
export type NewUser = z.infer<typeof insertUserSchema>

// Additional validation schemas for API endpoints
export const userProfileSchema = selectUserSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export const updateUserSchema = insertUserSchema.partial().omit({
  id: true,
  email: true, // Email should not be updatable via API
  createdAt: true,
  updatedAt: true,
})

export type UserProfile = z.infer<typeof userProfileSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
