import { redirect } from "next/navigation";
import { buildExploreHackathonsHref } from "../../explore-hackathons/location-filters";

export const dynamic = "force-dynamic";

type CityPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  redirect(buildExploreHackathonsHref({ city: decodeURIComponent(city) }));
}
