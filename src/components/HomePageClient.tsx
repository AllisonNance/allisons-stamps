"use client";

import { useState, useMemo, useCallback } from "react";
import SiteHeader from "./SiteHeader";
import StampGallery from "./StampGallery";
import StampModal from "./StampModal";
import SiteFooter from "./SiteFooter";
import BackToTop from "./BackToTop";

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

function getItemValue(item: GalleryItem, label: string): string | undefined {
  switch (label) {
    case "Country": return item.country;
    case "Year": return item.year != null ? String(item.year) : undefined;
    case "Category": return item.category;
    case "Collection": return item.collection;
  }
}

function filterItems(items: GalleryItem[], selections: Record<string, string[]>, excludeLabel?: string): GalleryItem[] {
  return items.filter((item) => {
    for (const [label, selected] of Object.entries(selections)) {
      if (label === excludeLabel) continue;
      if (selected.length === 0) continue;
      const value = getItemValue(item, label);
      if (!value || !selected.includes(value)) return false;
    }
    return true;
  });
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomePageClient({ filters: initialFilters, items }: HomePageClientProps) {
  const [selectedStamp, setSelectedStamp] = useState<GalleryItem | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[] | null>(null);

  const filteredItems = useMemo(() => {
    const source = shuffledItems ?? items;
    return filterItems(source, filterSelections);
  }, [items, shuffledItems, filterSelections]);

  const handleShuffle = useCallback(() => {
    setShuffledItems(shuffleArray(items));
  }, [items]);

  const dynamicFilters = useMemo(() => {
    return initialFilters.map((f) => {
      const itemsMatchingOtherFilters = filterItems(items, filterSelections, f.label);
      const availableValues = new Set<string>();
      for (const item of itemsMatchingOtherFilters) {
        const val = getItemValue(item, f.label);
        if (val) availableValues.add(val);
      }
      return {
        label: f.label,
        items: f.items.filter((v) => availableValues.has(v)),
      };
    });
  }, [initialFilters, items, filterSelections]);

  const selectedIndex = selectedStamp
    ? filteredItems.findIndex((i) => i.id === selectedStamp.id)
    : -1;

  const prevStamp = selectedIndex > 0 ? filteredItems[selectedIndex - 1] : undefined;
  const nextStamp = selectedIndex >= 0 && selectedIndex < filteredItems.length - 1
    ? filteredItems[selectedIndex + 1]
    : undefined;

  const goToPrevious = useCallback(() => {
    if (prevStamp) setSelectedStamp(prevStamp);
  }, [prevStamp]);

  const goToNext = useCallback(() => {
    if (nextStamp) setSelectedStamp(nextStamp);
  }, [nextStamp]);

  return (
    <>
      <a
        href="#main-gallery"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = "fixed";
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.overflow = "visible";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.background = "var(--background)";
          e.currentTarget.style.padding = "8px 16px";
          e.currentTarget.style.color = "#5E5A4B";
          e.currentTarget.style.fontSize = "18px";
          e.currentTarget.style.fontWeight = "300";
          e.currentTarget.style.outline = "2px solid #8E8A7C";
          e.currentTarget.style.outlineOffset = "2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.overflow = "hidden";
          e.currentTarget.style.outline = "";
        }}
      >
        Skip to Gallery
      </a>
      <SiteHeader filters={dynamicFilters} onFilterChange={setFilterSelections} onShuffle={handleShuffle} />
      <main id="main-gallery">
      <StampGallery items={filteredItems} onStampClick={setSelectedStamp} />
      </main>
      <SiteFooter />
      <BackToTop />
      {selectedStamp && (
        <StampModal
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
          previousStamp={prevStamp ? { thumbnailSrc: prevStamp.thumbnailSrc, alt: prevStamp.alt } : undefined}
          nextStamp={nextStamp ? { thumbnailSrc: nextStamp.thumbnailSrc, alt: nextStamp.alt } : undefined}
          onPrevious={prevStamp ? goToPrevious : undefined}
          onNext={nextStamp ? goToNext : undefined}
        />
      )}
    </>
  );
}
