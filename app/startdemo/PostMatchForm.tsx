"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseAnonKey, getSupabaseUrl } from "../../lib/supabasePublic";

type Club = {
  id: string;
  name: string;
  region: string;
  municipality: string | null;
  verified: boolean;
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("sv-SE");
}

export default function PostMatchForm() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubQuery, setClubQuery] = useState("");
  const [clubStatus, setClubStatus] = useState("Laddar godkända föreningar...");

  useEffect(() => {
    let isActive = true;

    async function loadClubs() {
      const supabaseAnonKey = getSupabaseAnonKey();

      if (!supabaseAnonKey) {
        setClubStatus("Kunde inte ladda föreningar: Supabase anon-nyckel saknas.");
        return;
      }

      const supabase = createClient(getSupabaseUrl(), supabaseAnonKey);
      const { data, error } = await supabase
        .from("clubs")
        .select("id,name,region,municipality,verified")
        .order("name", { ascending: true });

      if (!isActive) {
        return;
      }

      if (error) {
        setClubStatus(`Kunde inte ladda föreningar: ${error.message}`);
        return;
      }

      setClubs((data as Club[]) || []);
      setClubStatus(`${data?.length || 0} godkända föreningar laddade från databasen.`);
    }

    loadClubs().catch((error: unknown) => {
      if (!isActive) {
        return;
      }

      setClubStatus(`Kunde inte ladda föreningar: ${error instanceof Error ? error.message : "okänt fel"}`);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const selectedClub = useMemo(
    () => clubs.find((club) => normalize(club.name) === normalize(clubQuery)) || null,
    [clubQuery, clubs],
  );

  const hasTypedClub = clubQuery.trim().length > 0;
  const isKnownClub = Boolean(selectedClub);

  return (
    <form className="postForm">
      <label>
        <span>Förening</span>
        <input
          list="approved-clubs"
          placeholder="Börja skriva, t.ex. Skå IK"
          value={clubQuery}
          onChange={(event) => setClubQuery(event.target.value)}
          aria-describedby="club-validation"
        />
        <datalist id="approved-clubs">
          {clubs.map((club) => (
            <option key={club.id} value={club.name}>
              {[club.municipality, club.region].filter(Boolean).join(", ")}
            </option>
          ))}
        </datalist>
        <span
          className={`fieldStatus ${isKnownClub ? "valid" : hasTypedClub ? "invalid" : ""}`}
          id="club-validation"
        >
          {isKnownClub
            ? `Godkänd förening: ${selectedClub?.name}`
            : hasTypedClub
              ? "Välj en förening från listan för att gå vidare."
              : clubStatus}
        </span>
      </label>
      <input type="hidden" name="clubId" value={selectedClub?.id || ""} />

      <label>
        <span>Lag</span>
        <input placeholder="t.ex. P2014 Grön" />
      </label>

      <label>
        <span>Spelform</span>
        <select defaultValue="9v9">
          <option>5v5</option>
          <option>7v7</option>
          <option>9v9</option>
          <option>11v11</option>
        </select>
      </label>

      <label>
        <span>Nivå</span>
        <select defaultValue="Svår">
          <option>Lätt</option>
          <option>Medel</option>
          <option>Svår</option>
          <option>Svår+</option>
        </select>
      </label>

      <label className="wide">
        <span>Beskriv matchen</span>
        <textarea placeholder="Beskriv datum, plats, nivå och önskat motstånd." />
      </label>

      <button type="button" disabled={!isKnownClub}>
        Publicera matchförfrågan
      </button>
    </form>
  );
}
