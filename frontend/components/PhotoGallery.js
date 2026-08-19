"use client";

import Image from "next/image";
import { useState } from "react";
import { statusLabel } from "../lib/format";

export default function PhotoGallery({ images, alt, status }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reserved = status === "reserved";
  const photos = images.length ? images : [null];
  const active = photos[activeIndex] || photos[0];

  return (
    <div>
      <div className={`detail-media ${reserved ? "is-reserved" : ""}`}>
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
      </div>

      {photos.length > 1 && (
        <div className="gallery-thumbs">
          {photos.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`gallery-thumb ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={src}
                alt={`${alt} - photo ${index + 1}`}
                width={144}
                height={108}
                sizes="96px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
