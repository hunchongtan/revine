export interface Voice {
  id: string;
  label: string;
}

// Real ElevenLabs voice IDs - verified against your account
// Multiple options per persona for variety
export const voices: Voice[] = [
  // ANGRY KID voices (intense, rough, dramatic)
  { id: "2EiwWnXFnvU5JabPnv8n", label: "Angry Kid (Clyde - Intense)" },
  { id: "SOYHLrjzK2X1ezoPC6cr", label: "Angry Kid (Harry - Rough)" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Angry Kid (Liam - Confident)" },

  // SASSY DRAMA voices (sassy, expressive, cute)
  { id: "FGY2WhTYpPnrIDTdsKH5", label: "Sassy Drama (Laura - Sassy)" },
  { id: "XrExE9yKIg1WjnnlVkGX", label: "Sassy Drama (Matilda - Upbeat)" },
  { id: "cgSgspJ2msm6clMCkdW9", label: "Sassy Drama (Jessica - Cute)" },

  // SPORTS ANNOUNCER voices (hyped, confident, energetic)
  { id: "IKne3meq5aSn9XLyUdCD", label: "Sports Announcer (Charlie - Hyped)" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Sports Announcer (Liam - Confident)" },
  { id: "pFZP5JQG7iQjIQuC4Bku", label: "Sports Announcer (Lily - Confident)" },
];

export function getVoice(id: string): Voice | undefined {
  return voices.find((v) => v.id === id);
}
