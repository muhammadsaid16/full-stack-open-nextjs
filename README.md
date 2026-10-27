# Full Stack Open: Next.js (Part 14) Blog Application

A complete, production-ready Full Stack Blog Application built for the University of Helsinki's **Full Stack Open: Next.js (Part 14)** curriculum. Built with Next.js (App Router), React 19 Server & Client Components, Drizzle ORM, PostgreSQL, NextAuth.js v5 (Auth.js), and Tailwind CSS v4.

This project is 100% compliant with the official course architecture and passes 100% of the official Playwright automated test suite in `fullstack-hy2020/next-js-tests`.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI Library**: [React 19](https://react.dev/) Server and Client Components
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: `postgres` & `@neondatabase/serverless` (supports Neon, Supabase, and local PostgreSQL)
- **Authentication**: [Auth.js / NextAuth.js v5](https://authjs.dev/) (Credentials Provider with bcrypt password hashing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Automated Testing**: [Playwright](https://playwright.dev/) End-to-End Test Suite

---

## 📁 Project Architecture

```text
├── app/
│   ├── actions/
│   │   ├── blogs.ts          # Server Actions: createBlog, likeBlog, deleteBlog, addToReadingList, markAsRead
│   │   └── users.ts          # Server Actions: registerUser, generateApiTokenAction
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/# NextAuth v5 GET/POST route handlers
│   │   ├── blogs/
│   │   │   ├── route.ts      # GET /api/blogs, POST /api/blogs (token/session auth)
│   │   │   └── [id]/route.ts # PUT /api/blogs/[id], DELETE /api/blogs/[id]
│   │   ├── reading-list/     # POST & PUT /api/reading-list
│   │   ├── testing/
│   │   │   ├── reset/        # DELETE /api/testing/reset (truncates tables for test runner)
│   │   │   └── users/        # POST /api/testing/users (test user seeder)
│   │   └── users/token/      # POST /api/users/token
│   ├── blogs/
│   │   ├── page.tsx          # /blogs: list with search/filter & Suspense streaming
│   │   ├── new/page.tsx      # /blogs/new: blog creation form
│   │   └── [id]/page.tsx     # /blogs/[id]: blog details, likes, delete & reading list
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive nav with role="navigation" & dynamic auth state
│   │   ├── Notification.tsx  # React Context & toast banner (data-testid="notification")
│   │   ├── BlogFilter.tsx    # Search form (data-testid="filter-input" & "search-button")
│   │   ├── LikeButton.tsx    # Optimistic like increment button
│   │   ├── ReadingListControls.tsx # Reading list controls & manager
│   │   └── ApiTokenManager.tsx     # Personal API Token generator
│   ├── login/page.tsx        # /login: NextAuth credentials login
│   ├── register/page.tsx     # /register: client+server validation & error testids
│   ├── users/
│   │   ├── page.tsx          # /users: directory with blog counts
│   │   └── [id]/page.tsx     # /users/[id]: user profile and authored blogs
│   ├── me/page.tsx           # /me: protected profile, reading list & API token manager
│   ├── services/
│   │   ├── blogs.ts          # Drizzle queries for blogs & reading list
│   │   ├── users.ts          # Drizzle queries for users & tokens
│   │   └── session.ts        # Session & Bearer token resolver
│   ├── globals.css           # Tailwind CSS v4 import
│   ├── layout.tsx            # Root layout with Providers & Navbar
│   └── page.tsx              # / Home page overview
├── db/
│   ├── index.ts              # Drizzle DB client export
│   └── schema.ts             # Drizzle tables (users, blogs, reading_list) & relations
├── tests/
│   ├── blog-app.spec.ts      # Official Playwright test suite
│   └── helpers.ts            # Test runner helper utilities
├── auth.ts                   # NextAuth v5 configuration
├── drizzle.config.ts         # Drizzle Kit configuration
├── next.config.ts            # Next.js configuration
├── playwright.config.ts      # Playwright E2E configuration
└── package.json
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v20 or higher, v22+ recommended)
- PostgreSQL database (Local PostgreSQL or a cloud Neon / Supabase instance)

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Set your database connection URL and authentication secrets:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blog_app
AUTH_SECRET=your_super_secret_key_at_least_32_characters_long
NEXTAUTH_SECRET=your_super_secret_key_at_least_32_characters_long
NEXTAUTH_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Push Database Schema
Push the schema to your PostgreSQL database using Drizzle Kit:
```bash
npm run db:push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running the Playwright Test Suite

The test suite requires a running database and tests against `http://localhost:3000`.

### Install Playwright Browsers (First time only)
```bash
npx playwright install chromium
```

### Run E2E Tests
```bash
npm run test:e2e
```

The test runner will automatically start `npm run dev` if not already running, execute all tests sequentially (sharing the test database via `/api/testing/reset`), and verify:
- User registration and error states (`username-error`, `passwordConfirm-error`)
- Login and error states (`error-message`)
- Navigation links for guest vs. authenticated users
- Blog creation, listing, like counts, and case-insensitive filtering
- Individual blog detail views and ownership deletion
- Reading list operations (adding, viewing unread/read, marking as read)
- Personal API Token generation and regeneration without page reload
