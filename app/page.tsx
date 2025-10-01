import { ThemeToggle } from "@/components/theme-toggle";
import { getSiteContent } from "@/lib/content";

export default function Home() {
  const content = getSiteContent();
  const { identity, hero, sections, highlights, contact } = content;

  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <div className="hero__top">
            <div className="hero__identity">
              <span className="eyebrow">{identity.title}</span>
              <h1>{identity.name}</h1>
            </div>
            <ThemeToggle />
          </div>

          <p className="hero__tagline">{identity.tagline}</p>
          <p className="hero__summary">{hero.summary}</p>

          <div className="hero__actions">
            {hero.primaryAction ? (
              <a
                className="button button--primary"
                href={hero.primaryAction.href}
              >
                {hero.primaryAction.label}
              </a>
            ) : null}
            {hero.secondaryAction ? (
              <a
                className="button button--ghost"
                href={hero.secondaryAction.href}
                target="_blank"
                rel="noreferrer"
              >
                {hero.secondaryAction.label}
              </a>
            ) : null}
          </div>

          <div className="hero__meta">
            <p className="hero__availability">{hero.availability}</p>
            <dl className="metrics">
              {hero.metrics.map((metric) => (
                <div className="metrics__item" key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="pillars" aria-label="Focus areas">
          {sections.map((section) => (
            <article className="pillars__card" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="highlights" aria-label="Selected work">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>Impact snapshots</h2>
            </div>
            <span className="section-heading__note">Recent releases and collaborations</span>
          </div>
          <div className="highlights__grid">
            {highlights.map((highlight) => (
              <article className="highlight" key={highlight.title}>
                <div className="highlight__header">
                  <h3>{highlight.title}</h3>
                  <span>{highlight.meta}</span>
                </div>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="footer" aria-label="Contact">
          <div className="footer__primary">
            <span className="eyebrow">Stay in touch</span>
            <p>{contact.note}</p>
            <a className="email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>
          <div className="footer__links">
            <span className="eyebrow">Elsewhere</span>
            <ul>
              {contact.socials.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="footer__credit">© {new Date().getFullYear()} {identity.name}. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
