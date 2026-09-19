export function formatPrice(value) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Sold vehicles have their price wiped server-side (not just hidden), so
// there is nothing meaningful left to format - every price display should
// go through this instead of formatPrice(car.price) directly.
export function carPriceLabel(car) {
  if (!car || car.status === "sold") return null;
  return formatPrice(car.price);
}

export function formatKm(value) {
  return `${new Intl.NumberFormat("fr-BE").format(value)} km`;
}

const STATUS_LABELS = {
  available: "Disponible",
  reserved: "Reserve",
  sold: "Vendu",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || STATUS_LABELS.available;
}

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80";

// Vehicule vendu + photo injoignable (ex. photo hebergee ailleurs et retiree) :
// mieux vaut ce visuel "Vendue !" que la photo generique d'une autre voiture.
export const SOLD_PLACEHOLDER_IMAGE = "/vehicule-vendu.png";

export function carImage(car) {
  return car.imageUrl || PLACEHOLDER_IMAGE;
}

function fallbackHandler(fallbackSrc) {
  return function onError(event) {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "1";
    img.onerror = null;
    img.src = fallbackSrc;
  };
}

// Pour <img onError={onImageError}> : bascule sur l'image de secours si une
// URL externe (ex. photo hebergee ailleurs) devient injoignable, au lieu de
// laisser l'icone d'image cassee.
export const onImageError = fallbackHandler(PLACEHOLDER_IMAGE);

// Meme principe, mais avec le logo Auto BHJ : a utiliser sur les photos d'un
// vehicule au statut "sold".
export const onSoldImageError = fallbackHandler(SOLD_PLACEHOLDER_IMAGE);

export function imageErrorHandler(status) {
  return status === "sold" ? onSoldImageError : onImageError;
}
