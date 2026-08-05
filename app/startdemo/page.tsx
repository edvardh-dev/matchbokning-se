import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Matchbokning.se demo",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type DemoMatch = {
  club: string;
  team: string;
  area: string;
  date: string;
  time: string;
  place: string;
  format: string;
  age: string;
  level: string;
  text: string;
  views: number;
  posted: string;
};

type PublicMatchRequest = {
  id: string;
  match_date: string;
  match_time: string | null;
  location: string;
  format: string;
  level: string;
  description: string | null;
  views: number;
  created_at: string;
  gender: "boys" | "girls" | "mixed";
  birth_year: number;
  team_name: string;
  club_name: string;
  region: string;
  municipality: string | null;
};

const fallbackMatches: DemoMatch[] = [
  {
    club: "Hammarby IF",
    team: "P2014A",
    area: "Stockholm",
    date: "15 aug",
    time: "10:00",
    place: "Årsta IP",
    format: "9v9",
    age: "födda 2014",
    level: "Svår+",
    text: "Söker motstånd i toppskiktet inför seriestart. Konstgräs, omklädningsrum finns.",
    views: 214,
    posted: "2 timmar sedan",
  },
  {
    club: "Skå IK",
    team: "P2014",
    area: "Färingsö",
    date: "17 aug",
    time: "13:30",
    place: "Skå IP",
    format: "9v9",
    age: "födda 2014",
    level: "Svår",
    text: "Vi spelar gärna 2 x 30 min. Naturgräs i mycket bra skick.",
    views: 168,
    posted: "5 timmar sedan",
  },
  {
    club: "BP",
    team: "P2012-3",
    area: "Bromma",
    date: "18 aug",
    time: "19:00",
    place: "Bortamatch",
    format: "11v11",
    age: "födda 2012",
    level: "Svår",
    text: "Söker bortamatch mot lag på liknande nivå. Kan spela vardagskväll.",
    views: 96,
    posted: "i går",
  },
  {
    club: "Täby FK",
    team: "F2013",
    area: "Täby",
    date: "22 aug",
    time: "12:15",
    place: "Tibblevallen",
    format: "9v9",
    age: "födda 2013",
    level: "Medel",
    text: "Plan finns och domare kan ordnas. Vi söker jämnt motstånd inför höststarten.",
    views: 121,
    posted: "i går",
  },
];

const stats = [
  ["1 248", "registrerade lag"],
  ["387", "aktiva matcher"],
  ["156", "föreningar"],
];

const benefits = ["Gratis för lag", "Ingen bindningstid", "Verifierade föreningar"];

function Initials({ club }: { club: string }) {
  return <span className="initials">{club.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>;
}

const levelLabels: Record<string, string> = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
  hard_plus: "Svår+",
  extra_hard: "Extra svår",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : "Flexibel";
}

function mapSupabaseMatch(match: PublicMatchRequest): DemoMatch {
  return {
    club: match.club_name,
    team: match.team_name,
    area: match.municipality || match.region,
    date: formatDate(match.match_date),
    time: formatTime(match.match_time),
    place: match.location,
    format: match.format,
    age: `födda ${match.birth_year}`,
    level: levelLabels[match.level] || match.level,
    text: match.description || "Matchförfrågan från Supabase.",
    views: match.views,
    posted: "från Supabase",
  };
}

async function getMatches(): Promise<DemoMatch[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return fallbackMatches;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("public_match_requests")
    .select("*")
    .order("match_date", { ascending: true })
    .limit(12);

  if (error || !data?.length) {
    return fallbackMatches;
  }

  return (data as unknown as PublicMatchRequest[]).map(mapSupabaseMatch);
}

