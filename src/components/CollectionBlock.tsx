"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CollectionBlock.module.css";

interface CollectionItem {
  id: string;
  src: string;
  alt: string;
  href?: string;
}

interface CollectionBlockProps {
  title: string;
  items: CollectionItem[];
}

const ITEM_WIDTH = 150;

export default function CollectionBlock({ title, items }: CollectionBlockProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleCount = containerWidth > 0
    ? Math.floor(containerWidth / ITEM_WIDTH)
    : 5;
  const hasOverflow = items.length > visibleCount;
  const isCarousel = hasOverflow;
  const fullWidth = visibleCount * ITEM_WIDTH;
  const itemWidth = ITEM_WIDTH;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setScrollProgress(el.scrollLeft / maxScroll);
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    if (!isCarousel) return;
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [isCarousel, updateScrollState]);

  function handleScrollbarDrag(clientX: number) {
    const track = trackRef.current;
    const el = scrollRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left - thumbWidth / 2) / (rect.width - thumbWidth)));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScroll;
  }

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: MouseEvent) {
      e.preventDefault();
      handleScrollbarDrag(e.clientX);
    }
    function onUp() {
      setDragging(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  function scrollBy(direction: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * itemWidth * 3, behavior: "smooth" });
  }

  const trackWidth = fullWidth || containerWidth || 300;
  const thumbWidth = Math.max(40, trackWidth * 0.2);
  const thumbLeft = scrollProgress * (trackWidth - thumbWidth);

  return (
    <div ref={containerRef}>
      <div
        className={`${styles.header} ${isDesktop ? styles.headerDesktop : styles.headerMobile}`}
        style={{ maxWidth: isCarousel && isDesktop ? fullWidth + ITEM_WIDTH * 0.5 : undefined }}
      >
        <h2 className={`${styles.title} ${isDesktop ? styles.titleDesktop : styles.titleMobile}`}>
          {title}
        </h2>
        {isCarousel && (
          <div className={styles.arrowGroup}>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              className={`${styles.arrowButton} ${canScrollLeft ? styles.arrowButtonEnabled : styles.arrowButtonDisabled}`}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              className={`${styles.arrowButton} ${canScrollRight ? styles.arrowButtonEnabled : styles.arrowButtonDisabled}`}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div
        onMouseEnter={() => setCarouselHovered(true)}
        onMouseLeave={() => setCarouselHovered(false)}
      >
        <div
          ref={scrollRef}
          className={`${styles.scrollContainer} ${styles.scrollContainerHidden}`}
          onWheel={(e) => {
            if (!isCarousel) return;
            e.preventDefault();
            const el = scrollRef.current;
            if (el) el.scrollLeft += e.deltaX || e.deltaY;
          }}
          style={{
            overflowX: isCarousel ? (isDesktop ? "hidden" : "auto") : "visible",
            maxWidth: isCarousel && isDesktop ? fullWidth + ITEM_WIDTH * 0.5 : undefined,
          }}
        >
          {items.map((item) => (
            <CollectionThumbnail key={item.id} item={item} width={itemWidth} />
          ))}
        </div>

        {isCarousel && (
          <div
            ref={trackRef}
            className={styles.scrollTrack}
            onMouseDown={(e) => {
              setDragging(true);
              handleScrollbarDrag(e.clientX);
            }}
            style={{
              width: trackWidth,
              backgroundColor: carouselHovered || dragging ? "rgba(94, 90, 75, 0.2)" : "transparent",
            }}
          >
            <div
              className={styles.scrollThumb}
              style={{
                left: thumbLeft,
                width: thumbWidth,
                transition: dragging ? "none" : "left 0.1s ease",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const STAMP_BORDER = `url("data:image/svg+xml,%3Csvg width='400' height='533' viewBox='0 0 400 533' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.2914 0.373705H0V13.3456C0.19034 13.3456 0.380681 13.3145 0.571022 13.3145C8.45428 13.3145 14.8465 19.5902 14.8465 27.3297C14.8465 35.0692 8.45428 41.345 0.571022 41.345C0.380681 41.345 0.19034 41.3293 0 41.3138V53.1178C7.88326 53.1178 14.2755 59.3935 14.2755 67.133C14.2755 74.8726 7.88326 81.1483 0 81.1483V92.9211C7.88326 92.9211 14.2755 99.1968 14.2755 106.936C14.2755 114.676 7.88326 120.952 0 120.952V132.724C7.88326 132.724 14.2755 139 14.2755 146.74C14.2755 154.479 7.88326 160.755 0 160.755V172.528C7.88326 172.528 14.2755 178.803 14.2755 186.543C14.2755 194.282 7.88326 200.558 0 200.558V212.331C7.88326 212.331 14.2755 218.607 14.2755 226.346C14.2755 234.086 7.88326 240.362 0 240.362V252.134C7.88326 252.134 14.2755 258.41 14.2755 266.15C14.2755 273.889 7.88326 280.165 0 280.165V291.938C7.88326 291.938 14.2755 298.213 14.2755 305.953C14.2755 313.692 7.88326 319.968 0 319.968V331.741C7.88326 331.741 14.2755 338.017 14.2755 345.756C14.2755 353.496 7.88326 359.771 0 359.771V371.544C7.88326 371.544 14.2755 377.82 14.2755 385.56C14.2755 393.299 7.88326 399.575 0 399.575V411.348C7.88326 411.348 14.2755 417.623 14.2755 425.363C14.2755 433.102 7.88326 439.378 0 439.378V451.151C7.88326 451.151 14.2755 457.427 14.2755 465.166C14.2755 472.906 7.88326 479.181 0 479.181V490.954C7.88326 490.954 14.2755 497.23 14.2755 504.97C14.2755 512.709 7.88326 518.985 0 518.985V533H14.2914C14.2914 532.907 14.2914 532.813 14.2914 532.72C14.2914 524.98 20.6836 518.704 28.5669 518.704C36.4502 518.704 42.8424 524.98 42.8424 532.72C42.8424 532.813 42.8424 532.907 42.8424 533H57.1179C57.1179 532.907 57.1179 532.813 57.1179 532.72C57.1179 524.98 63.5102 518.704 71.3935 518.704C79.2767 518.704 85.669 524.98 85.669 532.72C85.669 532.813 85.669 532.907 85.669 533H99.9445C99.9445 532.907 99.9445 532.813 99.9445 532.72C99.9445 524.98 106.337 518.704 114.22 518.704C122.103 518.704 128.496 524.98 128.496 532.72C128.496 532.813 128.496 532.907 128.496 533H142.771C142.771 532.907 142.771 532.813 142.771 532.72C142.771 524.98 149.163 518.704 157.047 518.704C164.93 518.704 171.322 524.98 171.322 532.72C171.322 532.813 171.322 532.907 171.322 533H185.598C185.598 532.907 185.598 532.813 185.598 532.72C185.598 524.98 191.99 518.704 199.873 518.704C207.756 518.704 214.149 524.98 214.149 532.72C214.149 532.813 214.149 532.907 214.149 533H228.424C228.424 532.907 228.424 532.813 228.424 532.72C228.424 524.98 234.816 518.704 242.7 518.704C250.583 518.704 256.975 524.98 256.975 532.72C256.975 532.813 256.975 532.907 256.975 533H271.251C271.251 532.907 271.251 532.813 271.251 532.72C271.251 524.98 277.643 518.704 285.526 518.704C293.409 518.704 299.802 524.98 299.802 532.72C299.802 532.813 299.802 532.907 299.802 533H314.077C314.077 532.907 314.077 532.813 314.077 532.72C314.077 524.98 320.469 518.704 328.353 518.704C336.236 518.704 342.628 524.98 342.628 532.72C342.628 532.813 342.628 532.907 342.628 533H356.904C357.062 525.385 363.375 519.265 371.163 519.265C378.952 519.265 385.264 525.385 385.423 533H400V518.969C399.905 518.969 399.81 518.969 399.715 518.969C391.831 518.969 385.439 512.693 385.439 504.954C385.439 497.214 391.831 490.939 399.715 490.939C399.81 490.939 399.905 490.939 400 490.939V479.135C399.905 479.135 399.81 479.135 399.715 479.135C391.831 479.135 385.439 472.859 385.439 465.119C385.439 457.38 391.831 451.104 399.715 451.104C399.81 451.104 399.905 451.104 400 451.104V439.3C399.905 439.3 399.81 439.3 399.715 439.3C391.831 439.3 385.439 433.025 385.439 425.285C385.439 417.545 391.831 411.27 399.715 411.27C399.81 411.27 399.905 411.27 400 411.27V399.466C399.905 399.466 399.81 399.466 399.715 399.466C391.831 399.466 385.439 393.19 385.439 385.451C385.439 377.711 391.831 371.435 399.715 371.435C399.81 371.435 399.905 371.435 400 371.435V359.631C399.905 359.631 399.81 359.631 399.715 359.631C391.831 359.631 385.439 353.356 385.439 345.616C385.439 337.877 391.831 331.601 399.715 331.601C399.81 331.601 399.905 331.601 400 331.601V319.797C399.905 319.797 399.81 319.797 399.715 319.797C391.831 319.797 385.439 313.521 385.439 305.782C385.439 298.042 391.831 291.766 399.715 291.766C399.81 291.766 399.905 291.766 400 291.766V279.962C399.905 279.962 399.81 279.962 399.715 279.962C391.831 279.962 385.439 273.687 385.439 265.947C385.439 258.208 391.831 251.932 399.715 251.932C399.81 251.932 399.905 251.932 400 251.932V240.128C399.905 240.128 399.81 240.128 399.715 240.128C391.831 240.128 385.439 233.852 385.439 226.113C385.439 218.373 391.831 212.097 399.715 212.097C399.81 212.097 399.905 212.097 400 212.097V200.294C399.905 200.294 399.81 200.294 399.715 200.294C391.831 200.294 385.439 194.018 385.439 186.278C385.439 178.539 391.831 172.263 399.715 172.263C399.81 172.263 399.905 172.263 400 172.263V160.459C399.905 160.459 399.81 160.459 399.715 160.459C391.831 160.459 385.439 154.183 385.439 146.444C385.439 138.704 391.831 132.429 399.715 132.429C399.81 132.429 399.905 132.429 400 132.429V120.625C399.905 120.625 399.81 120.625 399.715 120.625C391.831 120.625 385.439 114.349 385.439 106.609C385.439 98.8697 391.831 92.594 399.715 92.594C399.81 92.594 399.905 92.594 400 92.594V80.7902C399.905 80.7902 399.81 80.7902 399.715 80.7902C391.831 80.7902 385.439 74.5144 385.439 66.7749C385.439 59.0354 391.831 52.7597 399.715 52.7597C399.81 52.7597 399.905 52.7597 400 52.7597V40.9557C392.244 40.7999 386.01 34.6021 386.01 26.956C386.01 19.3099 392.244 13.1121 400 12.9563V0H385.423C385.423 0.093435 385.423 0.18687 385.423 0.280305C385.423 8.01984 379.031 14.2956 371.148 14.2956C363.264 14.2956 356.872 8.01984 356.872 0.280305C356.872 0.18687 356.872 0.093435 356.872 0H342.597C342.438 7.61495 336.125 13.7349 328.337 13.7349C320.549 13.7349 314.236 7.61495 314.077 0H299.802C299.643 7.61495 293.33 13.7349 285.542 13.7349C277.754 13.7349 271.441 7.61495 271.282 0H257.007C256.848 7.61495 250.535 13.7349 242.747 13.7349C234.959 13.7349 228.646 7.61495 228.488 0H214.212C214.053 7.61495 207.741 13.7349 199.952 13.7349C192.164 13.7349 185.851 7.61495 185.693 0H171.417C171.259 7.61495 164.946 13.7349 157.158 13.7349C149.37 13.7349 143.057 7.61495 142.898 0H128.622C128.464 7.61495 122.151 13.7349 114.363 13.7349C106.575 13.7349 100.262 7.61495 100.103 0H85.8276C85.669 7.61495 79.356 13.7349 71.5679 13.7349C63.7798 13.7349 57.4669 7.61495 57.3083 0H43.0327C42.8741 7.61495 36.5612 13.7349 28.7731 13.7349C20.985 13.7349 14.6721 7.61495 14.5134 0L14.2914 0.373705ZM371.163 28.4042V504.923H28.551V28.4042H371.163Z' fill='%23958D6F'/%3E%3Cpath d='M27.2527 27.1874H376.703V505.988H27.2527V27.1874Z' fill='%23958D6F'/%3E%3C/svg%3E")`;

function CollectionThumbnail({ item, width = ITEM_WIDTH }: { item: CollectionItem; width?: number }) {
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showHover = hovered && isDesktop;

  return (
    <div
      className={styles.thumbWrap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width }}
    >
      {isDesktop && (
        <div
          className={styles.thumbBorder}
          style={{
            backgroundImage: STAMP_BORDER,
            opacity: showHover ? 1 : 0,
          }}
        />
      )}
      <div
        className={styles.thumbImageWrap}
        style={{
          top: showHover ? "5.1%" : 0,
          left: showHover ? "6.8%" : 0,
          right: showHover ? "5.8%" : 0,
          bottom: showHover ? "5.1%" : 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          className={styles.thumbImage}
        />
      </div>
    </div>
  );
}
