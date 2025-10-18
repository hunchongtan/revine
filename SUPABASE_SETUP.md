# ReVine Supabase Setup Guide

This guide will help you set up Supabase for ReVine with authentication, database tables, and storage.

## Prerequisites

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your project credentials from Settings → API

## 1. Run Database Migrations

In your Supabase project, go to **SQL Editor** and run the following migrations in order:

### Migration 1: Initial Schema
Run the contents of `supabase/migrations/001_initial_schema.sql`

This will create:
- `profiles` table (user accounts)
- `templates` table (Vine templates)
- `favourites` table (user saved templates)
- `remixes` table (user-generated videos)
- Storage buckets (`templates`, `renders`)
- RLS policies for security
- Triggers for auto-profile creation

### Migration 2: Seed Templates
Run the contents of `supabase/migrations/002_seed_templates.sql`

This will populate the `templates` table with 23 classic Vine templates.

## 2. Configure Authentication

1. Go to **Authentication → Providers**
2. Enable **Email** auth
3. Configure email templates (optional but recommended):
   - Go to **Authentication → Email Templates**
   - Customize the magic link email template

## 3. Upload Template Thumbnails

You have two options for template thumbnails:

### Option A: Use Supabase Storage (Recommended)

1. Go to **Storage → templates bucket**
2. Upload thumbnail images with the following structure:
   ```
   templates/
     backyard-stunt-celebration.jpg
     cereal-spoon-refusal.jpg
     toy-ducks-screaming.jpg
     car-interior-steering.jpg
     park-birds-arm-sweep.jpg
     kitchen-tortilla-flip.jpg
     hallway-croissant-drop.jpg
     selfie-eyebrows-pose.jpg
     skate-trick-reaction.jpg
     sassy-lip-sync-eyebrow-raise.jpg
     phone-prank-reaction.jpg
     shoes-pointing-dramatic-zoom.jpg
     bathroom-goggles-scream.jpg
     hot-tub-two-people.jpg
     overacted-reaction-collapse.jpg
     deadpan-phone-smack.jpg
     floating-potato-airy.jpg
     spelling-bee-podium.jpg
     sports-announcer-excitement.jpg
     placeholder.jpg  (for templates without specific images)
   ```

3. The URLs in the database are already configured to use `templates/` prefix

### Option B: Use Local Public Folder (Development)

1. Place thumbnails in `public/templates/`
2. Update the `thumbnail_url` in the seed script to use `/templates/` instead of `templates/`

## 4. Update Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase (already configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 5. Test Authentication

1. Start your dev server: `npm run dev`
2. Click the user icon in the header
3. Try signing up with email
4. Check your Supabase dashboard → Authentication → Users

## 6. Verify Setup

After setup, verify:

✅ Templates are visible on the homepage
✅ You can sign up/sign in
✅ Favourites are saved (click ⭐ on a template)
✅ User menu shows in header when logged in

## Troubleshooting

### Templates not loading
- Check that migrations ran successfully in Supabase SQL Editor
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`
- Check browser console for errors

### Auth not working
- Verify email auth is enabled in Supabase dashboard
- Check that `SUPABASE_ANON_KEY` is correct
- Clear browser local storage and try again

### Thumbnails not showing
- Verify `templates` bucket exists and is public
- Check that thumbnail files are uploaded with correct names
- Verify file paths in `templates` table match uploaded files

## Next Steps

Once setup is complete:
1. Upload template thumbnails to Supabase storage
2. Test favourites functionality
3. Generate a video and save it as a remix
4. View public remixes at `/remixes/public`

