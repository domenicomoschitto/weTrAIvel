# Travel Vault — Setup

## 1. Supabase Project

Create a new project at supabase.com, then run this SQL in the SQL editor:

```sql
-- Trips
create table trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);
alter table trips enable row level security;
create policy "Users manage own trips" on trips
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Stops
create table stops (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  location text,
  start_date date,
  end_date date,
  order_index integer default 0,
  created_at timestamptz default now()
);
alter table stops enable row level security;
create policy "Users manage stops of own trips" on stops
  using (exists (select 1 from trips where trips.id = stops.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = stops.trip_id and trips.user_id = auth.uid()));

-- Vault items
create table vault_items (
  id uuid default gen_random_uuid() primary key,
  stop_id uuid references stops(id) on delete cascade,
  category text not null,
  type text not null,
  title text not null,
  content text,
  file_url text,
  metadata jsonb,
  created_at timestamptz default now()
);
alter table vault_items enable row level security;
create policy "Users manage vault items of own stops" on vault_items
  using (exists (
    select 1 from stops
    join trips on trips.id = stops.trip_id
    where stops.id = vault_items.stop_id
    and trips.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from stops
    join trips on trips.id = stops.trip_id
    where stops.id = vault_items.stop_id
    and trips.user_id = auth.uid()
  ));
```

## 2. Supabase Storage

In the Supabase dashboard → Storage → New bucket:
- Name: `vault-files`
- Public: yes

Add this storage policy:
```sql
create policy "Authenticated users can upload vault files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vault-files');

create policy "Public can view vault files"
  on storage.objects for select
  using (bucket_id = 'vault-files');
```

## 3. Environment Variables

```bash
cp .env.example .env
```

Fill in your Supabase URL and anon key from: Project Settings → API

## 4. AI Assistant (Edge Function)

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy ai-chat
```

## 5. Run locally

```bash
npm install
npm run dev
```
