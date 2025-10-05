import { beforeAll } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock environment variables for tests
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_DB_URL = 'postgresql://test:test@localhost:5432/test'
})
