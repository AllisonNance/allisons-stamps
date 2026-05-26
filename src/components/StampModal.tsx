"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  color = "#ffffff",
}: {
  direction: "previous" | "next";
  stamp: NavStamp;
  onClick: () => void;
  color?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isPrev ? "Previous stamp" : "Next stamp"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        color,
        padding: 0,
        flexDirection: isPrev ? "row" : "row-reverse",
      }}
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
      <span style={{
        fontSize: 14,
        flexShrink: 0,
        textDecoration: hovered ? "underline" : "none",
      }}>
        {isPrev ? "Previous" : "Next"}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={stamp.thumbnailSrc}
        alt={stamp.alt}
        style={{
          width: 50,
          height: "auto",
          display: "block",
        }}
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

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgb(55, 55, 55)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(50, 48, 40, 0.6)"}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        background: "rgba(50, 48, 40, 0.6)",
        border: "none",
        cursor: "pointer",
        color: "#ffffff",
        zIndex: 10,
        padding: 8,
        transition: "background 0.15s ease",
      }}
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
  );

  const navBar = (previousStamp || nextStamp) ? (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        paddingTop: 16,
      }}
    >
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
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {closeButton}

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#1a1a1a",
            zIndex: 1,
            overflow: "hidden",
          }}
        >

          {/* Image — centered vertically */}
          <div
            style={{
              flexShrink: 0,
              height: "100%",
              aspectRatio: "3 / 4",
              backgroundColor: "#e8e4dc",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Right panel — centered vertically */}
          <div
            style={{
              flex: "0 1 675px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "72px 40px 40px",
              color: "#ffffff",
              overflow: "hidden",
            }}
          >
            <h1
              id="stamp-modal-title"
              style={{
                fontSize: "2.5rem",
                fontWeight: 300,
                margin: "0 0 28px",
                lineHeight: 1.3,
                flexShrink: 0,
              }}
            >
              {title}
            </h1>

            <dl
              aria-label="Stamp details"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 40,
                flexShrink: 0,
                margin: "0 0 40px",
              }}
            >
              {details.map((d) => (
                <div key={d.label} style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                  <dt style={{ fontWeight: 600, display: "inline" }}>{d.label}:</dt>{" "}
                  <dd style={{ opacity: 0.85, display: "inline", margin: 0 }}>{d.value}</dd>
                </div>
              ))}
            </dl>

            {/* Description — custom scrollbar */}
            {description && (
              <div
                style={{
                  position: "relative",
                  marginBottom: 24,
                  minHeight: 0,
                  flex: "1 1 0",
                }}
                onMouseEnter={() => setDescHovered(true)}
                onMouseLeave={() => setDescHovered(false)}
              >
                <div
                  ref={descRef}
                  data-desc-scroll
                  tabIndex={0}
                  role="region"
                  aria-label="Stamp description"
                  style={{
                    position: "absolute",
                    inset: 0,
                    fontSize: "1.15rem",
                    lineHeight: "1.85rem",
                    opacity: 0.85,
                    overflowY: "auto",
                    paddingRight: descHasOverflow ? 40 : 0,
                  }}
                >
                  <style>{`
                    [data-desc-scroll]::-webkit-scrollbar { display: none; }
                    [data-desc-scroll] { scrollbar-width: none; }
                  `}</style>
                  {description.split("\n\n").map((p, i) => (
                    <p key={i} style={{ margin: i === 0 ? 0 : "16px 0 0" }}>{p}</p>
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
                      onMouseDown={(e) => {
                        setDescDragging(true);
                        handleDescScrollbarDrag(e.clientY);
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 8,
                        height: trackHeight,
                        backgroundColor: descHovered || descDragging ? "rgba(94, 90, 75, 0.2)" : "transparent",
                        cursor: "pointer",
                        borderRadius: 9999,
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: thumbTop,
                          width: 8,
                          height: thumbHeight,
                          backgroundColor: "#5E5A4B",
                          borderRadius: 9999,
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
  const mobileCloseButton = (
    <button
      type="button"
      onClick={onClose}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgb(55, 55, 55)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(50, 48, 40, 0.6)"}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "rgba(50, 48, 40, 0.6)",
        border: "none",
        cursor: "pointer",
        color: "#ffffff",
        zIndex: 1002,
        padding: 8,
        transition: "background 0.15s ease",
      }}
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
  );

  return (
    <div
      ref={(node) => {
        mobileScrollRef.current = node;
        (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stamp-modal-title-mobile"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "#1a1a1a",
        overflowY: "auto",
        color: "#ffffff",
      }}
    >
      {mobileCloseButton}

      {/* Image — flush top/left/right */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3 / 4",
          backgroundColor: "#e8e4dc",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {(previousStamp || nextStamp) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 16px 0",
          }}
        >
          <div>{previousStamp && onPrevious && (
            <NavButton direction="previous" stamp={previousStamp} onClick={onPrevious} />
          )}</div>
          <div>{nextStamp && onNext && (
            <NavButton direction="next" stamp={nextStamp} onClick={onNext} />
          )}</div>
        </div>
      )}

      <div style={{ padding: "24px 16px 40px" }}>
        <h1
          id="stamp-modal-title-mobile"
          style={{
            fontSize: 36,
            fontWeight: 300,
            margin: "0 0 24px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>

        <dl
          aria-label="Stamp details"
          style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}
        >
          {details.map((d) => (
            <div key={d.label} style={{ fontSize: "1rem", lineHeight: 1.5 }}>
              <dt style={{ fontWeight: 600, display: "inline" }}>{d.label}:</dt>{" "}
              <dd style={{ opacity: 0.85, display: "inline", margin: 0 }}>{d.value}</dd>
            </div>
          ))}
        </dl>

        {description && (
          <div
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.85rem",
              opacity: 0.85,
              marginBottom: 32,
            }}
          >
            {description.split("\n\n").map((p, i) => (
              <p key={i} style={{ margin: i === 0 ? 0 : "16px 0 0" }}>{p}</p>
            ))}
          </div>
        )}

        {navBar}
      </div>
    </div>
  );
}
