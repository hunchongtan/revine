export interface Voice {
  id: string
  label: string
}

export const voices: Voice[] = [
  { id: "angry_kid", label: "Angry Kid" },
  { id: "sassy_drama", label: "Sassy Drama" },
  { id: "sports_announcer", label: "Sports Announcer" },
]

export function getVoice(id: string): Voice | undefined {
  return voices.find((v) => v.id === id)
}
