"use client";

import SiteHeader from "./SiteHeader";
import StampGallery from "./StampGallery";

interface FilterConfig {
  label: string;
  items: string[];
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  href?: string;
}

interface HomePageClientProps {
  filters: FilterConfig[];
  items: GalleryItem[];
}

export default function HomePageClient({ filters, items }: HomePageClientProps) {
  return (
    <>
      <SiteHeader filters={filters} />
      <StampGallery items={items} />
    </>
  );
}
