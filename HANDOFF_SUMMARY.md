# 🎬 ReVine Supabase Integration - Complete Guide

## 📋 Overview

ReVine now has full Supabase authentication and database support! This document contains everything you and your friend need to get it working.

---

## ✅ What's Been Completed

### 1. **Database Schema & Migrations**
Created 3 SQL migration files in `supabase/migrations/`:
- `001_initial_schema.sql` - Complete database schema (profiles, templates, favourites, remixes tables + RLS policies + storage buckets)
- `002_seed_templates.sql` - Seeds 23 classic Vine templates with all data
- `003_remix_functions.sql` - Helper functions (view counting, etc.)

### 2. **Authentication System**
- ✅ Email/password login
- ✅ Magic link (passwordless) login
- ✅ Sign up with automatic profile creation
- ✅ Session persistence in localStorage
- ✅ Auth callback page (`/auth/callback`)
- ✅ User menu with dropdown
- ✅ Auth modal with 3 modes (magic/signin/signup)

### 3. **New Pages**
- `/favourites` - User's saved templates
- `/remixes/public` - Public gallery of user-generated videos
- `/auth/callback` - Handles magic link redirects

### 4. **Services & Infrastructure**
- `lib/services/templates.ts` - Fetch templates, manage favourites
- `lib/services/remixes.ts` - Save/fetch user remixes
- `lib/hooks/use-auth.tsx` - Auth context & hooks
- `lib/template-adapter.ts` - Backwards compatibility with hardcoded templates
- `lib/supabase-client.ts` - Supabase client with auth support
- `types/database.ts` - TypeScript types for database

### 5. **UI Components**
- `components/auth-modal.tsx` - Login/signup modal
- `components/user-menu.tsx` - User dropdown menu  
- `components/ui/dialog.tsx` - Radix UI dialog

---

## 🚀 For Your Friend: Supabase Setup (20-40 mins)

Your friend needs to set up Supabase. Here's the complete guide:

