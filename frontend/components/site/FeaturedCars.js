"use client";

import Image from "next/image";
import { useRef } from "react";
import { formatPrice, formatKm, statusLabel, carImage } from "../../lib/format";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export default function FeaturedCars({ cars }) {
  const trackRef = useRef(null);

  function scrollByCards(direction) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".floating-card");
    const amount = (card?.offsetWidth || 300) + 20;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  if (!cars.length) return null;

  return (
    <section className="section reveal featured-section" aria-label="Voitures en vedette">
      <div className="section-head">
        <div>
          <p className="eyebrow">Selection</p>
          <h2>Nos dernieres arrivees</h2>
        </div>
        <div className="featured-controls">
          <button
            type="button"
            className="featured-nav-button"
            aria-label="Voitures precedentes"
            onClick={() => scrollByCards(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className="featured-nav-button"
            aria-label="Voitures suivantes"
            onClick={() => scrollByCards(1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div className="featured-track" ref={trackRef}>
        {cars.map((car) => {
          const reserved = car.status === "reserved";
          return (
            <a key={car.id} href={`/cars/${car.reference}`} className="floating-card">
              <div className="floating-card-media">
                <Image
                  src={carImage(car)}
                  alt={`${car.brand} ${car.model}`}
                  width={360}
                  height={270}
                  sizes="300px"
                  unoptimized
                />
                <span className={`status ${reserved ? "reserved" : "available"}`}>
                  {statusLabel(car.status)}
                </span>
              </div>
              <div className="floating-card-body">
                <span className="floating-card-title">
                  {car.brand} {car.model}
                </span>
                <span className="floating-card-specs">
                  {car.year} - {formatKm(car.mileage)}
                </span>
                <span className="floating-card-price">{formatPrice(car.price)}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
