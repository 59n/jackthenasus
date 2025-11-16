"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { getSiteContent } from "@/lib/content";
import { useState } from "react";

function HighlightCard({ highlight }: { highlight: { title: string; meta: string; description: string; image?: string; code?: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine what content to render
  let contentToRender = highlight.description;
  
  // If code is provided, use that; otherwise if image is provided, render it
  if (highlight.code) {
    contentToRender = highlight.code;
  } else if (highlight.image) {
    contentToRender = `<img src="${highlight.image}" alt="${highlight.title}" style="max-width: 100%; height: auto; display: block;" />`;
  }

  return (
    <article 
      className="highlight" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '120px',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="highlight__header" style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', flex: 0 }}>
        <h3 style={{ margin: 0, flex: 1 }}>{highlight.title}</h3>
        <span>{highlight.meta}</span>
        <span style={{ marginLeft: '20px', fontSize: '1.2em', minWidth: '20px', textAlign: 'center', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          {isOpen ? '−' : '+'}
        </span>
      </div>
      {isOpen && (
        <div style={{ marginTop: '15px', flex: 1 }}>
          {renderHighlightDescription(contentToRender)}
        </div>
      )}
    </article>
  );
}

function renderHighlightDescription(desc: string) {
  if (!desc) return null;

  // Detect presence of HTML tags or markdown image syntax
  const hasHtmlTag = /<[^>]+>/.test(desc);
  const hasMarkdownImage = /!\[[^\]]*\]\([^\)]+\)/.test(desc);

  // Convert markdown image syntax ![alt](src "title") -> <img ... />
  if (hasMarkdownImage) {
    desc = desc.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)/g, (_m, alt, src, title) => {
      // Strip "public/" prefix if present (Next.js serves public/ at root)
      src = src.replace(/^public\//, "");
      let attrs = `src="${src}" alt="${alt || ""}" style="max-width: 100%; height: auto; display: block;"`;
      if (title) attrs += ` title="${title}"`;
      return `<img ${attrs} />`;
    });
  }

  if (hasHtmlTag || hasMarkdownImage) {
    // Strip "public/" from src attributes in HTML img tags
    desc = desc.replace(/src="public\//g, 'src="');
    // Wrap in container and ensure images fit within the box
    const wrappedDesc = desc.replace(/<img([^>]*)>/g, (match) => {
      // Add responsive image styles if not already present
      if (!match.includes('style=')) {
        return match.replace('<img', '<img style="max-width: 100%; height: auto; display: block;"');
      }
      return match;
    });
    
    // We intentionally allow HTML here because content is authored locally.
    // If content may be user-supplied, sanitize before using dangerouslySetInnerHTML.
    return <div style={{ overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: wrappedDesc }} />;
  }

  return <p>{desc}</p>;
}

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

        {/* <section className="pillars" aria-label="Focus areas">
          {sections.map((section) => (
            <article className="pillars__card" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section> */}

        <section className="highlights" aria-label="Selected work">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Trading</span>
              <h2>Recent Achievements</h2>
            </div>
            {/* <span className="section-heading__note">Recent releases and collaborations</span> */}
          </div>
          <div className="highlights__grid">
            {highlights.map((highlight) => (
              <HighlightCard highlight={highlight} key={highlight.title} />
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
