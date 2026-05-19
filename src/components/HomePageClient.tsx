"use client";

import { useState } from "react";
import SiteHeader from "./SiteHeader";
import StampGallery from "./StampGallery";
import StampModal from "./StampModal";

interface FilterConfig {
  label: string;
  items: string[];
}

export interface GalleryItem {
  id: string;
  thumbnailSrc: string;
  largeSrc: string;
  alt: string;
  name: string;
  country?: string;
  year?: number;
  designer?: string;
  description?: string;
  category?: string;
  collection?: string;
}

interface HomePageClientProps {
  filters: FilterConfig[];
  items: GalleryItem[];
}

export default function HomePageClient({ filters, items }: HomePageClientProps) {
  const [selectedStamp, setSelectedStamp] = useState<GalleryItem | null>(null);

  return (
    <>
      <SiteHeader filters={filters} />
      <StampGallery items={items} onStampClick={setSelectedStamp} />
      {selectedStamp && (
        <StampModal
          key={selectedStamp.id}
          open
          onClose={() => setSelectedStamp(null)}
          imageSrc={selectedStamp.largeSrc}
          imageAlt={selectedStamp.alt}
          title={selectedStamp.name}
          details={[
            ...(selectedStamp.country ? [{ label: "Country", value: selectedStamp.country }] : []),
            ...(selectedStamp.year ? [{ label: "Year", value: String(selectedStamp.year) }] : []),
            ...(selectedStamp.designer ? [{ label: "Designer", value: selectedStamp.designer }] : []),
            ...(selectedStamp.category ? [{ label: "Category", value: selectedStamp.category }] : []),
            ...(selectedStamp.collection ? [{ label: "Collection", value: selectedStamp.collection }] : []),
          ]}
          description={selectedStamp.description}
        />
      )}
    </>
  );
}
