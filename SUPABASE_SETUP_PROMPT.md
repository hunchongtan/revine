# 🚀 ReVine Supabase Setup - Complete Guide for Your Friend

Hey! Thanks for taking over the Supabase setup for ReVine. Here's everything you need to know to get the database and authentication working.

---

## 📋 Overview

ReVine needs Supabase for:
1. **User Authentication** (email/password + magic links)
2. **Template Storage** (23 Vine templates)
3. **Favourites** (users can save templates)
4. **Remixes** (user-generated videos)
5. **File Storage** (thumbnails + videos)

---

## ✅ Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Choose a name (e.g., "revine-prod")
4. Set a strong database password (save this!)
5. Choose a region close to your users

---

## ✅ Step 2: Run Database Migrations

Go to **SQL Editor** in your Supabase dashboard and run these SQL scripts **in order**:

### Migration 1: Initial Schema
📁 File: `supabase/migrations/001_initial_schema.sql`

This creates:
- `profiles` table (user accounts)
- `templates` table (Vine templates)
- `favourites` table (user ↔ template relationship)
- `remixes` table (user-generated videos)
- Storage buckets (`templates`, `renders`)
- RLS (Row Level Security) policies
- Auto-profile creation trigger

**Action**: Copy the entire contents of `001_initial_schema.sql` and paste into SQL Editor, then click "Run".

### Migration 2: Seed Templates
📁 File: `supabase/migrations/002_seed_templates.sql`

This populates the database with 23 classic Vine templates.

**Action**: Copy the entire contents of `002_seed_templates.sql` and paste into SQL Editor, then click "Run".

---

## ✅ Step 3: Enable Authentication

1. Go to **Authentication → Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. *(Optional)* Customize email templates:
   - Go to **Authentication → Email Templates**
   - Edit "Magic Link" template to match ReVine branding
   - Use Vine green color: `#00bf8f`

### Email Configuration (Important!)
- Make sure email is configured properly
- For development: Supabase provides a test email service
- For production: Set up SMTP or use a service like SendGrid

---

## ✅ Step 4: Configure Storage Buckets

The migration should have created the buckets, but let's verify:

1. Go to **Storage** in Supabase dashboard
2. Verify these buckets exist:
   - `templates` (public) - for template thumbnails
   - `renders` (public) - for user-generated videos

3. If they don't exist, create them manually:
   - Click "New bucket"
   - Name: `templates`, Public: ✅
   - Name: `renders`, Public: ✅

---

## ✅ Step 5: Upload Template Thumbnails

You have **two options**:

### Option A: Supabase Storage (Recommended for Production)

1. Go to **Storage → templates** bucket
2. Upload these image files:

```
templates/
  ├── backyard-stunt-celebration.jpg
  ├── cereal-spoon-refusal.jpg
  ├── toy-ducks-screaming.jpg
  ├── car-interior-steering.jpg
  ├── park-birds-arm-sweep.jpg
  ├── kitchen-tortilla-flip.jpg
  ├── hallway-croissant-drop.jpg
  ├── selfie-eyebrows-pose.jpg
  ├── skate-trick-reaction.jpg
  ├── sassy-lip-sync-eyebrow-raise.jpg
  ├── phone-prank-reaction.jpg
  ├── shoes-pointing-dramatic-zoom.jpg
  ├── bathroom-goggles-scream.jpg
  ├── hot-tub-two-people.jpg
  ├── overacted-reaction-collapse.jpg
  ├── deadpan-phone-smack.jpg
  ├── floating-potato-airy.jpg
  ├── spelling-bee-podium.jpg
  ├── sports-announcer-excitement.jpg
  └── placeholder.jpg
```

**Where to get images:**
- Ask the main developer if they have these
- OR use placeholder images for now (any 192x256px images will work)
- OR generate AI images matching the Vine template descriptions

### Option B: Local Development Only

If you just want to test locally without uploading:
1. Keep images in `public/templates/` folder
2. Update the seed script SQL to use `/templates/` instead of `templates/`:
   ```sql
   -- Change this:
   thumbnail_url: 'templates/backyard-stunt-celebration.jpg'
   -- To this:
   thumbnail_url: '/templates/backyard-stunt-celebration.jpg'
   ```
3. Re-run the seed migration

---

## ✅ Step 6: Get API Keys

1. Go to **Settings → API** in Supabase dashboard
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (keep this secret!)
```

3. Create/update `.env.local` file in the project root:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# Other keys (should already exist)
OPENAI_API_KEY=...
ELEVENLABS_API_KEY=...
FAL_KEY=...
```

---

## ✅ Step 7: Test the Setup

1. Restart the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. **Test Authentication:**
   - Click the user icon in the header
   - Try signing up with an email
   - Check Supabase dashboard → Authentication → Users
   - You should see the new user

4. **Test Templates:**
   - Templates should load on the homepage
   - If you see database templates (not "Template not found"), it's working!

5. **Test Favourites:**
   - Click the ⭐ on a template while logged in
   - Go to "My Favourites" from the user menu
   - You should see the saved template

---

## 🐛 Troubleshooting

### Templates not loading
- ✅ Check that both migrations ran successfully (SQL Editor → History)
- ✅ Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`
- ✅ Check browser console for errors
- ✅ Run: `SELECT * FROM templates;` in SQL Editor to see if data exists

### Auth not working
- ✅ Verify email auth is enabled (Authentication → Providers)
- ✅ Check that `.env.local` has correct `SUPABASE_ANON_KEY`
- ✅ Clear browser localStorage and try again
- ✅ Check Supabase logs (Logs → Auth Logs)

### Thumbnails not showing
- ✅ Verify `templates` bucket exists and is public (Storage)
- ✅ Check that files are uploaded with correct names (exact match from seed script)
- ✅ Test a direct URL: `https://xxxxx.supabase.co/storage/v1/object/public/templates/backyard-stunt-celebration.jpg`

### "Module not found" errors
- ✅ Run: `npm install`
- ✅ Restart the dev server
- ✅ Check that all files were pushed to the repo

---

## 🎯 Verification Checklist

Once everything is set up, verify:

- [ ] Can sign up with email
- [ ] Can sign in with password
- [ ] Magic link email arrives
- [ ] User menu shows email when logged in
- [ ] Templates load on homepage
- [ ] Can click ⭐ to save favourites
- [ ] "My Favourites" page shows saved templates
- [ ] "Public Remixes" page loads (empty is OK)
- [ ] Thumbnails show for templates

---

## 📞 Need Help?

If you get stuck:
1. Check Supabase dashboard → Logs for errors
2. Check browser console for JavaScript errors
3. Ping the main developer with:
   - What step you're on
   - The error message
   - Screenshot of the issue

---

## 🎨 Optional: Customize Email Templates

Go to **Authentication → Email Templates** and make the emails match Vine's style:

### Magic Link Template Example:
```html
<h2 style="color: #00bf8f;">Welcome to ReVine!</h2>
<p>Click the link below to sign in:</p>
<a href="{{ .ConfirmationURL }}" 
   style="background: #00bf8f; color: white; padding: 12px 24px; 
          text-decoration: none; border-radius: 8px; display: inline-block;">
  Sign In to ReVine
</a>
<p>This link expires in 1 hour.</p>
```

---

## 🚀 Once Setup is Complete

Let the main developer know you're done and share:
1. The Supabase project URL
2. Confirmation that all tests passed
3. Any issues you encountered

The app should now have:
- ✅ Working authentication
- ✅ Database-backed templates
- ✅ User favourites
- ✅ Ready for remix storage

---

**Good luck! You've got this! 🎉**

