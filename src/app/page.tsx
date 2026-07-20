"use client";

import { useEffect, useState } from "react";

type Episode = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  durationSec: number | null;
  publishedAt: string;
};

type Show = {
  slug: string;
  title: string;
  description: string;
  format: string;
  feedUrl: string;
  coverUrl?: string | null;
  episodes: Episode[];
};

type SiteData = { generatedAt: string; shows: Show[] };

// Episode data is committed into this site's own public/ dir, so same-origin
// by default; NEXT_PUBLIC_DATA_BASE only overrides for local dev against prod data.
const DATA_BASE = (process.env.NEXT_PUBLIC_DATA_BASE ?? "").replace(/\/$/, "");

function fmtDuration(sec: number | null) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  return `${m} min`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Mug() {
  return (
    <span className="relative inline-block mr-3 align-baseline" aria-hidden>
      <span className="steam absolute -top-3 left-1.5 w-1 h-2.5 rounded-full bg-espresso-dim/50" />
      <span className="steam-2 absolute -top-3 left-3.5 w-1 h-2.5 rounded-full bg-espresso-dim/50" />
      <span className="inline-block w-6 h-5 rounded-b-xl rounded-t-sm bg-crema relative">
        <span className="absolute -right-2 top-0.5 w-2.5 h-3 border-[3px] border-crema rounded-r-full" />
      </span>
    </span>
  );
}

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch(`${DATA_BASE}/data/site.json`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Couldn't load episodes right now — try refreshing in a minute."));
  }, []);

  const showsWithEpisodes = data?.shows.filter((s) => s.episodes.length > 0) ?? [];

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 pb-24">
        {/* Masthead */}
        <header className="pt-16 pb-10 rise flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/covers/coffee-with-robots-web.jpg"
            alt="Coffee with Robots cover art — two robots sharing coffee at a café table"
            className="w-40 h-40 sm:w-44 sm:h-44 rounded-3xl shadow-[0_10px_30px_rgba(59,42,30,0.25)] rotate-[-2deg] shrink-0"
          />
          <div>
            <h1 className="font-display italic font-semibold text-5xl sm:text-6xl tracking-tight leading-none">
              <Mug />
              Coffee with Robots
            </h1>
            <p className="mt-4 text-lg text-espresso-dim max-w-xl leading-relaxed">
              Every morning, two friendly robots catch you up on what the robots did yesterday — the
              day&apos;s AI news in plain English. No jargon, no homework.
            </p>
          </div>
        </header>

        {error && (
          <p className="rounded-xl border border-crema/40 bg-paper-2 p-4 text-espresso-dim">{error}</p>
        )}
        {!data && !error && <p className="text-espresso-dim">Brewing…</p>}

        {showsWithEpisodes.map((show, si) => (
          <section key={show.slug} className="rise" style={{ animationDelay: `${si * 0.1}s` }}>
            {showsWithEpisodes.length > 1 && (
              <h2 className="font-display italic font-medium text-3xl mt-12 mb-1">{show.title}</h2>
            )}
            <div className="flex items-center gap-3 mt-2 mb-6">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(show.feedUrl);
                  setCopied(show.slug);
                  setTimeout(() => setCopied(""), 1500);
                }}
                className="text-sm font-medium px-4 py-2 rounded-full bg-espresso text-paper hover:bg-crema-deep transition-colors"
              >
                {copied === show.slug ? "Copied!" : "☕ Copy RSS — subscribe in any podcast app"}
              </button>
            </div>

            <div className="space-y-5">
              {show.episodes.map((e, i) => (
                <article
                  key={e.id}
                  className="rise rounded-2xl border border-espresso/10 bg-white/50 p-5 shadow-[0_2px_12px_rgba(59,42,30,0.05)]"
                  style={{ animationDelay: `${0.15 + i * 0.06}s` }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display font-semibold text-xl leading-snug">{e.title}</h3>
                    <span className="shrink-0 text-xs text-espresso-dim whitespace-nowrap">
                      {fmtDate(e.publishedAt)} · {fmtDuration(e.durationSec)}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] text-espresso-dim leading-relaxed">{e.description}</p>
                  <div className="mt-4">
                    <audio controls preload="none" src={e.audioUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {data && showsWithEpisodes.length === 0 && (
          <p className="text-espresso-dim">First episodes are brewing — check back soon.</p>
        )}

        <footer className="mt-16 pt-6 border-t border-espresso/10 text-xs text-espresso-dim">
          Hosted by AI, produced fresh daily. Made with the AI Podcast Factory.
        </footer>
      </main>
    </div>
  );
}