### Step 1: Create Supabase Project (5 mins)
1. Go to [https://supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose project name (e.g., "revine-prod")
4. Set a strong database password (SAVE THIS!)
5. Choose a region close to your users
6. Wait for project to initialize (~2 mins)

### Step 2: Run Database Migrations (2 mins)
1. Go to **SQL Editor** in Supabase dashboard
2. Run **Migration 1**: Copy entire contents of `supabase/migrations/001_initial_schema.sql`, paste into SQL Editor, click "Run"
3. Run **Migration 2**: Copy entire contents of `supabase/migrations/002_seed_templates.sql`, paste into SQL Editor, click "Run"
4. Run **Migration 3**: Copy entire contents of `supabase/migrations/003_remix_functions.sql`, paste into SQL Editor, click "Run"
5. Verify: Go to **Table Editor** → should see `profiles`, `templates`, `favourites`, `remixes` tables

### Step 3: Enable Authentication (1 min)
1. Go to **Authentication → Providers**
2. Verify **Email** is enabled (should be by default)
3. *(Optional)* Customize email templates in **Authentication → Email Templates**

### Step 4: Configure Storage Buckets (1 min)
1. Go to **Storage** in dashboard
2. Verify these buckets exist (migrations should have created them):
   - `templates` (public) - for template thumbnails
   - `renders` (public) - for user-generated videos
3. If they don't exist, create them:
   - Click "New bucket"
   - Name: `templates`, Public: ✅ YES
   - Name: `renders`, Public: ✅ YES

### Step 5: Upload Template Thumbnails (10-30 mins)

**Option A: Supabase Storage (Production)**
1. Go to **Storage → templates** bucket
2. Create a folder called `templates/` (if it doesn't exist)
3. Upload these 20 image files (ask main developer for these):
   - backyard-stunt-celebration.jpg
   - cereal-spoon-refusal.jpg
   - toy-ducks-screaming.jpg
   - car-interior-steering.jpg
   - park-birds-arm-sweep.jpg
   - kitchen-tortilla-flip.jpg
   - hallway-croissant-drop.jpg
   - selfie-eyebrows-pose.jpg
   - skate-trick-reaction.jpg
   - sassy-lip-sync-eyebrow-raise.jpg
   - phone-prank-reaction.jpg
   - shoes-pointing-dramatic-zoom.jpg
   - bathroom-goggles-scream.jpg
   - hot-tub-two-people.jpg
   - overacted-reaction-collapse.jpg
   - deadpan-phone-smack.jpg
   - floating-potato-airy.jpg
   - spelling-bee-podium.jpg
   - sports-announcer-excitement.jpg
   - placeholder.jpg (for templates without specific images)

**Option B: Local Development (Skip for now)**
- Just use local files in `public/templates/` for development
- Can upload to Supabase later

### Step 6: Get API Keys (1 min)
1. Go to **Settings → API** in Supabase dashboard
2. Copy these 3 values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (different long string - KEEP SECRET!)
3. Send these to the main developer

### Step 7: Troubleshooting

**Templates not showing after migrations:**
- Go to SQL Editor, run: `SELECT * FROM templates;`
- Should see 23 rows
- If empty, re-run migration 2

**Auth not working:**
- Check **Authentication → Providers** → Email is enabled
- Check **Authentication → Configuration** → Site URL is correct
- Test by going to **Authentication → Users** → "Invite user"

**Storage buckets missing:**
- Manually create them: **Storage** → "New bucket"
- Make sure "Public bucket" is checked

**Thumbnails not loading:**
- Verify files uploaded to correct path: `templates/filename.jpg`
- Test URL: `https://YOUR-PROJECT.supabase.co/storage/v1/object/public/templates/backyard-stunt-celebration.jpg`

---

## 🔧 For You: After Supabase Setup

Once your friend sends you the API keys:

### 1. Add Environment Variables
Update `.env.local`:

```env
# Supabase (ADD THESE)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key...

# Existing keys (should already be there)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
FAL_KEY=...
```

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Test Authentication
- Click user icon in header → modal should open
- Sign up with test email
- Check Supabase dashboard → **Authentication → Users** → should see new user
- User menu should show email

### 4. Test Favourites
- Click ⭐ on a template while logged in
- Go to "My Favourites" from user menu
- Should see the saved template

### 5. (Optional) Integrate Remix Saving
When a video is generated, save it to database:

```typescript
// In your video generation completion code
import { saveRemix } from "@/lib/services/remixes"
import { useAuth } from "@/lib/hooks/use-auth"

const { user } = useAuth()

// After successful video generation:
if (user && finalVideoUrl) {
  const { success, remixId } = await saveRemix({
    userId: user.id,
    templateId: selectedTemplate.id,
    videoUrl: finalVideoUrl,
    caption: generatedCaption,
    isPublic: false, // or true for public gallery
  })
  
  if (success) {
    toast.success("Video saved!")
  }
}
```

---

## 🎯 How It Works

### Authentication Flow
```
User clicks icon → Modal opens → Enter email/password
→ Supabase creates user → Trigger creates profile
→ Session saved to localStorage → User menu shows email
```

### Favourites Flow
```
Guest: Click ⭐ → Saved to localStorage
Logged in: Click ⭐ → Saved to Supabase database
On login: localStorage favourites auto-sync to database
```

### Template Loading
```
App loads → Calls fetchTemplates()
→ Queries Supabase templates table
→ If logged in, joins with user's favourites
→ Returns templates with isFavourite flag
→ TemplateCard shows filled ⭐ if favourite
```

---

## 📊 Database Schema

```sql
profiles
  - id (uuid)
  - email (text)
  - display_name (text)
  - created_at (timestamp)

templates
  - id (text, primary key)
  - title (text)
  - year (int: 2013-2016)
  - category (text)
  - thumbnail_url (text)
  - audio_script (text)
  - video_prompt (text)
  - beat_sheet (jsonb)
  - default_voice_id (text)
  - persona (text)

favourites
  - user_id (uuid → profiles)
  - template_id (text → templates)
  PRIMARY KEY (user_id, template_id)

remixes
  - id (uuid)
  - user_id (uuid → profiles)
  - template_id (text → templates)
  - video_url (text)
  - caption (text)
  - is_public (boolean)
  - views_count (int)
  - created_at (timestamp)
```

---

## ✅ Testing Checklist

After Supabase setup is complete:

### Authentication
- [ ] Click user icon → modal opens
- [ ] Sign up with email → success
- [ ] Check Supabase dashboard → user appears
- [ ] Sign in with password → works
- [ ] User menu shows email
- [ ] Sign out → menu changes back to icon

### Favourites
- [ ] Click ⭐ while logged out → saves to localStorage
- [ ] Sign in → localStorage favourites sync automatically
- [ ] Click ⭐ while logged in → saves to Supabase
- [ ] Go to `/favourites` → see saved templates
- [ ] Click ⭐ again → removes from favourites

### Database
- [ ] Templates load from Supabase
- [ ] Thumbnails show correctly (if uploaded)
- [ ] Can filter templates by year
- [ ] Search works

### Pages
- [ ] Visit `/remixes/public` → loads (empty is OK for now)
- [ ] Visit `/favourites` → redirects to home if not logged in

---

## 🔒 Security Notes

- **RLS (Row Level Security)** is enabled on all tables
- Users can only:
  - View their own profile
  - Insert/delete their own favourites
  - Insert/update/delete their own remixes
- Everyone can:
  - Read templates (public)
  - Read public remixes
- Storage buckets are public for read, auth required for write

---

## 🐛 Known Issues

1. **Template thumbnails 404ing**
   - Normal until images uploaded to Supabase storage
   - OR place in `/public/templates/` for local dev

2. **"Module not found" errors after pulling**
   - Run `npm install` to get new dependencies
   - Restart dev server

3. **Video generation doesn't save to remixes table yet**
   - Need to integrate `saveRemix()` call (see section above)
   - Works fine without it, just doesn't persist to DB

---

## 📁 Important Files

```
supabase/migrations/          # SQL migrations (your friend needs these)
├── 001_initial_schema.sql
├── 002_seed_templates.sql
└── 003_remix_functions.sql

lib/
├── supabase-client.ts        # Supabase client
├── hooks/use-auth.tsx        # Auth context
├── services/
│   ├── templates.ts          # Template CRUD
│   └── remixes.ts            # Remix CRUD
└── template-adapter.ts       # Backwards compatibility

components/
├── auth-modal.tsx            # Login/signup modal
└── user-menu.tsx             # User dropdown

app/
├── auth/callback/page.tsx    # Magic link handler
├── favourites/page.tsx       # User favourites
└── remixes/public/page.tsx   # Public gallery
```

---

## 🚦 Current State

**Works NOW (without Supabase):**
- ✅ All existing functionality
- ✅ Video generation  
- ✅ Favourites (localStorage)
- ✅ Template browsing
- ✅ Graceful degradation

**Works AFTER Supabase setup:**
- ✅ User authentication
- ✅ Database-backed templates
- ✅ Favourites sync to database
- ✅ Public remixes gallery
- ✅ Persistent user profiles

---

## 🎉 Summary

**Your friend's tasks:**
1. Create Supabase project (5 mins)
2. Run 3 SQL migrations (2 mins)
3. Upload thumbnails or use local (10-30 mins)
4. Send you API keys (1 min)
**Total: 20-40 minutes**

**Your tasks after:**
1. Add keys to `.env.local` (1 min)
2. Test authentication (2 mins)
3. Test favourites (2 mins)
4. *(Optional)* Integrate remix saving (10-20 mins)

---

**All set! Once your friend completes the Supabase setup, you'll have a fully functional database-backed Vine meme generator with user authentication! 🚀**
