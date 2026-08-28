"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { statusLabel } from "../lib/format";
import { CarIcon } from "./home/icons";

const THUMB_LIMIT = 4;

const SWIPE_THRESHOLD = 40;

const NAV_BUTTON =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white";

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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          aria-label="Fermer"
          onClick={() => setLightboxOpen(false)}
        >
          <span aria-hidden="true">×</span>
        </button>

        <button
          type="button"
          className="absolute inset-0 cursor-default"
          aria-label="Fermer"
          onClick={() => setLightboxOpen(false)}
        />

        <div className="relative flex max-h-full max-w-5xl flex-col items-center gap-4">
          <Image
            src={active}
            alt={alt}
            width={1600}
            height={1200}
            sizes="100vw"
            unoptimized
            className="max-h-[75vh] w-auto rounded-xl object-contain"
          />

          {photos.length > 1 && (
            <button
              type="button"
              className={`${NAV_BUTTON} absolute left-2 top-1/2 -translate-y-1/2`}
              aria-label="Photo precedente"
              onClick={showPrev}
            >
              <span aria-hidden="true">‹</span>
            </button>
          )}

          {photos.length > 1 && (
            <button
              type="button"
              className={`${NAV_BUTTON} absolute right-2 top-1/2 -translate-y-1/2`}
              aria-label="Photo suivante"
              onClick={showNext}
            >
              <span aria-hidden="true">›</span>
            </button>
          )}

          {photos.length > 1 && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] text-white">
              {activeIndex + 1} / {photos.length}
            </span>
          )}

          {photos.length > 1 && (
            <div className="flex max-w-full gap-2 overflow-x-auto" aria-label="Toutes les photos">
              {photos.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  className={`h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 ${
                    index === activeIndex ? "border-sage" : "border-transparent opacity-70"
                  }`}
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
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white sm:aspect-[16/10]"
        onTouchStart={active && !sold ? handleTouchStart : undefined}
        onTouchEnd={active && !sold ? handleTouchEnd : undefined}
      >
        {active ? (
          <Image
            src={active}
            alt={alt}
            width={960}
            height={720}
            sizes="(max-width: 820px) 100vw, 56vw"
            priority
            unoptimized
            onClick={!sold ? () => setLightboxOpen(true) : undefined}
            role={!sold ? "button" : undefined}
            aria-label={!sold ? "Voir toutes les photos en plein ecran" : undefined}
            className={`h-full w-full object-cover ${!sold ? "cursor-pointer" : ""} ${reserved ? "opacity-90" : ""}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[15px] text-subtle">Pas de photo</div>
        )}
        {sold && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/80 text-center text-[15px] font-semibold text-white">
            <span>Vehicule vendu</span>
            <span className="text-[13px] font-normal text-offwhite">Photos non disponibles</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[13px] font-semibold text-white">
          {statusLabel(status)}
        </span>
        {active && !sold && photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${NAV_BUTTON} absolute left-3 top-1/2 -translate-y-1/2`}
              aria-label="Photo precedente"
              onClick={showPrev}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className={`${NAV_BUTTON} absolute right-3 top-1/2 -translate-y-1/2`}
              aria-label="Photo suivante"
              onClick={showNext}
            >
              <span aria-hidden="true">›</span>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/85 px-3 py-1 text-[13px] font-medium text-white">
              {activeIndex + 1}/{photos.length}
            </span>
          </>
        )}
      </div>

      {visibleThumbs.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {visibleThumbs.map((src, index) => {
            const isLastVisible = index === THUMB_LIMIT - 1 && hasMore;
            return (
              <button
                key={src}
                type="button"
                className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border-2 ${
                  index === activeIndex ? "border-sage" : "border-transparent"
                } ${sold ? "opacity-60" : ""}`}
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
                  className="h-full w-full object-cover"
                />
                {isLastVisible && (
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/70 text-[14px] font-semibold text-white">
                    {photos.length} <CarIcon className="h-4 w-4" />
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
