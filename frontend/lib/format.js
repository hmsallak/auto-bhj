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

export function carImage(car) {
  return car.imageUrl || PLACEHOLDER_IMAGE;
}

// Pour <img onError={onImageError}> : bascule sur l'image de secours si une
// URL externe (ex. photo hebergee ailleurs) devient injoignable, au lieu de
// laisser l'icone d'image cassee.
export function onImageError(event) {
  const img = event.currentTarget;
  if (img.src === PLACEHOLDER_IMAGE) return;
  img.onerror = null;
  img.src = PLACEHOLDER_IMAGE;
}
