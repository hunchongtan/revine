# ✅ Pre-Deployment Checklist

Before deploying the video sharing features to production, complete these tasks:

## 🗄️ Database Setup

- [ ] **Run Migration 003**
  ```bash
  # Option A: Supabase CLI
  supabase db push
  
  # Option B: Supabase Dashboard
  # 1. Go to Dashboard → SQL Editor
  # 2. Copy contents of: supabase/migrations/003_add_video_sharing.sql
  # 3. Paste and click "Run"
  ```

- [ ] **Optional: Run Migration 004 (View Counter)**
  ```bash
  # Same process as above with 004_add_view_counter_rpc.sql
  ```

- [ ] **Verify Migration Success**
  ```sql
  -- Run in Supabase SQL Editor:
  SELECT share_token, slug, visibility FROM remixes LIMIT 1;
  -- Should return columns without error
  ```

---

## ⚙️ Environment Variables

- [ ] **Add to `.env.local` (Development)**
  ```env
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

- [ ] **Add to Production Environment** (Vercel/your host)
  ```env
  NEXT_PUBLIC_APP_URL=https://yourdomain.com
  ```

- [ ] **Verify All Required Vars Present**
  ```env
  ✅ NEXT_PUBLIC_APP_URL
  ✅ NEXT_PUBLIC_SUPABASE_URL
  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
  ✅ SUPABASE_SERVICE_ROLE_KEY
  ✅ FAL_API_KEY (or FAL_KEY)
  ```

---

## 🧪 Testing (Local)

- [ ] **Test Video Generation Flow**
  1. Generate a video
  2. Verify video record is created in database
  3. Check that `share_token` is auto-generated

- [ ] **Test Visibility Toggle**
  1. Toggle to Public
  2. Verify `slug` is generated
  3. Verify URL changes from `/v/t/{token}` to `/v/{slug}`
  4. Toggle back to Private
  5. Verify URL reverts to token-based

- [ ] **Test Share Functionality**
  1. Click "Share This Vine"
  2. On desktop: verify clipboard copy
  3. On mobile: verify native share opens
  4. Verify toast notification appears

- [ ] **Test Video Viewing Pages**
  1. Visit `/v/t/{share_token}` (should work)
  2. Visit `/v/{slug}` for public video (should work)
  3. Visit `/v/invalid-slug` (should 404)
  4. Test as logged-out user

- [ ] **Test Permissions**
  1. Try changing visibility of someone else's video (should fail with 403)
  2. View private video without token (should fail)
  3. View public video without auth (should work)

---

## 🔍 Code Review

- [ ] **Review Key Files**
  - [ ] `lib/video-sharing.ts` - Utility functions
  - [ ] `app/api/videos/create/route.ts` - Video creation
  - [ ] `app/api/videos/[id]/visibility/route.ts` - Visibility updates
  - [ ] `components/result-player.tsx` - UI updates

- [ ] **Check for Console Errors**
  - Open browser DevTools
  - Check Console tab during:
    - Video generation
    - Visibility toggle
    - Share button click
    - Page navigation

- [ ] **Verify No Linting Errors**
  ```bash
  npm run lint
  # Or check in your IDE
  ```

---

## 📱 Mobile Testing

- [ ] **Test on iOS Safari**
  - [ ] Native share API works
  - [ ] Video plays correctly
  - [ ] UI is responsive

- [ ] **Test on Android Chrome**
  - [ ] Native share API works
  - [ ] Video plays correctly
  - [ ] UI is responsive

---

## 🌐 Social Media Integration

- [ ] **Verify Open Graph Tags**
  1. Share a public video link
  2. Test on:
     - [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
     - [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
     - [ ] LinkedIn Post Inspector
  3. Verify video thumbnail appears
  4. Verify caption appears

- [ ] **Test Video Embeds**
  - [ ] Paste link in Discord
  - [ ] Paste link in Slack
  - [ ] Paste link in iMessage
  - [ ] Verify video preview shows

---

## 🚀 Production Deployment

- [ ] **Update Discover Page** (if desired)
  ```typescript
  // In app/discover/page.tsx
  import { getPublicVideos } from '@/lib/video-sharing';
  const videos = await getPublicVideos(50);
  ```

- [ ] **Deploy to Production**
  ```bash
  git push origin main
  # Or your deployment method
  ```

- [ ] **Smoke Test Production**
  1. Generate a test video
  2. Toggle visibility
  3. Share the video
  4. Visit shareable link
  5. Check Supabase logs for errors

- [ ] **Monitor for Issues**
  - [ ] Check Vercel/host logs
  - [ ] Check Supabase logs
  - [ ] Monitor error tracking (Sentry, etc.)

---

## 📊 Optional Enhancements

Consider these improvements after launch:

- [ ] **Add View Counter Display**
  ```typescript
  // In VideoViewer component
  useEffect(() => {
    incrementVideoViews(video.id);
  }, [video.id]);
  ```

- [ ] **Add Video Deletion**
  ```typescript
  // New API endpoint: DELETE /api/videos/[id]
  ```

- [ ] **Add "Copy Link" Button**
  - Separate from share button
  - Always copies to clipboard

- [ ] **Add QR Code Generation**
  - For easy mobile sharing
  - Use library like `qrcode.react`

- [ ] **Add Analytics Tracking**
  - Track share button clicks
  - Track visibility changes
  - Track video views

---

## 🆘 Troubleshooting

If you encounter issues:

### "Video not saved yet" error
- ✅ Verify user is authenticated
- ✅ Check API route is accessible
- ✅ Look at browser Network tab

### Share token not generating
- ✅ Check trigger exists: `\df` in Supabase SQL
- ✅ Look at Supabase logs for errors
- ✅ Try inserting row manually to test trigger

### RLS permission errors
- ✅ Verify policies exist: Supabase Dashboard → Authentication → Policies
- ✅ Check if user is authenticated: `supabase.auth.getUser()`
- ✅ Review policy rules match your logic

### Slug not generating
- ✅ Verify video has caption
- ✅ Check trigger for `visibility='public'`
- ✅ Test function: `SELECT generate_slug('test caption', gen_random_uuid());`

---

## 📞 Resources

- **Full Documentation:** `HANDOVER_SUMMARY.md`
- **Quick Reference:** `SHARING_FEATURE.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Supabase Dashboard:** https://app.supabase.com
- **Fal.ai Dashboard:** https://fal.ai

---

## ✨ Success!

Once all boxes are checked, your sharing features are ready! 🎉

```
┌─────────────────────────────────────┐
│  🎬 ReVine Sharing Features Live!   │
│                                     │
│  ✅ Private videos with share links │
│  ✅ Public videos in Discover       │
│  ✅ Native share on mobile          │
│  ✅ SEO-friendly URLs               │
│  ✅ Open Graph support              │
└─────────────────────────────────────┘
```

