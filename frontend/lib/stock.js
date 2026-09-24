// Shared stock rules, so the dashboard's "A traiter" counts and the stock
// list filters it links to always agree on which cars they mean.

const DAY_MS = 24 * 60 * 60 * 1000;

// Past this many days on sale, a car is money sitting still: flag it.
export const STALE_DAYS = 60;

export function carAgeDays(car) {
  return (Date.now() - new Date(car.createdAt).getTime()) / DAY_MS;
}

export function isForSale(car) {
  return car.status !== "sold";
}

export function lacksPhoto(car) {
  return isForSale(car) && !car.imageUrl;
}

export function isStale(car) {
  return isForSale(car) && carAgeDays(car) > STALE_DAYS;
}

export const STOCK_FILTER_ALL = { status: "all", special: null };

// Extra filters reachable from "A traiter"; shown as a removable chip.
export const SPECIAL_FILTERS = {
  nophoto: { label: "Sans photo", test: lacksPhoto },
  stale: { label: `En vente depuis plus de ${STALE_DAYS} j`, test: isStale },
};
