import HomePageClient from "@/components/HomePageClient";
import { getAllStamps, getAllCategories, getAllCollections } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";

export const revalidate = 60;

export default async function HomePage() {
  const stamps = await getAllStamps();
  const categories = await getAllCategories();
  const collections = await getAllCollections();

  const countries = [...new Set(stamps.map((s) => s.country).filter(Boolean))] as string[];
  const years = [...new Set(stamps.map((s) => s.year).filter(Boolean))].sort((a, b) => (b ?? 0) - (a ?? 0)).map(String);

  const filters = [
    { label: "Country", items: countries },
    { label: "Year", items: years },
    { label: "Category", items: categories.map((c) => c.title) },
    { label: "Collection", items: collections.map((c) => c.title) },
  ];

  const galleryItems = stamps.map((s) => ({
    id: s._id,
    thumbnailSrc: s.thumbnail?.asset?._ref
      ? urlFor(s.thumbnail).width(400).fit("max").url()
      : "/stamp-placeholder.svg",
    largeSrc: s.largeImage?.asset?._ref
      ? urlFor(s.largeImage).width(800).fit("max").url()
      : s.thumbnail?.asset?._ref
        ? urlFor(s.thumbnail).width(800).fit("max").url()
        : "/stamp-placeholder.svg",
    alt: s.name,
    name: s.name,
    country: s.country,
    year: s.year,
    designer: s.designer,
    description: s.description,
    category: s.category?.title,
    collection: s.collection?.title,
  }));

  return <HomePageClient filters={filters} items={galleryItems} />;
}
