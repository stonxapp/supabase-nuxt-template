import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
})
