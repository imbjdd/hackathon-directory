export const FEATURED_LOCATION_FILTERS = {
  france: {
    label: "France",
    boxes: [
      { minLat: 47.0, maxLat: 49.9, minLng: -5.5, maxLng: -0.8 },
      { minLat: 48.0, maxLat: 50.5, minLng: -0.8, maxLng: 4.8 },
      { minLat: 46.0, maxLat: 49.2, minLng: 4.0, maxLng: 7.8 },
      { minLat: 44.0, maxLat: 47.8, minLng: -1.8, maxLng: 7.8 },
      { minLat: 42.2, maxLat: 44.9, minLng: -1.8, maxLng: 7.8 },
    ],
  },
} as const;

export type FeaturedLocationFilterKey = keyof typeof FEATURED_LOCATION_FILTERS;

export function isFeaturedLocationFilterKey(
  value: string | undefined,
): value is FeaturedLocationFilterKey {
  return value != null && value in FEATURED_LOCATION_FILTERS;
}

export function buildExploreHackathonsHref({
  page,
  query,
  city,
  region,
  remote,
  prize,
  hackers,
  month,
  sort,
}: {
  page?: number;
  query?: string;
  city?: string;
  region?: FeaturedLocationFilterKey;
  remote?: boolean;
  prize?: boolean;
  hackers?: boolean;
  month?: boolean;
  sort?: "date" | "prize" | "hackers";
} = {}) {
  const searchParams = new URLSearchParams();

  if (page && page > 1) {
    searchParams.set("page", String(page));
  }

  if (query && query.length > 0) {
    searchParams.set("q", query);
  }

  if (city && city.length > 0) {
    searchParams.set("city", city);
  }

  if (region) {
    searchParams.set("region", region);
  }

  if (remote) {
    searchParams.set("remote", "1");
  }

  if (prize) {
    searchParams.set("prize", "1");
  }

  if (hackers) {
    searchParams.set("hackers", "1");
  }

  if (month) {
    searchParams.set("month", "1");
  }

  if (sort && sort !== "date") {
    searchParams.set("sort", sort);
  }

  const queryString = searchParams.toString();
  return queryString.length > 0 ? `/explore-hackathons?${queryString}` : "/explore-hackathons";
}
