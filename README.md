# Matchbokning.se

Första deploybara demo för Matchbokning.se: en svensk marknadsplats för träningsmatcher i fotboll.

## Kom igång

```bash
npm install
npm run dev
```

Öppna sedan `http://localhost:3000`.

## Supabase

Första databasförslaget finns i:

- `supabase/schema.sql` - tabeller, typer, vyer och Row Level Security
- `supabase/seed.sql` - enkel testdata för demomatcher
- `supabase/grants.sql` - API-rättigheter för anon/authenticated
- `supabase/import-stff-clubs.sql` - import av 367 StFF-föreningar i Stockholm
- `.env.example` - miljövariabler som behövs i Vercel och lokalt

Rekommenderat första flöde:

1. Skapa Supabase-projekt.
2. Kör `supabase/schema.sql` i Supabase SQL Editor.
3. Kör `supabase/grants.sql` i Supabase SQL Editor.
4. Kör `supabase/seed.sql` om du vill ha testdata.
5. Kör `supabase/import-stff-clubs.sql` för att fylla föreningslistan med StFF:s Stockholmsföreningar.
6. Lägg in `NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY` i Vercel.
