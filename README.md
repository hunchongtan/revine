# Vine Rewind

Create viral Vine-inspired videos in seconds with AI-powered generation.

## Features

- **20+ Iconic Templates**: What Are Those?, LeBROOOON JAAAAMES!, Why You Lying?, and more classic Vines
- **9 Voice Options**: Multiple voices across Angry Kid, Sassy Drama, and Sports Announcer personas
- **Image Upload**: Drag-and-drop interface with preview
- **AI Generation**: Automatic caption (OpenAI), TTS (ElevenLabs), video (Fal.ai Sora-2), and FFmpeg muxing
- **Download & Share**: Export MP4 and copy captions

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and add your API keys:

```bash
cp .env.local.example .env.local
```

Required keys:
- `OPENAI_API_KEY` - For caption generation
- `ELEVENLABS_API_KEY` - For text-to-speech (9 voices configured)
- `FAL_API_KEY` - For video generation (Sora-2 model)
- `SUPABASE_URL` - For storage
- `SUPABASE_ANON_KEY` - For client-side storage access
- `SUPABASE_SERVICE_ROLE_KEY` - For server-side storage uploads

### Supabase Setup

Run `supabase-setup.sql` in your Supabase SQL Editor to create the `renders` bucket with proper policies.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
revine/
├── app/
│   ├── page.tsx              # Home page with template grid
│   ├── generate/
│   │   └── page.tsx          # Generate page
│   ├── api/
│   │   ├── caption/          # OpenAI caption generation
│   │   ├── tts/              # ElevenLabs text-to-speech
│   │   ├── video/            # Fal.ai Sora-2 video generation
│   │   └── mux/              # FFmpeg audio/video muxing
│   └── globals.css           # Global styles with Vine-green theme
├── components/
│   ├── template-card.tsx     # Template card component
│   ├── upload-face.tsx       # Image upload with drag-drop
│   ├── voice-select.tsx      # Voice selector (9 options)
│   ├── generate-panel.tsx    # Main generation panel
│   ├── result-player.tsx     # Video result player
│   └── spinner-overlay.tsx   # Loading spinner overlay
├── lib/
│   ├── env.ts                # Centralized environment management
│   ├── providers/            # API provider architecture
│   │   ├── caption.ts        # OpenAI provider
│   │   ├── tts.ts            # ElevenLabs provider
│   │   ├── video.ts          # Fal.ai provider
│   │   └── mux.ts            # FFmpeg provider
│   ├── supabase-client.ts    # Browser client (anon key)
│   ├── supabase-server.ts    # Server client (service role)
│   ├── templates.ts          # Template definitions (23 templates)
│   └── types.ts              # TypeScript types
├── config/
│   └── voices.ts             # Voice preset definitions (9 voices)
└── public/
    └── mock/                 # Mock fallback files
```

## API Routes

All routes use provider architecture with automatic mock fallbacks.

### POST /api/caption
Generates a witty Vine-style caption using OpenAI.

**Status:** ✅ Implemented (GPT-4o-mini)

### POST /api/tts
Generates text-to-speech audio using ElevenLabs.

**Status:** ✅ Implemented (9 voices: Clyde, Harry, Liam, Laura, Matilda, Jessica, Charlie, Lily)

### POST /api/video
Generates video from template and face image using Fal.ai Sora-2.

**Status:** ✅ Implemented (with 5-minute polling)

### POST /api/mux
Muxes audio and video together using server-side FFmpeg.

**Status:** ✅ Implemented (@ffmpeg/ffmpeg with Supabase upload)

## Customization

### Adding New Templates

Edit `lib/templates.ts`:

```typescript
{
  id: "your_template_id",
  name: "Your Template Name",
  description: "Short description",
  thumbnail: "/path/to/thumbnail.jpg",
  year: 2015,
  defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Clyde voice ID
  delivery: "full_line",
  audioScript: "Your audio script here",
  videoPrompt: "Your video generation prompt",
  beatSheet: [0, 1.5, 3.2, 5, 6],
  captionPrompt: "Your caption generation prompt",
}
```

### Adding New Voices

Edit `config/voices.ts`:

```typescript
{ id: "elevenlabs_voice_id", label: "Voice Name (Characteristic)" }
```

All voice IDs must be valid ElevenLabs voice IDs from your account.

## Design

- **Color Scheme**: Vine-green (#00B488) with clean white and gray neutrals
- **Typography**: Geist font family for modern, playful feel
- **Layout**: Mobile-first responsive design
- **Components**: Built with shadcn/ui for consistency
- **Animations**: Jitter and shadow-pulse effects on hover

## Architecture

- **Provider Pattern**: All external APIs abstracted behind providers
- **Mock Fallbacks**: Automatic fallback to mock data when API keys missing
- **No Authentication**: Simple, frictionless user experience
- **Server-side Processing**: All AI/muxing happens server-side
- **Storage**: Supabase for audio/video storage with public URLs

## License

MIT
