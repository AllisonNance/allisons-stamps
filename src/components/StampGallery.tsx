"use client";

import { useState } from "react";
import StampThumbnail from "./StampThumbnail";
import Pagination from "./Pagination";
import type { GalleryItem } from "./HomePageClient";
import styles from "./StampGallery.module.css";

interface StampGalleryProps {
  items: GalleryItem[];
  columnsLarge?: number;
  columnsSmall?: number;
  itemsPerPage?: number;
  onStampClick?: (item: GalleryItem) => void;
}

export default function StampGallery({
  items,
  itemsPerPage = 100,
  onStampClick,
}: StampGalleryProps) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = items.slice(start, start + itemsPerPage);

  return (
    <div className={styles.container}>
      <div data-stamp-gallery className={styles.grid}>
        {pageItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onStampClick?.(item)}
            aria-label={`View ${item.name}`}
            className={styles.stampButton}
          >
            <StampThumbnail
              src={item.thumbnailSrc}
              alt={item.alt}
            />
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrap}>
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
