export function formatPrice(value) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
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

export function carImage(car) {
  return (
    car.imageUrl ||
    "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80"
  );
}
