# ReVine Sharing & Visibility Features - Handover Summary

## 🎯 Overview
This implementation adds comprehensive video sharing and privacy controls to ReVine, allowing users to:
- Generate unique shareable links for every video (private by default)
- Toggle between private and public visibility
- Share videos via native share API or clipboard
- View videos via clean URLs (`/v/{slug}` or `/v/t/{token}`)
- Discover public videos on the discover page

---

## 📊 Database Changes

### Migration: `003_add_video_sharing.sql`

**Location:** `supabase/migrations/003_add_video_sharing.sql`

**New Columns Added to `remixes` Table:**
- `visibility` (TEXT): `'private' | 'public'` (default: `'private'`)
- `share_token` (TEXT): Unique token for private links (auto-generated)
- `slug` (TEXT): URL-friendly slug for public links (auto-generated when public)

**Functions Created:**
1. `generate_share_token()`: Creates unique 12-character URL-safe tokens
2. `generate_slug(base_text, record_id)`: Creates URL-friendly slugs from captions or IDs
3. Auto-trigger functions for token/slug generation

**Indexes Created:**
- `idx_remixes_share_token` on `remixes(share_token)`
- `idx_remixes_slug` on `remixes(slug)`
- `idx_remixes_visibility` on `remixes(visibility)`

**RLS Policy Updated:**
- Replaced "Public remixes are viewable by everyone" with more flexible policy
- Now supports viewing by: visibility=public, owner, OR anyone with share_token

### 🚨 **ACTION REQUIRED: Run Migration**

```bash
# Option 1: Via Supabase CLI
supabase db push

# Option 2: Via Supabase Dashboard
# Go to: Database → SQL Editor
# Paste contents of: supabase/migrations/003_add_video_sharing.sql
# Click "Run"
```

### TypeScript Types Updated
**File:** `types/database.ts`

Updated `remixes` table types to include:
- `visibility: 'private' | 'public'`
- `share_token: string`
- `slug: string | null`

---

## 🛠️ New Files Created

### 1. Utilities
**File:** `lib/video-sharing.ts`

**Exports:**
- `VideoVisibility` type: `'private' | 'public'`
- `VideoRecord`, `VideoInsert`, `VideoUpdate` types
- `getShareableUrl(video)`: Generate correct URL based on visibility
- `createVideoRecord(data)`: Create new video in database
- `updateVideoVisibility(videoId, visibility)`: Toggle visibility
- `getVideoByToken(token)`: Fetch video by private token
- `getVideoBySlug(slug)`: Fetch video by public slug
- `incrementVideoViews(videoId)`: Track view counts
- `getPublicVideos(limit)`: Get videos for discover page
- `shareVideo(video, options)`: Share via native API or clipboard

### 2. API Endpoints

#### `app/api/videos/create/route.ts`
- **Method:** POST
- **Auth:** Required
- **Body:** `{ templateId, videoUrl, caption, visibility? }`
- **Response:** `{ video, shareUrl }`
- Creates video record and returns shareable URL

#### `app/api/videos/[id]/visibility/route.ts`
- **Method:** PATCH
- **Auth:** Required (must be owner)
- **Body:** `{ visibility: 'private' | 'public' }`
- **Response:** `{ video, shareUrl }`
- Updates visibility and regenerates URL

#### `app/api/videos/[id]/route.ts`
- **Method:** GET
- **Auth:** Optional (required for private videos)
- **Response:** `{ video }`
- Fetches single video by ID

### 3. Pages

#### `app/v/t/[token]/page.tsx`
- **Route:** `/v/t/{share_token}`
- **Purpose:** View private videos via share token
- **Features:** 
  - SEO metadata with Open Graph
  - Twitter card support
  - Works without authentication

#### `app/v/[slug]/page.tsx`
- **Route:** `/v/{slug}`
- **Purpose:** View public videos via slug
- **Features:**
  - Same as token page
  - Only works for `visibility='public'`

### 4. Components

#### `components/video-viewer.tsx`
- Displays video on standalone pages
- Share button with native share API fallback
- "Make Your Own" CTA button
- Responsive design matching ReVine brand

#### `components/result-player.tsx` (Updated)
- Added visibility toggle UI
- Added share button
- Auto-creates video record on mount
- Passes `templateId` for proper tracking
- Shows lock/globe icon based on visibility
- Integrated with toast notifications

#### `components/generate-panel.tsx` (Updated)
- Passes `templateId` to ResultPlayer
- Ready for future redirect to video page (commented out)

---

## 🔄 Flow Diagram

```
User Generates Video
       ↓
ResultPlayer Mounts
       ↓
Auto-calls /api/videos/create
       ↓
Video Record Created (visibility='private', share_token generated)
       ↓
User Sees:
  - Video Player
  - Visibility Toggle (Private/Public)
  - Share Button
  - Refresh/Open/Save buttons
       ↓
User Clicks "Change" → Toggle Visibility
       ↓
Calls /api/videos/{id}/visibility
       ↓
If visibility='public' → slug auto-generated
Share URL updates (either /v/{slug} or /v/t/{token})
       ↓
User Clicks "Share This Vine"
       ↓
Native share API OR clipboard copy
```

