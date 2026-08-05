import type { Metadata } from "next";
import MatchList from "./MatchList";

export const metadata: Metadata = {
  title: "Matchbokning.se demo",
  robots: {
    index: false,
    follow: false,
  },
};

const stats = [
  ["1 248", "registrerade lag"],
  ["387", "aktiva matcher"],
  ["156", "föreningar"],
];

const benefits = ["Gratis för lag", "Ingen bindningstid", "Verifierade föreningar"];

export default function Home() {
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
          <span className="badge">● Stockholm P/F 2012-2016</span>
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

      <MatchList />

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
