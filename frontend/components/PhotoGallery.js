"use client";

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
          <img src={active} alt={alt} />
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
              <img src={src} alt={`${alt} - photo ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
