import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatKm, carPriceLabel, statusLabel } from "../../../../lib/format";
import PhotoGallery from "../../../../components/PhotoGallery";
import CarSpecSheet, { SpecHighlights } from "../../../../components/CarSpecSheet";
import VehicleActions from "../../../../components/VehicleActions";
import VehicleAppointmentForm from "../../../../components/VehicleAppointmentForm";
import VehicleShareActions from "../../../../components/VehicleShareActions";
import VehicleStickyBar from "../../../../components/VehicleStickyBar";
import VehicleViewTracker from "../../../../components/VehicleViewTracker";
import { InfoIcon, ChevronDownIcon, PinIcon } from "../../../../components/home/icons";

const GARAGE_ADDRESS = "Mekingenweg 99, 1600 Sint-Pieters-Leeuw";
const GARAGE_MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  GARAGE_ADDRESS
)}`;

// A car's status/price/description can change (or the car can be sold and
// removed) at any time from the admin, so always fetch fresh data.
export const dynamic = "force-dynamic";

function titleFor(car) {
  const price = carPriceLabel(car);
  const suffix = price ? ` - ${price}` : "";
  return `${car.brand} ${car.model} ${car.year} ${car.fuel} a vendre${suffix} - Auto BHJ`;
}

export async function generateMetadata({ params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);
  if (!car) return {};

  const title = titleFor(car);
  const description = `${car.brand} ${car.model} ${car.year}, ${formatKm(car.mileage)}, ${car.gearbox}, reference ${car.reference}. Disponible chez Auto BHJ a Sint-Pieters-Leeuw.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.imageUrl ? [{ url: car.imageUrl }] : [],
    },
  };
}

export default async function CarDetailPage({ params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);
  if (!car) notFound();
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  // Sous-titre type "1,2 Essence" : cylindree en litres (cm3 / 1000) + carburant.
  const engineLiters = car.engineCc ? (car.engineCc / 1000).toFixed(1).replace(".", ",") : null;
  const subtitle = [engineLiters, car.fuel].filter(Boolean).join(" · ");
  const availability = sold
    ? "https://schema.org/SoldOut"
    : reserved
      ? "https://schema.org/PreOrder"
      : "https://schema.org/InStock";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.brand} ${car.model}`,
    brand: car.brand,
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuel,
    vehicleTransmission: car.gearbox,
    image: car.images?.length ? car.images : car.imageUrl ? [car.imageUrl] : undefined,
    // Sold vehicles have no price left to advertise - omit the offer's
    // price entirely rather than publish 0 as if it were real data.
    offers: {
      "@type": "Offer",
      ...(sold ? {} : { price: car.price }),
      priceCurrency: "EUR",
      availability,
      seller: {
        "@type": "AutoDealer",
        name: "Auto BHJ",
        address: "Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique",
      },
    },
  };

  // Escape "<" so an admin-entered field (e.g. a description containing
  // "</script>") can't break out of this inline <script> tag.
  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <VehicleViewTracker reference={car.reference} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <nav className="text-[14px] text-subtle" aria-label="Retour">
        <a
          href="/stock"
          className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-brand"
        >
          <ChevronDownIcon className="h-4 w-4 rotate-90" aria-hidden="true" />
          Retour a la liste des vehicules
        </a>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Photo : desktop colonne 1 / ligne 1 */}
        <div className="lg:col-start-1 lg:row-start-1">
          <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />
        </div>

        {/* Identite + contact : desktop colonne 2. En mobile, ce bloc passe
            juste sous la photo, avant le cadre specs. */}
        <aside
          className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1"
          aria-label="Prix et contact"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1
                className="min-w-0 flex-1 text-ink"
                style={{
                  fontSize: "clamp(24px, 6vw, 42px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxWidth: "none",
                }}
              >
                {car.brand} {car.model}
              </h1>
              <VehicleShareActions title={`${car.brand} ${car.model}`} />
            </div>
            {subtitle && <p className="text-[15px] text-subtle">{subtitle}</p>}
          </div>

          {carPriceLabel(car) && (
            <p className="text-3xl font-extrabold text-brand-dark">{carPriceLabel(car)}</p>
          )}

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sage/10 px-3 py-1 text-[13px] font-semibold text-sage">
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
            {statusLabel(car.status)}
          </span>

          {/* Sur mobile, ces actions sont deja dans la barre fixe en bas ;
              l'adresse est deplacee au-dessus du formulaire. */}
          <div className="hidden flex-col gap-3 lg:flex">
            <VehicleActions reference={car.reference} />
            <p className="flex items-center gap-2 text-[13px] text-subtle">
              <InfoIcon className="h-4 w-4 shrink-0" />
              Appel direct ou message, nous vous repondons rapidement.
            </p>
            <div className="border-t border-line pt-4 text-[13px] text-subtle">
              <p className="font-semibold text-ink">Auto BHJ</p>
              <p>Mekingenweg 99, 1600 Sint-Pieters-Leeuw</p>
              <p>Visite sur rendez-vous &middot; FR / NL</p>
            </div>
          </div>
        </aside>

        {/* Cadre specs : desktop colonne 1 / ligne 2 (sous la photo) */}
        <div className="lg:col-start-1 lg:row-start-2">
          <SpecHighlights car={car} />
        </div>
      </div>

      <div className="mt-10">
        <CarSpecSheet car={car} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Adresse + itineraire au-dessus du formulaire (mobile uniquement,
            la carte de droite couvre ce besoin sur desktop). */}
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-[13px] text-body lg:hidden">
          <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div className="leading-relaxed">
            <p className="text-[14px] font-bold text-ink">Auto BHJ</p>
            <p>{GARAGE_ADDRESS}</p>
            <p className="mt-0.5 text-subtle">Visite sur rendez-vous &middot; FR / NL</p>
            <a
              href={GARAGE_MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
            >
              <PinIcon className="h-4 w-4" />
              Voir l'itineraire
            </a>
          </div>
        </div>

        <VehicleAppointmentForm
          reference={car.reference}
          carLabel={`${car.brand} ${car.model}`}
        />

        {/* Adresse + carte : desktop uniquement, sur l'autre moitie. */}
        <aside
          className="hidden overflow-hidden rounded-xl border border-line bg-white lg:block"
          aria-label="Localisation du garage"
        >
          <a
            href={GARAGE_MAPS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            aria-label="Ouvrir la carte dans Google Maps"
          >
            <img
              src="/map-auto-bhj.png"
              alt="Plan d'acces - Auto BHJ, Mekingenweg 99, Sint-Pieters-Leeuw"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          </a>
          <div className="flex items-start gap-3 border-t border-line p-5">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div className="text-[13.5px] leading-relaxed text-body">
              <p className="text-[15px] font-bold text-ink">Auto BHJ</p>
              <p>{GARAGE_ADDRESS}</p>
              <p className="mt-1 text-[13px] text-subtle">Visite sur rendez-vous &middot; FR / NL</p>
              <a
                href={GARAGE_MAPS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
              >
                <PinIcon className="h-4 w-4" />
                Voir l'itineraire
              </a>
            </div>
          </div>
        </aside>
      </div>

      <VehicleStickyBar reference={car.reference} />
    </section>
  );
}
