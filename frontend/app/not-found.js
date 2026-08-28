import Link from "next/link";

export const metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand">Erreur 404</p>
      <h1
        className="text-ink"
        style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, maxWidth: "none" }}
      >
        Cette page n'existe pas
      </h1>
      <p className="max-w-md text-[14px] leading-relaxed text-body">
        Le lien est peut-etre errone ou le vehicule a ete retire. Retrouvez tout le stock sur la
        page catalogue.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-surface"
        >
          Accueil
        </Link>
        <Link
          href="/stock"
          className="rounded-full bg-cta px-6 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark"
        >
          Voir le stock
        </Link>
      </div>
    </main>
  );
}
