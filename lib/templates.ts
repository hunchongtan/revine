export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  year: 2013 | 2014 | 2015 | 2016;
  defaultVoice: string;
  delivery: string;
  audioScript: string;
  videoPrompt: string;
  beatSheet: number[];
  captionPrompt: string;
}

export const templates: Template[] = [
  // 2013
  {
    id: "do_it_vine",
    name: "Do It For The Vine",
    description: "Tiny stunt celebration",
    thumbnail: "/backyard-stunt-celebration.jpg",
    year: 2013,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "narration",
    audioScript: "He ain't gonna do it… He did it. He did it for the Vine!",
    videoPrompt:
      'Recreate the Vine called "Do It For The Vine". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "triumphant one-liner ≤10 words + #VineEnergy",
  },
  {
    id: "ryan_cereal",
    name: "Won't Eat His Cereal",
    description: "Deadpan refusal",
    thumbnail: "/cereal-spoon-refusal.jpg",
    year: 2013,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "narration",
    audioScript: "He refuses the spoon… again.",
    videoPrompt:
      'Recreate the Vine called "Won\'t Eat His Cereal". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "funny breakfast moment ≤8 words",
  },
  {
    id: "duck_army",
    name: "Duck Army Scream",
    description: "Chaotic quack explosion",
    thumbnail: "/toy-ducks-screaming.jpg",
    year: 2013,
    defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Angry Kid (Clyde - Intense)
    delivery: "full_line",
    audioScript: "AAAHHH!",
    videoPrompt:
      'Recreate the Vine called "Duck Army Scream". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "chaotic energy ≤5 words",
  },
  // 2014
  {
    id: "mums_car",
    name: "I'm in me mum's car",
    description: "Vroom vroom energy",
    thumbnail: "/car-interior-steering.jpg",
    year: 2014,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "I'm in me mum's car. Vroom vroom.",
    videoPrompt:
      "Recreate the Vine called \"I'm in me mum's car\". Neutral, non-identifying, family-friendly.",
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "cheeky car moment ≤8 words",
  },
  {
    id: "look_chickens",
    name: "Look at all those chickens",
    description: "Arm sweep revelation",
    thumbnail: "/park-birds-arm-sweep.jpg",
    year: 2014,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "Look at all those chickens.",
    videoPrompt:
      'Recreate the Vine called "Look at all those chickens". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "nature observation ≤6 words",
  },
  {
    id: "hurricane_tortilla",
    name: "Hurricane Tortilla",
    description: "Kitchen pun flip",
    thumbnail: "/kitchen-tortilla-flip.jpg",
    year: 2014,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "Hurricane Katrina… more like Hurricane Tortilla",
    videoPrompt:
      'Recreate the Vine called "Hurricane Tortilla". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "food pun ≤8 words",
  },
  {
    id: "croissant_drop",
    name: "Stop! I could've dropped my croissant",
    description: "Hallway near-miss",
    thumbnail: "/hallway-croissant-drop.jpg",
    year: 2014,
    defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Angry Kid (Clyde - Intense)
    delivery: "full_line",
    audioScript: "Stop! I could've dropped my croissant!",
    videoPrompt:
      'Recreate the Vine called "Stop! I could\'ve dropped my croissant". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "dramatic food moment ≤8 words",
  },
  {
    id: "on_fleek",
    name: "Eyebrows on fleek",
    description: "Selfie confidence",
    thumbnail: "/selfie-eyebrows-pose.jpg",
    year: 2014,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "Eyebrows on fleek.",
    videoPrompt:
      'Recreate the Vine called "Eyebrows on fleek". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "beauty flex ≤4 words",
  },
  {
    id: "that_was_legitness",
    name: "That was legitness",
    description: "Trick celebration",
    thumbnail: "/skate-trick-reaction.jpg",
    year: 2014,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "That was legitness!",
    videoPrompt:
      'Recreate the Vine called "That was legitness". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "trick moment ≤4 words",
  },
  // 2015
  {
    id: "why_lying",
    name: "Why You Lying?",
    description: "Sassy confrontation",
    thumbnail: "/sassy-lip-sync-eyebrow-raise.jpg",
    year: 2015,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "Why you always lyin'… hmm? Why you always lyin'!",
    videoPrompt:
      'Recreate the Vine called "Why You Lying?". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1, 3.5, 5.5, 6],
    captionPrompt: "cheeky call-out + 1 short hashtag",
  },
  {
    id: "deez_nuts",
    name: "Deez Nuts, ha! got eem",
    description: "Phone prank triumph",
    thumbnail: "/phone-prank-reaction.jpg",
    year: 2015,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "Deez Nuts, ha! got eem!",
    videoPrompt:
      'Recreate the Vine called "Deez Nuts, ha! got eem". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "prank victory ≤6 words",
  },
  {
    id: "what_are_those",
    name: "What Are Those?",
    description: "Point and roast",
    thumbnail: "/shoes-pointing-dramatic-zoom.jpg",
    year: 2015,
    defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Angry Kid (Clyde - Intense)
    delivery: "full_line",
    audioScript: "WHAT ARE THOOOOOSE?!",
    videoPrompt:
      'Recreate the Vine called "What Are Those?". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3.2, 5, 6],
    captionPrompt: "1-line nostalgic roast + ≤2 short hashtags",
  },
  {
    id: "wednesday_dudes",
    name: "It's Wednesday, my dudes",
    description: "Bathroom goggles scream",
    thumbnail: "/bathroom-goggles-scream.jpg",
    year: 2015,
    defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Angry Kid (Clyde - Intense)
    delivery: "full_line",
    audioScript: "It's Wednesday, my dudes! AAAHHHHH!",
    videoPrompt:
      'Recreate the Vine called "It\'s Wednesday, my dudes". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "weekly announcement ≤5 words",
  },
  {
    id: "two_bros_hot_tub",
    name: "Two bros chillin' in a hot tub",
    description: "Relaxed shrug vibes",
    thumbnail: "/hot-tub-two-people.jpg",
    year: 2015,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "Two bros chillin' in a hot tub, 'cause they're not gay.",
    videoPrompt:
      'Recreate the Vine called "Two bros chillin\' in a hot tub". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "chill moment ≤8 words",
  },
  {
    id: "miss_keisha",
    name: "Miss Keisha?! She dead",
    description: "Overacted collapse",
    thumbnail: "/overacted-reaction-collapse.jpg",
    year: 2015,
    defaultVoice: "2EiwWnXFnvU5JabPnv8n", // Angry Kid (Clyde - Intense)
    delivery: "full_line",
    audioScript: "Miss Keisha?! She dead!",
    videoPrompt:
      'Recreate the Vine called "Miss Keisha?! She dead". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "shocked reaction ≤5 words",
  },
  {
    id: "so_no_head",
    name: "So, no head?",
    description: "Deadpan ask",
    thumbnail: "/deadpan-phone-smack.jpg",
    year: 2015,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "So, no head?",
    videoPrompt:
      'Recreate the Vine called "So, no head?". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "absurd question ≤4 words",
  },
  {
    id: "potato_flew",
    name: "A potato flew around my room",
    description: "Floating potato gag",
    thumbnail: "/floating-potato-airy.jpg",
    year: 2015,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "A potato flew around my room",
    videoPrompt:
      'Recreate the Vine called "A potato flew around my room". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "surreal moment ≤6 words",
  },
  {
    id: "iridocyclitis",
    name: "Iridocyclitis.",
    description: "Spelling bee zoom",
    thumbnail: "/spelling-bee-podium.jpg",
    year: 2015,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "Iridocyclitis.",
    videoPrompt:
      'Recreate the Vine called "Iridocyclitis." Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "word moment ≤2 words",
  },
  // 2016
  {
    id: "hi_chilis",
    name: "Hi, welcome to Chili's",
    description: "Doorway pose bow",
    thumbnail: "/placeholder.svg?height=192&width=256",
    year: 2016,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "Hi, welcome to Chili's!",
    videoPrompt:
      'Recreate the Vine called "Hi, welcome to Chili\'s". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "restaurant greeting ≤5 words",
  },
  {
    id: "road_work_ahead",
    name: "Road work ahead? Uh, yeah, I sure hope it does",
    description: "Sign reveal quip",
    thumbnail: "/placeholder.svg?height=192&width=256",
    year: 2016,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "Road work ahead? Uh, yeah, I sure hope it does.",
    videoPrompt:
      'Recreate the Vine called "Road work ahead? Uh, yeah, I sure hope it does". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "road sign joke ≤8 words",
  },
  {
    id: "lebron_james",
    name: "LeBROOOON JAAAAMES!",
    description: "Sports announcer energy",
    thumbnail: "/sports-announcer-excitement.jpg",
    year: 2016,
    defaultVoice: "IKne3meq5aSn9XLyUdCD", // Sports Announcer (Charlie - Hyped)
    delivery: "full_line",
    audioScript: "LeBROOOON JAAAAMES!",
    videoPrompt:
      'Recreate the Vine called "LeBROOOON JAAAAMES!". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1, 2.5, 3, 5, 6],
    captionPrompt: "playful sports meme ≤12 words + 1 hashtag",
  },
  {
    id: "free_shavocado",
    name: "Free shavacadoo",
    description: "Storefront sign misread",
    thumbnail: "/placeholder.svg?height=192&width=256",
    year: 2016,
    defaultVoice: "FGY2WhTYpPnrIDTdsKH5", // Sassy Drama (Laura - Sassy)
    delivery: "full_line",
    audioScript: "Free shavacadoo!",
    videoPrompt:
      'Recreate the Vine called "Free shavacadoo". Neutral, non-identifying, family-friendly.',
    beatSheet: [0, 1.5, 3, 5, 6],
    captionPrompt: "sign misread ≤4 words",
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getYears(): (2013 | 2014 | 2015 | 2016)[] {
  return [2013, 2014, 2015, 2016];
}
