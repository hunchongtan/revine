# ReVine

**Relive the 6-Second Era.**

Create viral Vine-inspired videos in seconds with AI-powered generation. Turn yourself into classic Vine memes using cutting-edge AI technology.

🎬 **[Try out the demo here](https://revine-sigma.vercel.app/)**

## ✨ Features

### Core Functionality
- **23 Iconic Templates**: From "What Are Those?" to "LeBROOOON JAAAAMES!" — all the classic Vines from 2013-2016
- **9 Voice Personas**: Multiple voices across Angry Kid, Sassy Drama, and Sports Announcer personas powered by ElevenLabs
- **Smart Image Upload**: Drag-and-drop interface with instant preview
- **AI-Powered Generation**: 
  - Caption generation (OpenAI GPT-4o-mini)
  - Text-to-speech (ElevenLabs)
  - Video generation (Fal.ai)
  - FFmpeg muxing for final output
- **Download & Share**: Export MP4 videos and copy captions

### Video Sharing & Privacy
- **Shareable Links**: Every video gets a unique shareable link
- **Privacy Controls**: Toggle between private (link-only) and public (discoverable)
- **Two URL Structures**:
  - Private: `/v/t/{token}` - Unguessable 12-character token
  - Public: `/v/{slug}` - SEO-friendly slug based on caption
- **Native Share**: Share button with native mobile share API and clipboard fallback
- **Standalone Pages**: Full-screen video viewer pages with Open Graph metadata
- **Anonymous Support**: Create and share videos without signing in

### User Experience
- **Welcome Modal**: First-time visitors get a friendly introduction to the platform
- **Guest Mode**: Full access to all features without signing in
- **User Authentication**: Optional sign-in for enhanced features
- **Favourites System**: 
  - Save templates locally as a guest
  - Sync favourites across devices when signed in
- **Public Gallery**: Browse videos created by the community (coming soon)
- **Filter & Search**: Find templates by year (2013-2016) or search by name
- **Responsive Design**: Works beautifully on mobile and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- API keys (optional for development — mock data available)

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# AI Services (optional - app falls back to mock data)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
FAL_API_KEY=...

# Supabase (optional - enables authentication & database features)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App URL (required for video sharing)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: The app works without any API keys! It automatically falls back to mock data for development.

**Environment Variables:**
- `OPENAI_API_KEY` - For caption generation (optional)
- `ELEVENLABS_API_KEY` - For text-to-speech with 9 voices (optional)
- `FAL_API_KEY` - For video generation using Fal.ai (optional)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (optional)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (optional)
- `NEXT_PUBLIC_APP_URL` - Base URL for shareable links (required for sharing features)

### Supabase Setup (Optional)

For full authentication, database features, and video sharing:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/` in order:
   - `001_initial_schema.sql` - Creates tables, RLS policies, and storage buckets
   - `002_seed_templates.sql` - Seeds 23 classic Vine templates
   - `003_add_video_sharing.sql` - Adds video sharing and visibility features
   - `003_remix_functions.sql` - Adds helper functions
   - `004_add_view_counter_rpc.sql` - Adds view counter function
   - `005_allow_anonymous_videos.sql` - Allows anonymous video creation
   - `006_fix_generate_slug.sql` - Fixes slug generation for public videos
3. Add your Supabase credentials to `.env.local`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
revine/
├── app/
│   ├── page.tsx                 # Home page with template grid
│   ├── layout.tsx               # Root layout with header & auth provider
│   ├── generate/
│   │   └── page.tsx             # Video generation page
│   ├── favourites/
│   │   └── page.tsx             # User's saved templates
│   ├── discover/
│   │   └── page.tsx             # Public gallery (coming soon)
│   ├── remixes/
│   │   └── public/
│   │       └── page.tsx         # Public remixes page
│   ├── v/
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Public video viewer
│   │   └── t/
│   │       └── [token]/
│   │           └── page.tsx     # Private video viewer
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx         # OAuth/magic link callback handler
│   └── api/
│       ├── caption/             # OpenAI caption generation
│       ├── tts/                 # ElevenLabs text-to-speech
│       ├── video/               # Fal.ai video generation
│       ├── mux/                 # FFmpeg audio/video muxing
│       └── videos/              # Video CRUD & sharing
│           ├── create/          # Create video record
│           ├── [id]/            # Get video by ID
│           └── [id]/visibility/ # Update video visibility
├── components/
│   ├── welcome-modal.tsx        # First-visit welcome dialog
│   ├── auth-modal.tsx           # Sign in/up modal
│   ├── user-menu.tsx            # User dropdown menu
│   ├── template-card.tsx        # Template card with hover effects
│   ├── generate-panel.tsx       # Main generation interface
│   ├── result-player.tsx        # Video player with share controls
│   ├── video-viewer.tsx         # Standalone video page component
│   ├── upload-face.tsx          # Image upload with drag-drop
│   ├── voice-select.tsx         # Voice picker dropdown
│   ├── year-select.tsx          # Year filter dropdown
│   ├── search-templates.tsx     # Template search input
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── env.ts                   # Environment variable management
│   ├── providers/               # API provider architecture
│   │   ├── caption.ts           # OpenAI provider
│   │   ├── tts.ts               # ElevenLabs provider
│   │   ├── video.ts             # Fal.ai provider
│   │   └── mux.ts               # FFmpeg provider
│   ├── services/
│   │   └── templates.ts         # Template CRUD & favourites
│   ├── hooks/
│   │   └── use-auth.tsx         # Authentication context & hooks
│   ├── supabase-client.ts       # Browser Supabase client
│   ├── supabase-server.ts       # Server-side Supabase client
│   ├── video-sharing.ts         # Video sharing utilities
│   ├── templates.ts             # Template definitions (23 templates)
│   ├── template-adapter.ts      # DB/hardcoded compatibility layer
│   └── types.ts                 # TypeScript type definitions
├── config/
│   └── voices.ts                # Voice preset definitions (9 voices)
├── types/
│   └── database.ts              # Supabase database types
├── supabase/
│   └── migrations/              # Database migration scripts
└── public/
    ├── icon_header.svg          # ReVine logo for header
    └── mock/                    # Mock audio/video for development
```

## 🎯 API Routes

All API routes use a provider architecture with automatic mock fallbacks when API keys are missing.

### POST `/api/caption`
Generates a witty Vine-style caption using OpenAI GPT-4o-mini.

**Request:**
```json
{
  "templateId": "what_are_those",
  "imageUrl": "https://..."
}
```

**Response:**
```json
{
  "caption": "Your AI-generated caption here"
}
```

### POST `/api/tts`
Generates text-to-speech audio using ElevenLabs.

**Request:**
```json
{
  "text": "WHAT ARE THOOOOOSE?!",
  "voiceId": "2EiwWnXFnvU5JabPnv8n"
}
```

**Response:**
```json
{
  "audioUrl": "https://supabase.co/.../audio.mp3"
}
```

### POST `/api/video`
Generates video using Fal.ai with automatic polling until completion.

**Request:**
```json
{
  "prompt": "6s handheld POV; point to shoes...",
  "imageUrl": "https://..."
}
```

**Response:**
```json
{
  "videoUrl": "https://fal.ai/.../video.mp4"
}
```

### POST `/api/mux`
Muxes audio and video together using FFmpeg and uploads to Supabase.

**Request:**
```json
{
  "videoUrl": "https://...",
  "audioUrl": "https://..."
}
```

**Response:**
```json
{
  "videoUrl": "https://supabase.co/.../final.mp4"
}
```

### Video Sharing APIs

#### POST `/api/videos/create`
Creates a video record and generates shareable URL.

**Request:**
```json
{
  "templateId": "what_are_those",
  "videoUrl": "https://...",
  "caption": "WHAT ARE THOOOSE?!",
  "visibility": "private"
}
```

**Response:**
```json
{
  "video": { ... },
  "shareUrl": "https://yourdomain.com/v/t/{token}"
}
```

#### PATCH `/api/videos/{id}/visibility`
Updates video visibility (private ↔ public).

**Request:**
```json
{
  "visibility": "public"
}
```

**Response:**
```json
{
  "video": { ... },
  "shareUrl": "https://yourdomain.com/v/{slug}"
}
```

#### GET `/api/videos/{id}`
Fetches a single video by ID.

## 🎨 Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4.1.9** - Styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library

### Backend & Services
- **Supabase** - Authentication, database, and storage
- **OpenAI GPT-4o-mini** - Caption generation
- **ElevenLabs** - Text-to-speech
- **Fal.ai** - AI video generation
- **FFmpeg** - Audio/video processing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Sharp** - Image optimization

## 🎨 Design System

### Color Palette
- **Primary**: Vine Teal (`#00bf8f`)
- **Background**: Light Gray (`#f3f3f3`)
- **Borders**: Neutral Gray (`#e6e6e6`)
- **Text**: Dark Gray (`#333333`)
- **Secondary Text**: Medium Gray (`#8a8a8a`)

### Typography
- **Font Family**: Helvetica Neue, Helvetica, Arial, sans-serif (classic Vine aesthetic)
- **Modern Components**: Using system fonts via shadcn/ui

### Layout Principles
- **Mobile-First**: Responsive grid (1 column → 2 → 3)
- **Clean & Minimal**: White cards on gray background
- **Vine-Inspired**: Retro aesthetic with modern UX

### Animations
- **Hover Effects**: Subtle scale and shadow on template cards
- **Loading States**: Smooth spinner overlays
- **Transitions**: Fast, snappy interactions

## 🛠️ Customization

### Adding New Templates

Edit `lib/templates.ts`:

```typescript
{
  id: "your_template_id",
  name: "Your Template Name",
  description: "Short description",
  thumbnail: "/path/to/thumbnail.jpg",
  year: 2015,
  delivery: "full_line",
  audioScript: "Your audio script here",
  videoPrompt: "Detailed video generation prompt",
  beatSheet: [0, 1.5, 3.2, 5, 6],
  captionPrompt: "Instructions for caption AI",
}
```

**Beat Sheet**: Array of timestamps (in seconds) for key moments in the 6-second video.

### Adding New Voices

Edit `config/voices.ts`:

```typescript
{
  id: "elevenlabs_voice_id",
  label: "Voice Name (Characteristic)"
}
```

Voice IDs must be valid ElevenLabs voice IDs from your account. The app currently includes:
- **Angry Kid**: Clyde (Intense), Harry (Rough), Liam (Confident)
- **Sassy Drama**: Laura (Sassy), Matilda (Upbeat), Jessica (Cute)
- **Sports Announcer**: Charlie (Hyped), Liam (Confident), Lily (Confident)

## 🏗️ Architecture

### Provider Pattern
All external APIs are abstracted behind provider modules (`lib/providers/`). Each provider:
- Checks for API keys
- Falls back to mock data if keys are missing
- Returns consistent response formats
- Handles errors gracefully

### Authentication Flow
```
Guest → Browse/Generate (localStorage favourites)
     ↓ (Sign In)
User → Synced favourites + Profile + Future features
```

### Video Sharing Flow
```
Video Generated → Auto-create record (private by default)
                       ↓
                  Toggle visibility?
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
    Private Link                Public Link
    /v/t/{token}                /v/{slug}
    (unguessable)               (SEO-friendly)
```

### Mock Fallbacks
When API keys are missing, the app:
- Uses mock captions ("What are those?!")
- Serves pre-recorded audio from `/public/mock/audio.wav`
- Serves sample video from `/public/mock/video.mp4`
- Still provides full user experience for development

### Storage Strategy
- **Templates**: Supabase Storage (`templates` bucket) or local `/public/`
- **Generated Audio**: Uploaded to Supabase (`renders` bucket)
- **Final Videos**: Supabase or external CDN
- **Favourites**: localStorage (guests) or Supabase database (users)

## 🔒 Security

### Row Level Security (RLS)
All Supabase tables have RLS policies:
- Users can only view/edit their own profile
- Users can only manage their own favourites
- Users can only update their own videos (or anonymous videos)
- All users can view templates (public)
- All users can view public videos
- Private videos require share token or ownership

### Environment Variables
- API keys are server-side only
- Client-side code uses public Supabase anon key (safe)
- Service role key is never exposed to the client

### Video Sharing Security
- Share tokens are cryptographically random (9 bytes → 12 chars base64)
- RLS policies enforce ownership verification
- Anonymous users can create videos but not modify others'
- Public videos are intentionally discoverable

## 📊 Database Schema

### Tables
- **profiles**: User profiles (created automatically on signup)
- **templates**: 23 Vine templates with all metadata
- **favourites**: Many-to-many relationship (users ↔ templates)
- **remixes**: User-generated videos with metadata and sharing info

### Storage Buckets
- **templates**: Public bucket for template thumbnails
- **renders**: Public bucket for generated audio/video files

### Video Sharing Columns (remixes table)
- `visibility`: 'private' | 'public' (default: 'private')
- `share_token`: Unique 12-char token (auto-generated)
- `slug`: URL-friendly slug for public videos (auto-generated)
- `user_id`: Owner ID (nullable for anonymous)
- `views_count`: View counter

See `supabase/migrations/` for complete schema definitions.

## 🧪 Development Tips

### Working Without API Keys
The app is designed to work fully without any API keys! Just run:
```bash
npm run dev
```

Mock data will be used automatically.

### Testing Authentication
1. Set up Supabase (see Supabase Setup section)
2. Sign up with a test email
3. Check Supabase dashboard → Authentication → Users

### Debugging Video Generation
- Check browser console for detailed logs
- Mock video plays immediately (no API delay)
- Real video generation takes 3-5 minutes (Fal.ai processing)

### Testing Video Sharing
1. Generate a video
2. Click "Share This Vine" to test sharing
3. Toggle visibility between Private and Public
4. Visit the shareable URL in a new tab
5. Test as guest (logged out) to verify access controls

## 🚧 Roadmap

### Current State
- ✅ 23 classic Vine templates
- ✅ AI-powered video generation
- ✅ User authentication
- ✅ Favourites system with sync
- ✅ Welcome modal for new users
- ✅ Year filtering and search
- ✅ Download videos
- ✅ Video sharing with privacy controls
- ✅ Standalone video viewer pages
- ✅ Native share API integration
- ✅ Anonymous video creation
- ✅ Public remixes gallery with discovery

### Coming Soon
- 🔄 User profile pages
- 🔄 Video history/library
- 🔄 Video deletion functionality
- 🔄 View counter display
- 🔄 More templates (2017+ memes)
- 🔄 Custom template creation


## 📄 License

MIT

## 🙏 Credits

Vibe coded with:
- [Cursor](https://cursor.com/)
- [ChatGPT](https://chatgpt.com/)
- [Claude](https://claude.ai/)
- [v0](https://v0.dev/)
- [Manus AI](https://manus.app/)

Built with:
- [Next.js 15](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [Fal.ai](https://fal.ai/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with 💚 for Vine nostalgia.
An undertaking of Singapore's biggest hackathon [Cursor Hackathon 2025](https://luma.com/cursor-hack-sg).
