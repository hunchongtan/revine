export interface GenerateRequest {
  templateId: string
  imageUrl: string
  voice: string
}

export interface CaptionResponse {
  caption: string
}

export interface TTSResponse {
  audioUrl: string
}

export interface VideoResponse {
  videoUrl: string
}

export interface MuxResponse {
  finalUrl: string
}
