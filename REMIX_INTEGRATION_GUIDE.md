# 🎬 Remix Integration Guide

## How to Save Generated Videos to the Database

Once Supabase is set up, you'll want to save user-generated videos to the `remixes` table. Here's how:

---

## 📋 What's Already Done

✅ `remixes` table created in database
✅ `lib/services/remixes.ts` with helper functions
✅ `003_remix_functions.sql` for view counting
✅ Storage bucket `renders/` for video files
✅ RLS policies for security

---

## 🔧 Integration Steps

### Step 1: Import the Remix Service

In `components/generate-panel.tsx`, add this import:

```typescript
import { saveRemix } from "@/lib/services/remixes"
import { useAuth } from "@/lib/hooks/use-auth"
```

### Step 2: Get User from Auth Context

In the component, add:

```typescript
const { user } = useAuth()
```

### Step 3: Save After Video Generation

Find where the video generation completes (after muxing), and add:

```typescript
// After successful video generation
const finalVideoUrl = result.videoUrl // or wherever your final URL is

// Save to database if user is logged in
if (user && finalVideoUrl) {
  const { success, remixId } = await saveRemix({
    userId: user.id,
    templateId: selectedTemplate.id,
    videoUrl: finalVideoUrl,
    caption: generatedCaption, // if you have one
    isPublic: false, // or true if you want it public by default
  })

  if (success) {
    console.log("Remix saved!", remixId)
    toast.success("Video saved to your profile!")
  } else {
    console.warn("Failed to save remix")
    // Still show the video, just didn't save to DB
  }
}
```

### Step 4: Add "Make Public" Toggle (Optional)

You can add a checkbox in the result view:

```typescript
const [isPublic, setIsPublic] = useState(false)

// In your UI:
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isPublic}
    onChange={(e) => {
      setIsPublic(e.target.checked)
      if (remixId) {
        updateRemix(remixId, { isPublic: e.target.checked })
      }
    }}
  />
  <span>Make public (show in gallery)</span>
</label>
```

---

## 📝 Example: Complete Integration

Here's a complete example of where to add the code:

```typescript
// In generate-panel.tsx or wherever video generation completes

async function handleGeneration() {
  try {
    // ... your existing generation code ...
    
    // Step 1: Generate caption
    const caption = await generateCaption(...)
    
    // Step 2: Generate audio
    const audioUrl = await generateAudio(...)
    
    // Step 3: Generate video
    const videoUrl = await generateVideo(...)
    
    // Step 4: Mux audio + video
    const finalUrl = await muxAudioVideo(...)
    
    // ✨ NEW: Step 5: Save to database
    if (user && finalUrl) {
      const { success, remixId } = await saveRemix({
        userId: user.id,
        templateId: selectedTemplate.id,
        videoUrl: finalUrl,
        caption: caption,
        isPublic: false,
      })
      
      if (success) {
        setRemixId(remixId) // Store for later updates
        toast.success("🎉 Video saved!")
      }
    }
    
    // Show the final result
    setFinalVideoUrl(finalUrl)
    setGenerationComplete(true)
    
  } catch (error) {
    console.error("Generation failed:", error)
    toast.error("Failed to generate video")
  }
}
```

---

## 🎯 Storage Path Convention

When uploading videos to Supabase storage, use this path pattern:

```
renders/{userId}/{remixId}.mp4
```

Example:
```
renders/550e8400-e29b-41d4-a716-446655440000/abc123.mp4
```

This ensures:
- ✅ Each user has their own folder
- ✅ Files are organized
- ✅ RLS policies work correctly

---

## 🔒 Security Notes

The RLS policies ensure:
- ✅ Users can only insert their own remixes
- ✅ Users can only update/delete their own remixes
- ✅ Everyone can view public remixes
- ✅ Only the owner can view private remixes

---

## 🧪 Testing

After integration, test:

1. **Generate a video while logged OUT**
   - Should work, but NOT save to database
   - Video still downloadable

2. **Generate a video while logged IN**
   - Should work AND save to database
   - Check Supabase dashboard → remixes table
   - Should see new row

3. **Make a remix public**
   - Toggle "Make public" checkbox
   - Visit `/remixes/public`
   - Should see your remix in the gallery

4. **View your remixes**
   - Go to user menu → "My Remixes" (if you add this page)
   - Should see all your generated videos

---

## 🚀 Optional Enhancements

### Add "My Remixes" Page

Create `app/remixes/my/page.tsx`:

```typescript
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { fetchUserRemixes } from "@/lib/services/remixes"

export default function MyRemixesPage() {
  const { user } = useAuth()
  const [remixes, setRemixes] = useState([])

  useEffect(() => {
    if (user) {
      fetchUserRemixes(user.id).then(setRemixes)
    }
  }, [user])

  // ... render grid of remixes ...
}
```

### Add Download Button

```typescript
function downloadRemix(videoUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = videoUrl
  a.download = filename
  a.click()
}

// In your UI:
<button onClick={() => downloadRemix(remix.video_url, `revine-${remix.id}.mp4`)}>
  💾 Download
</button>
```

### Add Share Button

```typescript
async function shareRemix(remixId: string) {
  const url = `${window.location.origin}/remix/${remixId}`
  await navigator.clipboard.writeText(url)
  toast.success("Link copied!")
}
```

---

## ❓ Common Issues

### "User is null" error
- Make sure user is logged in before saving
- Wrap in `if (user)` check

### "Video URL not found"
- Ensure video is uploaded to Supabase storage first
- Use the public URL from storage

### "Permission denied"
- Check RLS policies in Supabase
- Ensure user_id matches authenticated user

### Remix doesn't appear in public gallery
- Check that `is_public = true`
- Verify RLS policy allows public reads

---

## 📞 Need Help?

Check these files for reference:
- `lib/services/remixes.ts` - All remix functions
- `app/remixes/public/page.tsx` - Example of fetching public remixes
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `supabase/migrations/003_remix_functions.sql` - Helper functions

---

**Once integrated, your users can save and share their generated Vines! 🎉**

