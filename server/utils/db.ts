import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

// Database connection string from environment
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'Database connection string is required. Please set SUPABASE_DB_URL or DATABASE_URL environment variable.'
  )
}

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle instance with schema
export const db = drizzle(client, { schema })

// Export types for use in API routes
export type Database = typeof db
