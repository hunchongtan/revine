-- Update template thumbnails to match actual filenames
-- Run this in Supabase SQL Editor

UPDATE templates SET thumbnail_url = 'templates/do it for the vine.jpg' WHERE id = 'do_it_vine';
UPDATE templates SET thumbnail_url = 'templates/ownt eat his cereal.jpg' WHERE id = 'ryan_cereal';
UPDATE templates SET thumbnail_url = 'templates/duck army scream.jpg' WHERE id = 'duck_army';
UPDATE templates SET thumbnail_url = 'templates/im in me mums car.jpg' WHERE id = 'mums_car';
UPDATE templates SET thumbnail_url = 'templates/look at all those chickens.jpg' WHERE id = 'look_chickens';
UPDATE templates SET thumbnail_url = 'templates/hurricane tortilla.jpg' WHERE id = 'hurricane_tortilla';
UPDATE templates SET thumbnail_url = 'templates/stop i couldve dropped my croissant.jpg' WHERE id = 'croissant_drop';
UPDATE templates SET thumbnail_url = 'templates/eyebrows on fleek.jpg' WHERE id = 'on_fleek';
UPDATE templates SET thumbnail_url = 'templates/that was legitness.jpg' WHERE id = 'that_was_legitness';
UPDATE templates SET thumbnail_url = 'templates/why you lying.avif' WHERE id = 'why_lying';
UPDATE templates SET thumbnail_url = 'templates/deez nuts ha got eem.webp' WHERE id = 'deez_nuts';
UPDATE templates SET thumbnail_url = 'templates/what are those.png' WHERE id = 'what_are_those';
UPDATE templates SET thumbnail_url = 'templates/its wednesday my dudes.jpg' WHERE id = 'wednesday_dudes';
UPDATE templates SET thumbnail_url = 'templates/two bros chillin in a hot tub.jpg' WHERE id = 'two_bros_hot_tub';
UPDATE templates SET thumbnail_url = 'templates/miss keisha she dead.jpg' WHERE id = 'miss_keisha';
UPDATE templates SET thumbnail_url = 'templates/so no head.jpg' WHERE id = 'so_no_head';
UPDATE templates SET thumbnail_url = 'templates/a potato flew around my room.jpg' WHERE id = 'potato_flew';
UPDATE templates SET thumbnail_url = 'templates/iridocyclitis.jpg' WHERE id = 'iridocyclitis';
UPDATE templates SET thumbnail_url = 'templates/hi welcome to chili.jpg' WHERE id = 'hi_chilis';
UPDATE templates SET thumbnail_url = 'templates/road work ahead uh year i sure hope it does.jpg' WHERE id = 'road_work_ahead';
UPDATE templates SET thumbnail_url = 'templates/lebron james.jpg' WHERE id = 'lebron_james';
UPDATE templates SET thumbnail_url = 'templates/free shavacadoo.jpg' WHERE id = 'free_shavocado';

-- Verify the update
SELECT id, title, thumbnail_url FROM templates ORDER BY year, id;



