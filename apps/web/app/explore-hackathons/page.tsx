import Link from "next/link";
import { and, asc, desc, gt, gte, ilike, isNotNull, isNull, lt, lte, or, sql } from "drizzle-orm";
import { db } from "../../src/db";
import { events } from "../../src/db/schema";
import {
  buildExploreHackathonsHref,
  FEATURED_LOCATION_FILTERS,
  isFeaturedLocationFilterKey,
} from "./location-filters";
import { Navbar } from "../navbar";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 24;
const FILTER_KEYS = ["remote", "prize", "hackers", "month"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];
type SortKey = "date" | "prize" | "hackers";

const FILTER_LABELS: Record<FilterKey, string> = {
  remote: "Remote",
  prize: "Prize",
  hackers: "Hackers",
  month: "This month",
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "prize", label: "Prize" },
  { key: "hackers", label: "Hackers" },
];

function formatEventDateRange(startTime: Date, endTime: Date | null): string {
  const start = startTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!endTime) return `${start} - TBD`;
  const end = endTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${start} - ${end}`;
}

function formatCompactDate(startTime: Date): string {
  return startTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function formatPrize(cashPrize: number | null): string {
  if (cashPrize == null || cashPrize === -1) return "TBD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cashPrize);
}

function formatParticipants(participantsCount: number | null): string {
  if (participantsCount == null || participantsCount <= 0) return "TBD";
  return new Intl.NumberFormat("en-US").format(participantsCount);
}

function buildAllHref({
  page,
  query,
  city,
  region,
  filters,
  sort,
}: {
  page?: number;
  query: string;
  city?: string;
  region?: keyof typeof FEATURED_LOCATION_FILTERS;
  filters: Set<FilterKey>;
  sort: SortKey;
}): string {
  return buildExploreHackathonsHref({
    page,
    query,
    city,
    region,
    remote: filters.has("remote"),
    prize: filters.has("prize"),
    hackers: filters.has("hackers"),
    month: filters.has("month"),
    sort,
  });
}

type AllPageProps = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    city?: string;
    region?: string;
    remote?: string;
    prize?: string;
    hackers?: string;
    month?: string;
    sort?: string;
  }>;
};

export default async function AllPage({ searchParams }: AllPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawPage = Number(resolvedSearchParams?.page ?? "1");
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const city = resolvedSearchParams?.city?.trim() ?? "";
  const region = isFeaturedLocationFilterKey(resolvedSearchParams?.region)
    ? resolvedSearchParams.region
    : undefined;
  const activeFilters = new Set<FilterKey>(
    FILTER_KEYS.filter((filter) => resolvedSearchParams?.[filter] === "1")
  );
  const sort = SORT_OPTIONS.some((option) => option.key === resolvedSearchParams?.sort)
    ? (resolvedSearchParams?.sort as SortKey)
    : "date";
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const offset = (page - 1) * PAGE_SIZE;
  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const upcomingFilter = or(isNull(events.endTime), gte(events.endTime, now));
  const cityFilter = city.length > 0 ? ilike(events.city, city) : undefined;
  const regionFilter = region
    ? and(
        isNotNull(events.latitude),
        isNotNull(events.longitude),
        or(
          ...FEATURED_LOCATION_FILTERS[region].boxes.map((box) =>
            and(
              gte(events.latitude, box.minLat),
              lte(events.latitude, box.maxLat),
              gte(events.longitude, box.minLng),
              lte(events.longitude, box.maxLng),
            )
          )
        )
      )
    : undefined;
  const searchFilter =
    query.length >= 2
      ? or(
          ilike(events.title, `%${query}%`),
          ilike(events.city, `%${query}%`),
          ilike(events.description, `%${query}%`)
        )
      : undefined;
  const filters = [
    upcomingFilter,
    searchFilter,
    cityFilter,
    regionFilter,
    activeFilters.has("remote") ? isNull(events.city) : undefined,
    activeFilters.has("prize")
      ? and(isNotNull(events.cashPrize), gt(events.cashPrize, 0))
      : undefined,
    activeFilters.has("hackers")
      ? and(isNotNull(events.participantsCount), gt(events.participantsCount, 0))
      : undefined,
    activeFilters.has("month")
      ? and(gte(events.startTime, now), lt(events.startTime, monthEnd))
      : undefined,
  ].filter(Boolean);
  const whereClause = and(...filters);
  const countRows = await db
    .select({ total: sql<number>`count(*)` })
    .from(events)
    .where(whereClause);
  const total = countRows[0]?.total ?? 0;
  const hackathons = await db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(
      sort === "prize"
        ? desc(sql`coalesce(${events.cashPrize}, 0)`)
        : sort === "hackers"
          ? desc(sql`coalesce(${events.participantsCount}, 0)`)
          : asc(events.startTime),
      asc(events.startTime)
    )
    .limit(PAGE_SIZE)
    .offset(offset);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;
  const locationLabel = city || (region ? FEATURED_LOCATION_FILTERS[region].label : "");
  const title =
    query.length >= 2
      ? `Results for "${query}"`
      : locationLabel
        ? `Upcoming hackathons in ${locationLabel}`
        : "All upcoming hackathons";

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hackathons}>
        <div className={styles.cityHeader}>
          <div className={styles.headingBlock}>
            <span className={styles.kicker}>Database view</span>
            <h1 className={styles.hackathonsTitle}>{title}</h1>
            <p className={styles.subtitle}>
              {total} event{total > 1 ? "s" : ""} listed, ordered by start date.
            </p>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.resultPill}>{total} rows</span>
            <span className={styles.pageIndicator}>
              Page {page} / {totalPages}
            </span>
            {hasPreviousPage && (
              <Link
                href={buildAllHref({ page: page - 1, query, city, region, filters: activeFilters, sort })}
                className={styles.seeMoreLink}
              >
                Previous
              </Link>
            )}
            {hasNextPage && (
              <Link
                href={buildAllHref({ page: page + 1, query, city, region, filters: activeFilters, sort })}
                className={styles.seeMoreLink}
              >
                Next
              </Link>
            )}
            <Link href="/" className={styles.seeMoreLink}>
              Back home
            </Link>
          </div>
        </div>

        <div className={styles.toolbar}>
          <form action="/explore-hackathons" method="get" className={styles.searchForm}>
            <div className={styles.searchField}>
              <svg
                className={styles.searchIcon}
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.5 11.5 15 15M13.4 7.2a6.2 6.2 0 1 1-12.4 0 6.2 6.2 0 0 1 12.4 0Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search events, city, keywords"
                className={styles.searchInput}
              />
            </div>
            {FILTER_KEYS.map((filter) =>
              activeFilters.has(filter) ? (
                <input key={filter} type="hidden" name={filter} value="1" />
              ) : null
            )}
            {city.length > 0 && <input type="hidden" name="city" value={city} />}
            {region && <input type="hidden" name="region" value={region} />}
            {sort !== "date" && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className={styles.toolbarButton}>
              Search
            </button>
          </form>

          <div className={styles.controlsRow}>
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Filters</span>
              <div className={styles.controlButtons}>
                {FILTER_KEYS.map((filter) => {
                  const nextFilters = new Set(activeFilters);
                  if (nextFilters.has(filter)) {
                    nextFilters.delete(filter);
                  } else {
                    nextFilters.add(filter);
                  }

                  return (
                    <Link
                      key={filter}
                      href={buildAllHref({ query, city, region, filters: nextFilters, sort })}
                      className={`${styles.controlButton} ${
                        activeFilters.has(filter) ? styles.controlButtonActive : ""
                      }`}
                    >
                      {FILTER_LABELS[filter]}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Sort</span>
              <div className={styles.controlButtons}>
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.key}
                    href={buildAllHref({ query, city, region, filters: activeFilters, sort: option.key })}
                    className={`${styles.controlButton} ${
                      sort === option.key ? styles.controlButtonActive : ""
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {(activeFilters.size > 0 || sort !== "date" || city.length > 0 || region) && (
            <div className={styles.activeStateRow}>
              {city.length > 0 && <span className={styles.activePill}>City: {city}</span>}
              {region && (
                <span className={styles.activePill}>
                  Region: {FEATURED_LOCATION_FILTERS[region].label}
                </span>
              )}
              {Array.from(activeFilters).map((filter) => (
                <span key={filter} className={styles.activePill}>
                  {FILTER_LABELS[filter]}
                </span>
              ))}
              {sort !== "date" && (
                <span className={styles.activePill}>Sort: {sort}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.tableShell}>
          {hackathons.length === 0 ? (
            <p className={styles.emptyState}>
              {query.length >= 2
                ? `No upcoming hackathons match "${query}".`
                : "No upcoming hackathons yet."}
            </p>
          ) : (
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Dates</th>
                    <th scope="col">City</th>
                    <th scope="col">Prize</th>
                    <th scope="col">Hackers</th>
                    <th scope="col" className={styles.actionsColumn}>
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hackathons.map((h) => (
                    <tr key={h.id}>
                      <td data-label="Event">
                        <div className={styles.eventCell}>
                          <div className={styles.eventHead}>
                            <span className={styles.eventTitle}>{h.title}</span>
                            <span className={styles.eventStartBadge}>
                              {formatCompactDate(h.startTime)}
                            </span>
                          </div>
                          {h.tags && h.tags.length > 0 && (
                            <div className={styles.tagList}>
                              {h.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td data-label="Dates" className={styles.mutedCell}>
                        {formatEventDateRange(h.startTime, h.endTime)}
                      </td>
                      <td data-label="City" className={styles.mutedCell}>
                        {h.city ?? "Remote / TBD"}
                      </td>
                      <td data-label="Prize" className={styles.numericCell}>
                        {formatPrize(h.cashPrize)}
                      </td>
                      <td data-label="Hackers" className={styles.numericCell}>
                        {formatParticipants(h.participantsCount)}
                      </td>
                      <td data-label="Link" className={styles.linkCell}>
                        {h.link ? (
                          <a
                            href={h.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.rowLink}
                          >
                            Open
                          </a>
                        ) : (
                          <span className={styles.rowLinkMuted}>Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {hasPreviousPage && (
              <Link
                href={buildAllHref({ page: page - 1, query, city, region, filters: activeFilters, sort })}
                className={styles.seeMoreLink}
              >
                Previous
              </Link>
            )}
            <span className={styles.pageIndicator}>
              Page {page} / {totalPages}
            </span>
            {hasNextPage && (
              <Link
                href={buildAllHref({ page: page + 1, query, city, region, filters: activeFilters, sort })}
                className={styles.seeMoreLink}
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
