const matches = [
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
          <span className="badge">● 387 aktiva matcher just nu</span>
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
