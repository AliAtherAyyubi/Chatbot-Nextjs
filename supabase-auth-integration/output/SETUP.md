# Supabase Auth Integration — Setup Guide

## 1. Install packages, remove Prisma

```bash
npm uninstall @prisma/client prisma @prisma/adapter-better-sqlite3 better-sqlite3 server-only
npm install @supabase/ssr @supabase/supabase-js
npm install server-only
```

Delete these (no longer needed):
```
src/lib/prisma.ts
src/generated/prisma/
prisma/
prisma.config.ts
```

## 2. Create a Supabase project

1. Go to supabase.com → New Project (free tier)
2. Go to Project Settings → API → copy:
   - Project URL
   - anon public key

## 3. `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

## 4. Run the SQL schema

Go to Supabase Dashboard → SQL Editor → paste the contents of
`supabase_schema.sql` → Run. This creates the `conversations` and
`messages` tables with Row Level Security so each user only sees
their own chats.

## 5. Disable email confirmation (optional, for faster local testing)

Supabase Dashboard → Authentication → Providers → Email →
toggle off "Confirm email". Skip this if you want the real
verification-email flow.

## 6. File placement — copy these into your project

```
src/
├── middleware.ts                                  ← project root /src
├── lib/supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
├── hooks/
│   ├── useAuth.ts          (new)
│   ├── useChat.ts          (replace existing)
│   └── useTheme.ts         (unchanged, keep as-is)
├── app/
│   ├── login/page.tsx                             (new)
│   ├── signup/page.tsx                            (new)
│   ├── auth/callback/route.ts                     (new)
│   └── api/
│       ├── conversations/route.ts                 (replace)
│       ├── conversations/[id]/messages/route.ts   (replace)
│       └── gemini/route.ts                        (unchanged)
└── components/
    └── profile.tsx          (replace existing)
```

## 7. Run it

```bash
npm run dev
```

Visiting `/` while logged out auto-redirects to `/login`. After
signup + login, you land on the chat UI with the profile dropdown
showing your real name/email and a working Sign Out.

## What changed vs. Prisma version

| Before (Prisma + SQLite) | After (Supabase) |
|---|---|
| Single shared `dev.db` file | Per-user data via `user_id` + RLS |
| No login | Full email/password auth |
| Doesn't survive Vercel deploy | Works on Vercel out of the box |
| `prisma.conversation.findMany()` | `supabase.from("conversations").select()` |
