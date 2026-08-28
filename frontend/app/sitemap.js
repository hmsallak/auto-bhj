import { listCars } from "../../backend/models/cars";

const SITE_URL = "https://www.autobhj.be";

export const dynamic = "force-dynamic";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/stock", priority: 0.9, changeFrequency: "daily" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
    { path: "/politique-confidentialite", priority: 0.2, changeFrequency: "yearly" },
    { path: "/politique-cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/conditions-generales", priority: 0.2, changeFrequency: "yearly" },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let carRoutes = [];
  try {
    carRoutes = listCars()
      .filter((car) => car.status !== "sold")
      .map((car) => ({
        url: `${SITE_URL}/cars/${car.reference}`,
        lastModified: car.updatedAt ? new Date(car.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch {
    carRoutes = [];
  }

  return [...staticRoutes, ...carRoutes];
}
