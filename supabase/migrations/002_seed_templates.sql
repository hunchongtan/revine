-- =====================================================
-- Seed Templates Data
-- =====================================================

INSERT INTO templates (
  id, title, year, category, thumbnail_url, audio_script, video_prompt, 
  beat_sheet, default_voice_id, persona
) VALUES 
  -- 2013
  (
    'do_it_vine',
    'Do It For The Vine',
    2013,
    'celebration',
    'templates/backyard-stunt-celebration.jpg',
    'He ain't gonna do it… He did it. He did it for the Vine!',
    '6s backyard; hesitate→cut→tiny stunt→celebrate.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'ryan_cereal',
    'Won''t Eat His Cereal',
    2013,
    'comedy',
    'templates/cereal-spoon-refusal.jpg',
    'He refuses the spoon… again.',
    '6s close-up spoon vs face, comedic refusal, quick cuts.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'duck_army',
    'Duck Army Scream',
    2013,
    'chaos',
    'templates/toy-ducks-screaming.jpg',
    'AAAHHH!',
    '6s toy ducks squeeze → explosion of quacks, chaotic handheld.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    '2EiwWnXFnvU5JabPnv8n',
    'Angry Kid'
  ),
  
  -- 2014
  (
    'mums_car',
    'I''m in me mum''s car',
    2014,
    'sassy',
    'templates/car-interior-steering.jpg',
    'I''m in me mum''s car. Vroom vroom.',
    '6s car interior, forward lean, tiny steering motions.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'look_chickens',
    'Look at all those chickens',
    2014,
    'observation',
    'templates/park-birds-arm-sweep.jpg',
    'Look at all those chickens.',
    '6s park shot, arm sweep to birds, slight zoom.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'hurricane_tortilla',
    'Hurricane Tortilla',
    2014,
    'pun',
    'templates/kitchen-tortilla-flip.jpg',
    'Hurricane Katrina… more like Hurricane Tortilla',
    '6s kitchen flip with tortilla, pun on cut.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'croissant_drop',
    'Stop! I could''ve dropped my croissant',
    2014,
    'drama',
    'templates/hallway-croissant-drop.jpg',
    'Stop! I could''ve dropped my croissant!',
    '6s hallway, near-drop, startled yelp, quick tilt.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    '2EiwWnXFnvU5JabPnv8n',
    'Angry Kid'
  ),
  (
    'on_fleek',
    'Eyebrows on fleek',
    2014,
    'beauty',
    'templates/selfie-eyebrows-pose.jpg',
    'Eyebrows on fleek.',
    '6s selfie cam, brow pose, sparkle overlay.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'that_was_legitness',
    'That was legitness',
    2014,
    'celebration',
    'templates/skate-trick-reaction.jpg',
    'That was legitness!',
    '6s skate/scooter mini trick → reaction cut.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  
  -- 2015
  (
    'why_lying',
    'Why You Lying?',
    2015,
    'sassy',
    'templates/sassy-lip-sync-eyebrow-raise.jpg',
    'Why you always lyin''… hmm? Why you always lyin''!',
    '6s outdoor; sassy lip-sync; dolly; eyebrow raise.',
    '[0, 1, 3.5, 5.5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'deez_nuts',
    'Deez Nuts, ha! got eem',
    2015,
    'prank',
    'templates/phone-prank-reaction.jpg',
    'Deez Nuts, ha! got eem!',
    '6s phone prank vibe, triumphant zoom on punchline.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'what_are_those',
    'What Are Those?',
    2015,
    'roast',
    'templates/shoes-pointing-dramatic-zoom.jpg',
    'WHAT ARE THOOOOOSE?!',
    '6s handheld POV; point to shoes; dramatic zoom; 2015 phone grain.',
    '[0, 1.5, 3.2, 5, 6]'::jsonb,
    '2EiwWnXFnvU5JabPnv8n',
    'Angry Kid'
  ),
  (
    'wednesday_dudes',
    'It''s Wednesday, my dudes',
    2015,
    'announcement',
    'templates/bathroom-goggles-scream.jpg',
    'It''s Wednesday, my dudes! AAAHHHHH!',
    '6s bathroom selfie, goggles, scream hold.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    '2EiwWnXFnvU5JabPnv8n',
    'Angry Kid'
  ),
  (
    'two_bros_hot_tub',
    'Two bros chillin'' in a hot tub',
    2015,
    'chill',
    'templates/hot-tub-two-people.jpg',
    'Two bros chillin'' in a hot tub, ''cause they''re not gay.',
    '6s wide shot, two seats apart, relaxed shrug.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'miss_keisha',
    'Miss Keisha?! She dead',
    2015,
    'drama',
    'templates/overacted-reaction-collapse.jpg',
    'Miss Keisha?! She dead!',
    '6s overacted shake + comedic collapse reaction.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    '2EiwWnXFnvU5JabPnv8n',
    'Angry Kid'
  ),
  (
    'so_no_head',
    'So, no head?',
    2015,
    'comedy',
    'templates/deadpan-phone-smack.jpg',
    'So, no head?',
    '6s deadpan ask → instant smash cut (phone smack implied).',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'potato_flew',
    'A potato flew around my room',
    2015,
    'surreal',
    'templates/floating-potato-airy.jpg',
    'A potato flew around my room',
    '6s slow pan, floating potato gag, airy vibe.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'iridocyclitis',
    'Iridocyclitis.',
    2015,
    'spelling',
    'templates/spelling-bee-podium.jpg',
    'Iridocyclitis.',
    '6s spelling-bee podium style, zoom on mouth.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  
  -- 2016
  (
    'hi_chilis',
    'Hi, welcome to Chili''s',
    2016,
    'greeting',
    'templates/placeholder.jpg',
    'Hi, welcome to Chili''s!',
    '6s doorway pose, quick bow, jump cut to grin.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'road_work_ahead',
    'Road work ahead? Uh, yeah, I sure hope it does',
    2016,
    'observation',
    'templates/placeholder.jpg',
    'Road work ahead? Uh, yeah, I sure hope it does.',
    '6s car POV, sign reveal → quip, slight shake.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  ),
  (
    'lebron_james',
    'LeBROOOON JAAAAMES!',
    2016,
    'sports',
    'templates/sports-announcer-excitement.jpg',
    'LeBROOOON JAAAAMES!',
    '6s living room; whip-pan; zoom on shout; VHS edge.',
    '[0, 1, 2.5, 3, 5, 6]'::jsonb,
    'IKne3meq5aSn9XLyUdCD',
    'Sports Announcer'
  ),
  (
    'free_shavocado',
    'Free shavacadoo',
    2016,
    'misread',
    'templates/placeholder.jpg',
    'Free shavacadoo!',
    '6s storefront sign misread, tight zoom on letters.',
    '[0, 1.5, 3, 5, 6]'::jsonb,
    'FGY2WhTYpPnrIDTdsKH5',
    'Sassy Drama'
  )
ON CONFLICT (id) DO NOTHING;

