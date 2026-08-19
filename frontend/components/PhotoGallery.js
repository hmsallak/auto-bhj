"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { statusLabel } from "../lib/format";

const THUMB_LIMIT = 4;

function CameraIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function ZoomIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function ChevronIcon({ direction = "left", ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function PhotoGallery({ images, alt, status }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reserved = status === "reserved";
  const photos = images.length ? images : [null];
  const active = photos[activeIndex] || photos[0];
  const visibleThumbs = photos.slice(0, THUMB_LIMIT);
  const hasMore = photos.length > THUMB_LIMIT;

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(event) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % photos.length);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, photos.length]);

  return (
    <div className="gallery">
      <div className={`gallery-main ${reserved ? "is-reserved" : ""}`}>
        {active ? (
          <Image
            src={active}
            alt={alt}
            width={960}
            height={720}
            sizes="(max-width: 820px) 100vw, 56vw"
            priority
            unoptimized
          />
        ) : (
          <div className="detail-media-placeholder">Pas de photo</div>
        )}
        <span className={`status ${reserved ? "reserved" : "available"}`}>
          {statusLabel(status)}
        </span>
        {active && (
          <button
            type="button"
            className="gallery-zoom-button"
            aria-label="Voir en plein ecran"
            onClick={() => setLightboxOpen(true)}
          >
            <ZoomIcon />
          </button>
        )}
      </div>

      {visibleThumbs.length > 1 && (
        <div className="gallery-thumbs">
          {visibleThumbs.map((src, index) => {
            const isLastVisible = index === THUMB_LIMIT - 1 && hasMore;
            return (
              <button
                key={src}
                type="button"
                className={`gallery-thumb ${isLastVisible ? "has-more" : ""}`}
                onClick={() => {
                  setActiveIndex(index);
                  if (isLastVisible) setLightboxOpen(true);
                }}
              >
                <Image
                  src={src}
                  alt={`${alt} - photo ${index + 1}`}
                  width={220}
                  height={165}
                  sizes="180px"
                  unoptimized
                />
                {isLastVisible && (
                  <span className="gallery-thumb-more">
                    {photos.length} <CameraIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {lightboxOpen && active && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={alt}>
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Fermer"
            onClick={() => setLightboxOpen(false)}
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            className="gallery-lightbox-backdrop"
            aria-label="Fermer"
            onClick={() => setLightboxOpen(false)}
          />

          {photos.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox-nav prev"
              aria-label="Photo precedente"
              onClick={() => setActiveIndex((index) => (index - 1 + photos.length) % photos.length)}
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          <Image
            src={active}
            alt={alt}
            width={1600}
            height={1200}
            sizes="100vw"
            unoptimized
            className="gallery-lightbox-image"
          />

          {photos.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox-nav next"
              aria-label="Photo suivante"
              onClick={() => setActiveIndex((index) => (index + 1) % photos.length)}
            >
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
