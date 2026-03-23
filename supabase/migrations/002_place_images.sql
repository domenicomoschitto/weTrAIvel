-- Place Images — static curated image database
create table place_images (
  id           uuid default gen_random_uuid() primary key,
  name         text not null unique,   -- normalized key: 'rome', 'sicily', 'italy'
  display_name text not null,          -- 'Rome', 'Sicily', 'Italy'
  aliases      text[] default '{}',    -- ['roma', 'roma capitale']
  type         text not null,          -- 'city' | 'province' | 'region' | 'country'
  country_code char(2) not null,       -- 'IT', 'ES', 'FR' …
  region       text,                   -- 'sicily', 'tuscany' …
  image_url    text not null,          -- 800px wide, for heroes
  thumb_url    text not null,          -- 400x400 crop, for cards
  gradient     text default '#0f2027,#203a43,#2c5364', -- fallback gradient
  credit       text,
  credit_url   text,
  created_at   timestamptz default now()
);

-- Public read, no auth needed
alter table place_images enable row level security;
create policy "Public read place_images" on place_images
  for select using (true);

-- Fast lookups
create index place_images_name_idx on place_images (name);
create index place_images_country_idx on place_images (country_code);
create index place_images_region_idx on place_images (region);
