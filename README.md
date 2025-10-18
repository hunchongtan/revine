# Vine Rewind# Vine Rewind



Create viral Vine-inspired videos in seconds with AI-powered generation.Create viral Vine-inspired videos in seconds with AI-powered generation.



## Features## Features



- **4 Iconic Templates**: What Are Those?, LeBROOOON!, Why You Lying?, Do It For The Vine- **4 Iconic Templates**: What Are Those?, LeBROOOON!, Why You Lying?, Do It For The Vine

- **Voice Presets**: Angry Kid, Sassy Drama, Sports Announcer- **Voice Presets**: Angry Kid, Sassy Drama, Sports Announcer

- **Image Upload**: Drag-and-drop interface with preview- **Image Upload**: Drag-and-drop interface with preview

- **AI Generation**: Automatic caption, TTS, video, and audio muxing- **AI Generation**: Automatic caption, TTS, video, and audio muxing

- **Download & Share**: Export MP4 and copy captions- **Download & Share**: Export MP4 and copy captions



## Getting Started## Getting Started



### Installation### Installation



```bash\`\`\`bash

npm installnpm install

# orMIT

yarn install```

# or\`\`\`

pnpm install

```Required keys:

- `OPENAI_API_KEY` - For caption generation

### Environment Setup- `ELEVENLABS_API_KEY` - For text-to-speech

- `FAL_API_KEY` - For video generation

Copy `.env.local.example` to `.env.local` and add your API keys:

### Development

```bash

cp .env.local.example .env.local\`\`\`bash

```npm run dev

\`\`\`

Required keys:

- `OPENAI_API_KEY` - For caption generationOpen [http://localhost:3000](http://localhost:3000) in your browser.

- `ELEVENLABS_API_KEY` - For text-to-speech

- `FAL_API_KEY` - For video generation## Project Structure



### Development\`\`\`

vine-rewind/

```bash├── app/

npm run dev│   ├── page.tsx              # Home page with template grid

```│   ├── generate/

│   │   └── page.tsx          # Generate page

Open [http://localhost:3000](http://localhost:3000) in your browser.│   ├── api/

│   │   ├── caption/          # Caption generation

## Project Structure│   │   ├── tts/              # Text-to-speech

│   │   ├── video/            # Video generation

```│   │   └── mux/              # Audio/video muxing

vine-rewind/│   └── globals.css           # Global styles with Vine-green theme

├── app/├── components/

│   ├── page.tsx              # Home page with template grid│   ├── template-card.tsx     # Template card component

│   ├── generate/│   ├── upload-face.tsx       # Image upload with drag-drop

│   │   └── page.tsx          # Generate page│   ├── voice-select.tsx      # Voice preset selector

│   ├── api/│   ├── generate-panel.tsx    # Main generation panel

│   │   ├── caption/          # Caption generation│   ├── result-player.tsx     # Video result player

│   │   ├── tts/              # Text-to-speech│   └── spinner-overlay.tsx   # Loading spinner overlay

│   │   ├── video/            # Video generation├── lib/

│   │   └── mux/              # Audio/video muxing│   ├── templates.ts          # Template definitions

│   └── globals.css           # Global styles with Vine-green theme│   └── types.ts              # TypeScript types

├── components/├── config/

│   ├── template-card.tsx     # Template card component│   └── voices.ts             # Voice preset definitions

│   ├── upload-face.tsx       # Image upload with drag-drop└── public/                   # Static assets

│   ├── voice-select.tsx      # Voice preset selector\`\`\`

│   ├── generate-panel.tsx    # Main generation panel

│   ├── result-player.tsx     # Video result player## API Routes

│   └── spinner-overlay.tsx   # Loading spinner overlay

├── lib/All routes are currently mocked. Replace with real implementations:

│   ├── templates.ts          # Template definitions

│   └── types.ts              # TypeScript types### POST /api/caption

├── config/Generates a witty caption for the template.

│   └── voices.ts             # Voice preset definitions- **TODO**: Integrate OpenAI API