---

## ✅ Testing Checklist

### Database
- [ ] Run migration successfully
- [ ] Verify `share_token` auto-generates on insert
- [ ] Verify `slug` auto-generates when visibility='public'
- [ ] Test RLS policies (owner can see private, public visible to all)
- [ ] Verify uniqueness constraints on `share_token` and `slug`

### API Endpoints
- [ ] POST `/api/videos/create` returns video with shareUrl
- [ ] PATCH `/api/videos/{id}/visibility` toggles correctly
- [ ] GET `/api/videos/{id}` respects ownership/visibility
- [ ] Unauthorized requests return 401
- [ ] Non-owners can't update visibility (403)

### Frontend
- [ ] Video generates successfully
- [ ] ResultPlayer shows visibility controls
- [ ] Visibility toggle works (Private ↔ Public)
- [ ] Share button copies link to clipboard
- [ ] Share button uses native share on mobile
- [ ] `/v/t/{token}` page loads private videos
- [ ] `/v/{slug}` page loads public videos
- [ ] 404 page for invalid tokens/slugs
- [ ] Open Graph meta tags present for sharing

### Edge Cases
- [ ] Unauthenticated users can view public videos
- [ ] Unauthenticated users can view via share token
- [ ] Private videos can't be accessed via slug
- [ ] Public videos are indexed for discovery
- [ ] Slug conflicts are resolved (e.g., `slug-1`, `slug-2`)

---

## 🚧 TODOs for Your Teammate

### 1. **Environment Variable**
Add to `.env.local` and production:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
This is used to generate shareable URLs. Defaults to `http://localhost:3000` if not set.

### 2. **Run Migration**
Execute `supabase/migrations/003_add_video_sharing.sql` in your Supabase project (see Database Changes section above).

### 3. **Update Discover Page** (Optional)
Modify `app/discover/page.tsx` to filter by `visibility='public'`:
```typescript
import { getPublicVideos } from "@/lib/video-sharing";

export default async function DiscoverPage() {
  const videos = await getPublicVideos(50);
  // ... render videos
}
```

### 4. **Add View Counter** (Optional)
Create RPC function in Supabase:
```sql
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE remixes 
  SET views_count = views_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Then call in video viewer pages:
```typescript
import { incrementVideoViews } from "@/lib/video-sharing";

// In component
useEffect(() => {
  incrementVideoViews(video.id);
}, [video.id]);
```

### 5. **Optional: Redirect After Generation**
In `components/result-player.tsx`, line 79, uncomment:
```typescript
// window.location.href = data.shareUrl;
```
This will redirect users to the video page after generation completes.

### 6. **Test Authentication Flow**
- Ensure users must be logged in to create videos
- Test with Supabase auth (sign up, sign in, sign out)
- Verify guest users can view public videos and shared links

### 7. **Update Discover Page Filter**
Ensure the discover page only shows `visibility='public'` videos (not just `is_public=true`).

---

## 📝 Notes

### Design Decisions

1. **Private by Default**: Videos start as `visibility='private'` for user privacy. Users explicitly opt-in to public sharing.

2. **Dual URL Structure**:
   - `/v/t/{token}`: Unguessable private links (12-char random token)
   - `/v/{slug}`: SEO-friendly public links (based on caption)

3. **Auto-generation**: Both `share_token` and `slug` are generated automatically via database triggers.

4. **Backward Compatibility**: Kept `is_public` field alongside `visibility` for gradual migration. You can remove `is_public` later if desired.

5. **No Delete Functionality**: Currently, users cannot delete videos. Add this feature separately if needed:
   ```typescript
   // Example DELETE endpoint
   DELETE /api/videos/{id}
   ```

### Security Considerations

- Share tokens are cryptographically random (9 bytes → base64 → 12 chars)
- RLS policies prevent unauthorized access
- Ownership verified on all mutations
- Public videos are intentionally discoverable
- Private videos require exact token knowledge

### Performance

- Indexes on `share_token`, `slug`, and `visibility` for fast lookups
- Video creation happens async (doesn't block generation)
- Share URL generation is instant (no external API calls)

---

## 🆘 Troubleshooting

### "Video not saved yet" error
- Ensure user is authenticated before generating video
- Check Supabase connection and auth configuration
- Verify API route is being called successfully

### Share token not generating
- Check trigger is created: `trigger_auto_share_token`
- Verify `gen_random_uuid()` extension is enabled
- Look at Supabase logs for errors

### Slug conflicts
- Function auto-appends `-1`, `-2`, etc. for conflicts
- Check `generate_slug()` function exists
- Verify trigger `trigger_auto_slug` is active

### RLS errors
- Run: `SELECT * FROM remixes` as authenticated user
- Check RLS policies in Supabase dashboard
- Ensure service role key is used for server-side queries

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs → API Logs
2. Review browser console for client-side errors
3. Verify migration ran successfully: `SELECT * FROM remixes LIMIT 1;`
4. Test API endpoints directly via Postman/curl

---

**Implementation Date:** 2025-10-18  
**Version:** 1.0  
**Status:** ✅ Complete - Ready for Testing

