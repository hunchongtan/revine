# Mock Files for ReVine

These files are placeholders used when API keys are not configured.

## Files

- `audio.wav` - Mock audio file (silent 6-second audio)
- `video.mp4` - Mock video file (simple test pattern)

## Usage

When ReVine providers fall back to mock behavior (due to missing API keys), they return URLs pointing to these files:
- `/mock/audio.wav` - Used by TTS provider when ElevenLabs key is missing
- `/mock/video.mp4` - Used by Video provider when Fal.ai key is missing

## Creating Real Mock Files

To create actual media files instead of placeholders, use FFmpeg:

```bash
# Create 6-second silent audio
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 6 -q:a 9 -acodec libmp3lame public/mock/audio.wav

# Create 6-second test pattern video (720x1280 vertical for mobile)
ffmpeg -f lavfi -i testsrc=duration=6:size=720x1280:rate=24 -pix_fmt yuv420p public/mock/video.mp4
```

For development, these placeholder text files work fine since they'll indicate clearly when mock mode is active.

