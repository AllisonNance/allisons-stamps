"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./StampModal.module.css";

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector));
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length > 0) focusable[0].focus();
    });

    root.addEventListener("keydown", handleKeyDown);
    return () => {
      root.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, ref]);
}

interface StampDetail {
  label: string;
  value: string;
}

interface NavStamp {
  thumbnailSrc: string;
  alt: string;
}

interface StampModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title: string;
  details: StampDetail[];
  description?: string;
  previousStamp?: NavStamp;
  nextStamp?: NavStamp;
  onPrevious?: () => void;
  onNext?: () => void;
}

function NavButton({
  direction,
  stamp,
  onClick,
}: {
  direction: "previous" | "next";
  stamp: NavStamp;
  onClick: () => void;
}) {
  const isPrev = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous stamp" : "Next stamp"}
      className={`${styles.navButton} ${!isPrev ? styles.navButtonReverse : ""}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ transform: isPrev ? "none" : "rotate(180deg)", flexShrink: 0 }}
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.navLabel}>
        {isPrev ? "Previous" : "Next"}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={stamp.thumbnailSrc}
        alt={stamp.alt}
        className={styles.navThumb}
      />
    </button>
  );
}

export default function StampModal({
  open,
  onClose,
  imageSrc,
  imageAlt,
  title,
  details,
  description,
  previousStamp,
  nextStamp,
  onPrevious,
  onNext,
}: StampModalProps) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const descTrackRef = useRef<HTMLDivElement>(null);
  const [descScrollProgress, setDescScrollProgress] = useState(0);
  const [descHasOverflow, setDescHasOverflow] = useState(false);
  const [descHovered, setDescHovered] = useState(false);
  const [descDragging, setDescDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && mobileScrollRef.current) {
      mobileScrollRef.current.scrollTop = 0;
    }
  }, [open, title]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrevious) onPrevious();
      if (e.key === "ArrowRight" && onNext) onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, onPrevious, onNext]);

  const updateDescScroll = useCallback(() => {
    const el = descRef.current;
    if (!el) return;
    const hasOv = el.scrollHeight > el.clientHeight;
    setDescHasOverflow(hasOv);
    if (!hasOv) { setDescScrollProgress(0); return; }
    const maxScroll = el.scrollHeight - el.clientHeight;
    setDescScrollProgress(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }, []);

  useEffect(() => {
    if (!open || !description) return;
    const el = descRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => updateDescScroll()));
    el.addEventListener("scroll", updateDescScroll);
    const observer = new ResizeObserver(() => updateDescScroll());
    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", updateDescScroll);
      observer.disconnect();
    };
  }, [open, description, title, updateDescScroll]);

  function handleDescScrollbarDrag(clientY: number) {
    const track = descTrackRef.current;
    const el = descRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const trackHeight = rect.height;
    const thumbHeight = Math.max(30, trackHeight * (el.clientHeight / el.scrollHeight));
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top - thumbHeight / 2) / (trackHeight - thumbHeight)));
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  }

  useEffect(() => {
    if (!descDragging) return;
    function onMove(e: MouseEvent) {
      e.preventDefault();
      handleDescScrollbarDrag(e.clientY);
    }
    function onUp() { setDescDragging(false); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [descDragging]);

  useFocusTrap(modalRef, open);

  if (!open) return null;

  const navBar = (previousStamp || nextStamp) ? (
    <div className={styles.navBar}>
      <div>{previousStamp && onPrevious && (
        <NavButton direction="previous" stamp={previousStamp} onClick={onPrevious} />
      )}</div>
      <div>{nextStamp && onNext && (
        <NavButton direction="next" stamp={nextStamp} onClick={onNext} />
      )}</div>
    </div>
  ) : null;

  if (isDesktop) {
    return (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stamp-modal-title"
        className={styles.backdrop}
      >
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles.desktopContainer}>
          {/* Image — centered vertically */}
          <div className={styles.imagePanel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className={styles.stampImage}
            />
          </div>

          {/* Right panel — centered vertically */}
          <div className={styles.infoPanel}>
            <h1 id="stamp-modal-title" className={styles.title}>
              {title}
            </h1>

            <dl aria-label="Stamp details" className={styles.detailsList}>
              {details.map((d) => (
                <div key={d.label} className={styles.detailRow}>
                  <dt className={styles.detailLabel}>{d.label}:</dt>{" "}
                  <dd className={styles.detailValue}>{d.value}</dd>
                </div>
              ))}
            </dl>

            {/* Description — custom scrollbar */}
            {description && (
              <div
                className={styles.descriptionWrap}
                onMouseEnter={() => setDescHovered(true)}
                onMouseLeave={() => setDescHovered(false)}
              >
                <div
                  ref={descRef}
                  tabIndex={0}
                  role="region"
                  aria-label="Stamp description"
                  className={styles.descriptionScroll}
                  style={{ paddingRight: descHasOverflow ? 40 : 0 }}
                >
                  {description.split("\n\n").map((p, i) => (
                    <p key={i} className={styles.descParagraph}>{p}</p>
                  ))}
                </div>
                {descHasOverflow && (() => {
                  const el = descRef.current;
                  if (!el) return null;
                  const trackHeight = el.clientHeight;
                  const thumbRatio = el.clientHeight / el.scrollHeight;
                  const thumbHeight = Math.max(30, trackHeight * thumbRatio);
                  const thumbTop = descScrollProgress * (trackHeight - thumbHeight);
                  return (
                    <div
                      ref={descTrackRef}
                      className={styles.scrollTrack}
                      onMouseDown={(e) => {
                        setDescDragging(true);
                        handleDescScrollbarDrag(e.clientY);
                      }}
                      style={{
                        height: trackHeight,
                        backgroundColor: descHovered || descDragging ? "rgba(94, 90, 75, 0.2)" : "transparent",
                      }}
                    >
                      <div
                        className={styles.scrollThumb}
                        style={{
                          top: thumbTop,
                          height: thumbHeight,
                          transition: descDragging ? "none" : "top 0.1s ease",
                        }}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {navBar}
          </div>
        </div>
      </div>
    );
  }

  // Mobile / Tablet
  return (
    <div
      ref={(node) => {
        mobileScrollRef.current = node;
        (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stamp-modal-title-mobile"
      className={styles.mobileDialog}
    >
      <button
        type="button"
        onClick={onClose}
        className={styles.mobileCloseButton}
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Image — flush top/left/right */}
      <div className={styles.mobileImageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.mobileStampImage}
        />
      </div>

      {(previousStamp || nextStamp) && (
        <div className={styles.mobileNav}>
          <div>{previousStamp && onPrevious && (
            <NavButton direction="previous" stamp={previousStamp} onClick={onPrevious} />
          )}</div>
          <div>{nextStamp && onNext && (
            <NavButton direction="next" stamp={nextStamp} onClick={onNext} />
          )}</div>
        </div>
      )}

      <div className={styles.mobileContent}>
        <h1 id="stamp-modal-title-mobile" className={styles.mobileTitle}>
          {title}
        </h1>

        <dl aria-label="Stamp details" className={styles.mobileDetailsList}>
          {details.map((d) => (
            <div key={d.label} className={styles.detailRow}>
              <dt className={styles.detailLabel}>{d.label}:</dt>{" "}
              <dd className={styles.detailValue}>{d.value}</dd>
            </div>
          ))}
        </dl>

        {description && (
          <div className={styles.mobileDescription}>
            {description.split("\n\n").map((p, i) => (
              <p key={i} className={styles.descParagraph}>{p}</p>
            ))}
          </div>
        )}

        {navBar}
      </div>
    </div>
  );
}
