"use client";

import { useState } from "react";
import StampThumbnail from "./StampThumbnail";
import Pagination from "./Pagination";
import type { GalleryItem } from "./HomePageClient";

interface StampGalleryProps {
  items: GalleryItem[];
  columnsLarge?: number;
  columnsSmall?: number;
  itemsPerPage?: number;
  onStampClick?: (item: GalleryItem) => void;
}

export default function StampGallery({
  items,
  columnsLarge = 5,
  columnsSmall = 2,
  itemsPerPage = 100,
  onStampClick,
}: StampGalleryProps) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = items.slice(start, start + itemsPerPage);

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto" }}>
      <div
        data-stamp-gallery
        style={{
          display: "grid",
          gap: 0,
          gridTemplateColumns: `repeat(${columnsSmall}, 1fr)`,
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            [data-stamp-gallery] {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (min-width: 1024px) {
            [data-stamp-gallery] {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
          @media (min-width: 1280px) {
            [data-stamp-gallery] {
              grid-template-columns: repeat(${columnsLarge}, 1fr) !important;
            }
          }
        `}</style>
        {pageItems.map((item) => (
          <div key={item.id} onClick={() => onStampClick?.(item)}>
            <StampThumbnail
              src={item.thumbnailSrc}
              alt={item.alt}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}
