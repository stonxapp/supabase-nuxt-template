import { eq } from 'drizzle-orm'
import { db } from '~/server/utils/db'
import { users, insertUserSchema, selectUserSchema, updateUserSchema, type User } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  try {
    switch (method) {
      case 'GET': {
        // Get all users or a specific user
        const { id } = getQuery(event)

        if (id) {
          // Get single user
          const userId = String(id)
          const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

          if (user.length === 0) {
            throw createError({
              statusCode: 404,
              statusMessage: 'User not found',
            })
          }

          // Validate response with Zod
          const validatedUser = selectUserSchema.parse(user[0])
          return { user: validatedUser }
        } else {
          // Get all users
          const allUsers = await db.select().from(users).orderBy(users.createdAt)
          const validatedUsers = allUsers.map(user => selectUserSchema.parse(user))
          return { users: validatedUsers }
        }
      }

      case 'POST': {
        // Create new user
        const body = await readBody(event)

        // Validate input with Zod
        const validatedData = insertUserSchema.parse(body)

        // Check if user with email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, validatedData.email))
          .limit(1)

        if (existingUser.length > 0) {
          throw createError({
            statusCode: 409,
            statusMessage: 'User with this email already exists',
          })
        }

        // Insert new user
        const newUser = await db.insert(users).values(validatedData).returning()

        // Validate response
        const validatedUser = selectUserSchema.parse(newUser[0])
        return { user: validatedUser }
      }

      case 'PUT': {
        // Update user
        const { id } = getQuery(event)
        const body = await readBody(event)

        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required for updates',
          })
        }

        const userId = String(id)

        // Validate update data
        const validatedData = updateUserSchema.parse(body)

        // Check if user exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (existingUser.length === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
          })
        }

        // Update user
        const updatedUser = await db
          .update(users)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId))
          .returning()

        // Validate response
        const validatedUser = selectUserSchema.parse(updatedUser[0])
        return { user: validatedUser }
      }

      case 'DELETE': {
        // Delete user
        const { id } = getQuery(event)

        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required for deletion',
          })
        }

        const userId = String(id)

        // Check if user exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (existingUser.length === 0) {
          throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
          })
        }

        // Delete user
        await db.delete(users).where(eq(users.id, userId))

        return { message: 'User deleted successfully' }
      }

      default: {
        throw createError({
          statusCode: 405,
          statusMessage: `Method ${method} not allowed`,
        })
      }
    }
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: error.errors,
      })
    }

    // Re-throw other errors
    throw error
  }
})
