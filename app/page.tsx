export default function SplashPage() {
  return (
    <main className="splashMain">
      <header className="topbar">
        <nav className="container nav" aria-label="Huvudmeny">
          <a className="brand" href="#">
            <span className="brandIcon">◎</span>
            <span>
              Matchbokning<span>.se</span>
            </span>
          </a>
          <div className="actions">
            <a className="login" href="mailto:edvard.hofmann@outlook.com">
              Kontakta oss
            </a>
          </div>
        </nav>
      </header>

      <section className="splashHero">
        <div className="container splashGrid">
          <div>
            <span className="badge">Lanseras snart · Fotboll först</span>
            <h1>Här byggs Sveriges nya mötesplats för träningsmatcher</h1>
            <p>
              Matchbokning.se ska hjälpa tränare, lagledare och föreningar att hitta rätt motstånd
              snabbt – utan Facebook-trådar, WhatsApp-kaos och mejl som försvinner.
            </p>
            <div className="splashActions">
              <span>Första piloten fokuserar på ungdomsfotboll i Stockholm.</span>
            </div>
          </div>

          <aside className="splashCard" aria-label="Vad kommer på Matchbokning.se">
            <h2>Kommer snart</h2>
            <ul>
              <li>Hitta träningsmatcher på 2 minuter</li>
              <li>Filtrera på årskull, nivå, spelform och plats</li>
              <li>Efterlys match och få förfrågningar från andra lag</li>
              <li>Föreslagna motståndare baserat på nivå och avstånd</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
