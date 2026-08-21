"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const SWIPE_THRESHOLD = 40;

export default function PhotoGallery({ images, alt, status }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reserved = status === "reserved";
  const sold = status === "sold";
  const photos = images.length ? images : [null];
  const active = photos[activeIndex] || photos[0];
  const visibleThumbs = photos.slice(0, THUMB_LIMIT);
  const hasMore = photos.length > THUMB_LIMIT;
  const touchStartX = useRef(null);

  function showPrev() {
    setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % photos.length);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD || photos.length < 2) return;
    if (delta < 0) showNext();
    else showPrev();
  }

  useEffect(() => {
    if (!lightboxOpen || sold) return;

    function handleKey(event) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, photos.length]);

  useEffect(() => {
    if (!lightboxOpen || sold) return;

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [lightboxOpen, sold]);

  const lightbox =
    lightboxOpen && active && !sold ? (
      <div
        className="gallery-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
            onClick={showPrev}
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        <div className="gallery-lightbox-stage">
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
            <div className="gallery-lightbox-thumbs" aria-label="Toutes les photos">
              {photos.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  className={`gallery-lightbox-thumb ${index === activeIndex ? "is-active" : ""}`}
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={src}
                    alt={`${alt} - photo ${index + 1}`}
                    width={120}
                    height={90}
                    sizes="96px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <button type="button" className="gallery-lightbox-nav next" aria-label="Photo suivante" onClick={showNext}>
            <ChevronIcon direction="right" />
          </button>
        )}

        {photos.length > 1 && (
          <span className="gallery-lightbox-counter">
            {activeIndex + 1} / {photos.length}
          </span>
        )}
      </div>
    ) : null;

  return (
    <div className="gallery">
      <div className={`gallery-main ${reserved ? "is-reserved" : ""} ${sold ? "is-sold" : ""}`}>
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
        {sold && (
          <div className="gallery-sold-overlay">Vehicule vendu
            <br />Photos non disponibles</div>
        )}
        <span className={`status ${status}`}>{statusLabel(status)}</span>
        {active && !sold && (
          <button
            type="button"
            className="gallery-zoom-button"
            aria-label="Voir toutes les photos en plein ecran"
            onClick={() => setLightboxOpen(true)}
          >
            <ZoomIcon />
            {photos.length > 1 && <span className="gallery-zoom-count">{photos.length}</span>}
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
                className={`gallery-thumb ${isLastVisible ? "has-more" : ""} ${sold ? "is-sold" : ""}`}
                onClick={() => {
                  setActiveIndex(index);
                  if (isLastVisible && !sold) setLightboxOpen(true);
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

      {lightbox && typeof document !== "undefined" ? createPortal(lightbox, document.body) : null}
    </div>
  );
}
