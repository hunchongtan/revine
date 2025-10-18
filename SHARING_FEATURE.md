# 🔗 ReVine Sharing & Visibility Feature

## Quick Start

### 1. Run Database Migration
```bash
# Via Supabase CLI
supabase db push

# Or manually in Supabase Dashboard SQL Editor:
# Run: supabase/migrations/003_add_video_sharing.sql
# Optional: supabase/migrations/004_add_view_counter_rpc.sql
```

### 2. Set Environment Variable
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Test the Feature
1. Generate a video
2. See visibility toggle (Private/Public) below video
3. Click "Share This Vine" to share
4. Toggle visibility to Public
5. Visit the shareable URL

---

## Routes

### Private Video (Default)
```
/v/t/{12-char-token}
Example: /v/t/Ab3Cd5Ef7Gh9
```
- Unguessable random token
- Works even if unauthenticated
- NOT shown in Discover page

### Public Video
```
/v/{slug}
Example: /v/what-are-those
```
- SEO-friendly URL based on caption
- Shown in Discover page
- Anyone can access

---

## API Endpoints

### Create Video
```typescript
POST /api/videos/create
Headers: { Authorization: Bearer {token} }
Body: {
  templateId: string
  videoUrl: string
  caption: string
  visibility?: 'private' | 'public' // default: 'private'
}
Response: { video, shareUrl }
```

### Update Visibility
```typescript
PATCH /api/videos/{id}/visibility
Headers: { Authorization: Bearer {token} }
Body: { visibility: 'private' | 'public' }
Response: { video, shareUrl }
```

### Get Video
```typescript
GET /api/videos/{id}
Response: { video }
```

---

## Usage in Code

### Get Shareable URL
```typescript
import { getShareableUrl } from '@/lib/video-sharing';

const url = getShareableUrl(video);
// Returns: https://yourdomain.com/v/t/{token} or /v/{slug}
```

### Share Video
```typescript
import { shareVideo } from '@/lib/video-sharing';

const result = await shareVideo(video, {
  title: 'Check out my ReVine!',
  text: video.caption
});

if (result.success) {
  // result.method = 'native' or 'clipboard'
}
```

### Get Public Videos
```typescript
import { getPublicVideos } from '@/lib/video-sharing';

const videos = await getPublicVideos(50); // limit
```

---

## UI Components

### ResultPlayer (Updated)
Shows after video generation:
- ✅ Video player
- ✅ Visibility toggle (Private/Public)
- ✅ Share button
- ✅ Refresh/Open/Save buttons
- ✅ Auto-creates video record

### VideoViewer (New)
Standalone page for viewing shared videos:
- ✅ Full-screen video player
- ✅ Share button
- ✅ "Make Your Own" CTA
- ✅ Open Graph metadata

---

## Database Schema

### remixes Table (New Columns)
```sql
visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public'))
share_token TEXT UNIQUE  -- Auto-generated
slug TEXT UNIQUE         -- Auto-generated for public videos
```

### Functions
- `generate_share_token()`: Creates unique tokens
- `generate_slug(text, id)`: Creates URL-friendly slugs
- `increment_video_views(id)`: Tracks view counts (optional)

---

## Security

- ✅ RLS policies enforce ownership
- ✅ Share tokens are cryptographically random
- ✅ Private videos require exact token
- ✅ Public videos are intentionally discoverable
- ✅ Only owners can change visibility

---

## See Also

- **Full Documentation:** `HANDOVER_SUMMARY.md`
- **Migration Files:** `supabase/migrations/003_*.sql`
- **Utilities:** `lib/video-sharing.ts`

