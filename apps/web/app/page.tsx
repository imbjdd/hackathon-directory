import { db } from "../src/db";
import { events } from "../src/db/schema";
import { and, gte, ilike, isNotNull, isNull, lte, or } from "drizzle-orm";
import { HeroShader } from "./hero-shader";
import { HeroSearchTrigger } from "./hero-search-trigger";
import { HackathonCover } from "./hackathon-cover";
import { Navbar } from "./navbar";
import { LogoCloud } from "@/components/logo-cloud";
import { buildExploreHackathonsHref, FEATURED_LOCATION_FILTERS } from "./explore-hackathons/location-filters";
import Link from "next/link";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
const FEATURED_SECTIONS = [
  {
    key: "france",
    label: "France",
    href: buildExploreHackathonsHref({ region: "france" }),
    boxes: FEATURED_LOCATION_FILTERS.france.boxes,
  },
  {
    key: "san-francisco",
    label: "San Francisco",
    href: buildExploreHackathonsHref({ city: "San Francisco" }),
    match: ["San Francisco"],
  },
  {
    key: "london",
    label: "London",
    href: buildExploreHackathonsHref({ city: "London" }),
    match: ["London"],
  },
  {
    key: "berlin",
    label: "Berlin",
    href: buildExploreHackathonsHref({ city: "Berlin" }),
    match: ["Berlin"],
  },
] as const;

function getCoverSrc(coverUrl: string | null): string | null {
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http")) return coverUrl;
  return `/api/images?key=${encodeURIComponent(coverUrl)}`;
}

function formatEventDateRange(startTime: Date, endTime: Date | null): string {
  const start = startTime.toLocaleDateString("fr-FR");
  if (!endTime) return `${start} - TBD`;
  const end = endTime.toLocaleDateString("fr-FR");
  return `${start} - ${end}`;
}

export default async function Home() {
  const now = new Date();
  const hackathonsBySection = await Promise.all(
    FEATURED_SECTIONS.map(async (section) => {
      const locationFilter =
        "boxes" in section
          ? and(
              isNotNull(events.latitude),
              isNotNull(events.longitude),
              or(
                ...section.boxes.map((box) =>
                  and(
                    gte(events.latitude, box.minLat),
                    lte(events.latitude, box.maxLat),
                    gte(events.longitude, box.minLng),
                    lte(events.longitude, box.maxLng),
                  ),
                ),
              ),
            )
          : or(...section.match.map((city) => ilike(events.city, city)));
      const items = await db
        .select()
        .from(events)
        .where(and(or(isNull(events.endTime), gte(events.endTime, now)), locationFilter))
        .orderBy(events.startTime)
        .limit(6);
      return { section, items };
    }),
  );

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Hackathons near you</h1>
          <HeroSearchTrigger />
        </div>
        <div className={styles.heroShader}>
          <HeroShader />
        </div>
      </section>

      <section className="px-4 pb-10 md:px-[100px]">
        <div className="relative w-full">
          <h2 className="mb-6 -translate-y-2 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-2xl">
            Featuring hackathons <span className="font-semibold text-primary">organized</span>{" "}
            by top companies
          </h2>
          <div className="relative w-full *:border-y-0">
            <div className="pointer-events-none absolute -top-px left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
            <LogoCloud />
            <div className="pointer-events-none absolute -bottom-px left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
          </div>
        </div>
      </section>

      {/* Hackathons */}
      <section className={styles.hackathons}>
        {hackathonsBySection.map(({ section, items }) => (
          <div key={section.key} className={styles.citySection}>
            <div className={styles.cityHeader}>
              <h2 className={styles.hackathonsTitle}>
                Upcoming hackathons <span className={styles.location}>in {section.label}</span>
              </h2>
              <Link href={section.href} className={styles.seeMoreLink}>
                See more
              </Link>
            </div>
            <div className={styles.hackathonGrid}>
              {items.length === 0 ? (
                <p className={styles.emptyState}>
                  No upcoming hackathons in {section.label} yet.
                </p>
              ) : (
                items.map((h) => {
                  const coverSrc = getCoverSrc(h.coverUrl);
                  const card = (
                    <div className={styles.hackathonCard}>
                      {coverSrc && (
                        <HackathonCover
                          image={coverSrc}
                          alt={`Cover for ${h.title}`}
                          className={styles.cardImage}
                          priority={section.key === "france"}
                        />
                      )}
                      <div className={styles.cardInfo}>
                        <span className={styles.cardDate}>
                          {formatEventDateRange(h.startTime, h.endTime)}
                        </span>
                        <span className={styles.cardName}>{h.title}</span>
                        <div className={styles.cardMeta}>
                          {h.cashPrize != null && h.cashPrize !== -1 && (
                            <span>{h.cashPrize}$</span>
                          )}
                          {h.participantsCount != null && h.participantsCount > 0 && (
                            <span>{h.participantsCount} Hackers</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );

                  return h.link ? (
                    <a
                      key={h.id}
                      href={h.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.hackathonCardLink}
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={h.id}>{card}</div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
