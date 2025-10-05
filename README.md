# Supabase Nuxt Starter Template

A comprehensive, production-ready starter template for building full-stack applications with Nuxt 3, Supabase, TypeScript, Tailwind CSS, and modern development tools.

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.0.0-00DC82?style=flat&logo=nuxtdotjs)](https://nuxt.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.0.0-3ECF8E?style=flat&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

## ✨ Features

- **🔐 Authentication**: Complete Supabase Auth integration with email/password and OAuth providers
- **🗄️ Database**: PostgreSQL with Drizzle ORM and Zod validation for type-safe operations
- **🎨 UI Framework**: Tailwind CSS with dark/light mode support and responsive design
- **📱 State Management**: Pinia stores for centralized, reactive state management
- **⚡ SSR Ready**: Server-side rendering with Nuxt 3 and proper hydration
- **🔧 TypeScript**: Full TypeScript support throughout the application
- **🧪 Testing**: Vitest setup for unit and integration testing
- **🎯 Code Quality**: ESLint and Prettier for consistent code formatting
- **📦 Production Ready**: Optimized build configuration and deployment setup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account and project

### 1. Clone and Install

```bash
# Clone the template
npx nuxi@latest init my-app -t gh:yourusername/supabase-nuxt-starter
cd my-app

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in your project root:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DB_URL=your_supabase_db_connection_string

# Optional: For production builds
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Or push schema directly (for development)
npm run db:push

# Open Drizzle Studio to view your database
npm run db:studio
```

### 4. Development

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

## 📁 Project Structure

```
├── app/                          # Nuxt app directory
│   └── app.vue                   # Root component with layout
├── components/                   # Reusable Vue components
│   └── UserList.vue              # Example component with SSR data fetching
├── composables/                  # Vue composables
│   ├── useAuth.ts                # Authentication composable
│   └── useSupabase.ts            # Supabase client composable
├── pages/                        # File-based routing
│   ├── index.vue                 # Home page with auth demo
│   └── auth/
│       └── callback.vue          # OAuth callback handler
├── server/                       # Nuxt server directory
│   ├── api/                      # Server API routes
│   │   └── users.ts              # CRUD API for users
│   ├── database/                 # Database schemas
│   │   └── schema.ts             # Drizzle schema definitions
│   └── utils/
│       └── db.ts                 # Database connection utility
├── stores/                       # Pinia stores
│   └── auth.ts                   # Authentication store
├── test/                         # Test files
│   └── setup.ts                  # Test configuration
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier

# Testing
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Run tests with coverage
```

## 🔑 Authentication

The template includes a complete authentication system:

### Usage in Components

```vue
<script setup lang="ts">
const { user, loading, signIn, signOut } = useAuth()
const authStore = useAuthStore()

// Composables approach
const handleSignIn = async () => {
  await signIn('user@example.com', 'password')
}

// Store approach
const handleSignOut = async () => {
  await authStore.signOut()
}
</script>
```

### Auth Store

```ts
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Reactive state
console.log(authStore.isAuthenticated) // boolean
console.log(authStore.userEmail) // string | null
```

## 🗄️ Database Operations

### Schema Definition

```ts
// server/database/schema.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### API Routes

```ts
// server/api/users.ts
export default defineEventHandler(async (event) => {
  const db = useDB() // Access Drizzle instance

  const users = await db.select().from(users)
  return { users }
})
```

### Client-side Data Fetching

```vue
<script setup lang="ts">
// SSR data fetching with useAsyncData
const { data, error, pending } = await useAsyncData('users', async () => {
  return await $fetch('/api/users')
})

// Or use useFetch for simpler cases
const { data } = await useFetch('/api/users')
</script>
```

## 🎨 Styling

The template uses Tailwind CSS with custom design tokens:

```vue
<template>
  <!-- Dark mode support built-in -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
      Click me
    </button>
  </div>
</template>
```

## 🧪 Testing

Tests are written with Vitest and Vue Test Utils:

```ts
// Example test
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserList from '~/components/UserList.vue'

describe('UserList', () => {
  it('renders user data correctly', async () => {
    const wrapper = mount(UserList)
    // Test implementation
  })
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms

The template is compatible with:

- Netlify
- Railway
- Render
- Any Node.js hosting platform

### Environment Variables

Required for production:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

## 🔄 Real-time Features

Add real-time subscriptions using Supabase Realtime:

```ts
// In a composable or component
const supabase = useSupabase()

const channel = supabase
  .channel('users')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'users',
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run lint:fix && npm run format`
6. Submit a pull request

## 📄 License

MIT License - feel free to use this template for your projects!

## 🆘 Support

- [Nuxt Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎯 Next Steps

After setup, consider adding:

- Email templates for auth
- File upload with Supabase Storage
- Real-time chat functionality
- Admin dashboard
- API rate limiting
- Monitoring and logging

---

Built with ❤️ using Nuxt 3, Supabase, and modern web technologies.