└── public/                   # Static assets

```### POST /api/tts

Generates text-to-speech audio.

## API Routes- **TODO**: Integrate ElevenLabs API



All routes are currently mocked. Replace with real implementations:### POST /api/video

Generates video from template and image.

### POST /api/caption- **TODO**: Integrate fal.ai API

Generates a witty caption for the template.

- **TODO**: Integrate OpenAI API### POST /api/mux

Muxes audio and video together.

### POST /api/tts- **TODO**: Integrate ffmpeg or serverless job

Generates text-to-speech audio.

- **TODO**: Integrate ElevenLabs API## Customization



### POST /api/video### Adding New Templates

Generates video from template and image.

- **TODO**: Integrate fal.ai APIEdit `lib/templates.ts`:



### POST /api/mux\`\`\`typescript

Muxes audio and video together.{

- **TODO**: Integrate ffmpeg or serverless job  id: "your_template_id",

  name: "Your Template Name",

## Customization  description: "Short description",

  thumbnail: "/path/to/thumbnail.jpg",

### Adding New Templates  defaultVoice: "angry_kid",

  delivery: "full_line",

Edit `lib/templates.ts`:  audioScript: "Your audio script here",

  videoPrompt: "Your video generation prompt",

```typescript  beatSheet: [0, 1.5, 3.2, 5, 6],

{  captionPrompt: "Your caption generation prompt",

  id: "your_template_id",}

  name: "Your Template Name",\`\`\`

  description: "Short description",

  thumbnail: "/path/to/thumbnail.jpg",### Adding New Voices

  defaultVoice: "angry_kid",

  delivery: "full_line",Edit `config/voices.ts`:

  audioScript: "Your audio script here",

  videoPrompt: "Your video generation prompt",\`\`\`typescript

  beatSheet: [0, 1.5, 3.2, 5, 6],{ id: "your_voice_id", label: "Your Voice Label" }

  captionPrompt: "Your caption generation prompt",\`\`\`

}

```## Design



### Adding New Voices- **Color Scheme**: Vine-green (#22c55e) with clean white and gray neutrals

- **Typography**: Geist font family for modern, playful feel

Edit `config/voices.ts`:- **Layout**: Mobile-first responsive design

- **Components**: Built with shadcn/ui for consistency

```typescript

{ id: "your_voice_id", label: "Your Voice Label" }## Next Steps

```

1. Replace mock API routes with real integrations

## Design2. Add user authentication (optional)

3. Implement video storage and CDN

- **Color Scheme**: Vine-green (#22c55e) with clean white and gray neutrals4. Add analytics and tracking

- **Typography**: Geist font family for modern, playful feel5. Deploy to Vercel

- **Layout**: Mobile-first responsive design

- **Components**: Built with shadcn/ui for consistency## License



## Next StepsMIT

\`\`\`

1. Replace mock API routes with real integrations

2. Add user authentication (optional)

3. Implement video storage and CDN

4. Add analytics and tracking<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwNzY3NzkxOTA4LCJmaW5pc2hlZEF0IjoxNzYwNzY3NzkxOTA4LCJpZCI6IlVlUnljbUZLbmdTZDhhTmYiLCJsYXN0UGFydFNlbnRBdCI6MTc2MDc2Nzc5MTkwOCwicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />

5. Deploy to Vercel



## License

<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6IkpCNlJiMGl0ZURhemNKclYiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgVmluZSBSZXdpbmQiLCJ0b29sQ2FsbElkIjoidG9vbHVfMDEyN25LVUM3Q2FGcGZxTDl5azN3dmllIiwidGFza05hbWVDb21wbGV0ZSI6IkNvbXBsZXRlZCBWaW5lIFJld2luZCIsImNyZWF0ZWRBdCI6MTc2MDc2Nzc5MjM5NiwiZmluaXNoZWRBdCI6bnVsbCwicGFydHMiOltdLCJsYXN0UGFydFNlbnRBdCI6bnVsbH0=" />

MIT
