"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { voices } from "@/config/voices"

interface VoiceSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function VoiceSelect({ value, onValueChange }: VoiceSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Voice Preset</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
