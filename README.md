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
- `.env.example` - miljövariabler som behövs i Vercel och lokalt

Rekommenderat första flöde:

1. Skapa Supabase-projekt.
2. Kör `supabase/schema.sql` i Supabase SQL Editor.
3. Kör `supabase/seed.sql` om du vill ha testdata.
4. Lägg in `NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY` i Vercel.
