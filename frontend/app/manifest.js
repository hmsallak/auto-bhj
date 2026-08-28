export default function manifest() {
  return {
    name: "Auto BHJ - Voitures d'occasion",
    short_name: "Auto BHJ",
    description:
      "Voitures d'occasion controlees pres de Bruxelles, a Sint-Pieters-Leeuw.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F9FA",
    theme_color: "#2d6b76",
    lang: "fr-BE",
    icons: [
      { src: "/logo-static.png", sizes: "any", type: "image/png" },
      { src: "/logo-auto-bhj.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
