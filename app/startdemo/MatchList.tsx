"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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

type MatchSource = "loading" | "supabase" | "fallback";

const supabaseProjectUrl = "https://lnytfcuuidccmfnrgibc.supabase.co";

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

const levelLabels: Record<string, string> = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
  hard_plus: "Svår+",
  extra_hard: "Extra svår",
};

function Initials({ club }: { club: string }) {
  return <span className="initials">{club.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>;
}

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

function getSupabaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return configuredUrl?.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0] || supabaseProjectUrl;
}

export default function MatchList() {
  const [matches, setMatches] = useState(fallbackMatches);
  const [source, setSource] = useState<MatchSource>("loading");
  const [message, setMessage] = useState("Laddar matchförfrågningar från Supabase...");

  useEffect(() => {
    let isActive = true;

    async function loadMatches() {
      const supabaseUrl = getSupabaseUrl();
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseAnonKey) {
        setSource("fallback");
        setMessage("Fallbackdata visas: Supabase anon-nyckel saknas i deploymenten.");
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from("public_match_requests")
        .select("*")
        .order("match_date", { ascending: true })
        .limit(12);

      if (!isActive) {
        return;
      }

      if (error || !data?.length) {
        setSource("fallback");
        setMessage(
          error
            ? `Fallbackdata visas: Supabase svarade med fel: ${error.message}`
            : "Fallbackdata visas: Supabase returnerade inga aktiva matchförfrågningar.",
        );
        return;
      }

      setMatches((data as PublicMatchRequest[]).map(mapSupabaseMatch));
      setSource("supabase");
      setMessage(`Live från Supabase: ${data.length} aktiva matchförfrågningar.`);
    }

    loadMatches().catch((error: unknown) => {
      if (!isActive) {
        return;
      }

      setSource("fallback");
      setMessage(`Fallbackdata visas: ${error instanceof Error ? error.message : "okänt Supabase-fel"}`);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="container latest" id="matcher">
      <div className="sectionHeader">
        <div>
          <h2>Senaste matchförfrågningarna</h2>
          <p>Lag som söker motstånd just nu – hela listan uppdateras löpande.</p>
          <p className={`dataStatus ${source}`}>{message}</p>
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
  );
}
