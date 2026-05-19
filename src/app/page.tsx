import HomePageClient from "@/components/HomePageClient";
import { getAllStamps } from "@/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const stamps = await getAllStamps();

  const countries = [...new Set(stamps.map((s) => s.country).filter(Boolean))] as string[];
  const years = [...new Set(stamps.map((s) => s.year).filter(Boolean))].sort((a, b) => b - a).map(String);
  const topics = [...new Set(stamps.flatMap((s) => s.tags ?? []))].sort();

  const filters = [
    { label: "Country", items: countries },
    { label: "Year", items: years },
    { label: "Topic", items: topics },
  ];

  const galleryItems = stamps.map((s) => ({
    id: s._id,
    src: s.image?.asset?._ref ? `/api/stamp-image/${s._id}` : "/stamp-placeholder.svg",
    alt: s.title,
    href: `/stamp/${s.slug.current}`,
  }));

  return <HomePageClient filters={filters} items={galleryItems} />;
}