export default async function Home() {
  const matches = await getMatches();

  return (
    <main>
      <header className="topbar">
        <nav className="container nav" aria-label="Huvudmeny">
          <a className="brand" href="#">
            <span className="brandIcon">◎</span>
            <span>
              Matchbokning<span>.se</span>
            </span>
          </a>
          <div className="links">
            <a href="#matcher">Hitta matcher</a>
            <a href="#lagg-upp">Lägg upp matchförfrågan</a>
            <a href="#sa-funkar-det">Så funkar det</a>
          </div>
          <div className="actions">
            <a className="login" href="#login">
              Logga in
            </a>
            <a className="primaryButton" href="#lagg-upp">
              + Lägg upp match
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="container">
          <span className="badge">● {matches.length} aktiva demomatcher</span>
          <h1>Hitta träningsmatcher på 2 minuter</h1>
          <p>Sveriges marknadsplats för träningsmatcher</p>

          <form className="searchCard" action="#matcher">
            <label>
              <span>Ort, förening eller anläggning</span>
              <input placeholder="t.ex. Stockholm eller Hammarby IF" />
            </label>
            <label>
              <span>Spelform</span>
              <select defaultValue="">
                <option value="">Alla spelformer</option>
                <option>5v5</option>
                <option>7v7</option>
                <option>9v9</option>
                <option>11v11</option>
              </select>
            </label>
            <label>
              <span>Nivå</span>
              <select defaultValue="">
                <option value="">Alla nivåer</option>
                <option>Lätt</option>
                <option>Medel</option>
                <option>Svår</option>
                <option>Svår+</option>
                <option>Extra svår</option>
              </select>
            </label>
            <button type="submit">Sök matcher</button>
          </form>

          <div className="benefits" aria-label="Fördelar">
            {benefits.map((benefit) => (
              <span key={benefit}>✓ {benefit}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Statistik">
        {stats.map(([value, label]) => (
          <div className="stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="container latest" id="matcher">
        <div className="sectionHeader">
          <div>
            <h2>Senaste matchförfrågningarna</h2>
            <p>Lag som söker motstånd just nu – hela listan uppdateras löpande.</p>
          </div>
          <a className="secondaryButton" href="#matcher">
            Visa alla matcher →
          </a>
        </div>

        <div className="matchGrid">
          {matches.map((match) => (
            <article className="matchCard" key={`${match.club}-${match.team}`}>
              <div className="cardTop">
                <div className="team">
                  <Initials club={match.club} />
                  <div>
                    <h3>
                      {match.club} <span>Verifierad</span>
                    </h3>
                    <p>
                      {match.team} · {match.area}
                    </p>
                  </div>
                </div>
                <div className="level">
                  <strong>{match.level}</strong>
                  <span>{match.format}</span>
                </div>
              </div>

              <div className="details">
                <span>▣ {match.date}</span>
                <span>◷ {match.time}</span>
                <span>⌖ {match.place} · Hemma</span>
                <span>⚭ {match.format} · {match.age}</span>
              </div>

              <p className="description">{match.text}</p>

              <div className="cardBottom">
                <span>
                  {match.posted} · ◉ {match.views}
                </span>
                <div>
                  <button type="button">Spara</button>
                  <button type="button">Skicka förfrågan</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container post" id="lagg-upp">
        <div>
          <span className="badge">Pilot för Stockholm P/F 2012-2016</span>
          <h2>Efterlys match</h2>
          <p>
            Nästa steg är att koppla formuläret till Supabase så riktiga tränare kan lägga upp matcher,
            skicka förfrågningar och ändra status från aktiv till bokad.
          </p>
        </div>
        <form className="postForm">
          <input placeholder="Förening" />
          <input placeholder="Lag, t.ex. P2014 Grön" />
          <select defaultValue="9v9">
            <option>5v5</option>
            <option>7v7</option>
            <option>9v9</option>
            <option>11v11</option>
          </select>
          <select defaultValue="Svår">
            <option>Lätt</option>
            <option>Medel</option>
            <option>Svår</option>
            <option>Svår+</option>
          </select>
          <textarea placeholder="Beskriv datum, plats, nivå och önskat motstånd." />
          <button type="button">Publicera matchförfrågan</button>
        </form>
      </section>
    </main>
  );
}
