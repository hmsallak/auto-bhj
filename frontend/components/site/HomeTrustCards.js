import { ShieldIcon, TagIcon, WarrantyIcon } from "../home/icons";

const ITEMS = [
  {
    title: "Voitures toujours controlees",
    text: "Chaque vehicule est verifie avant la mise en vente pour partir sereinement.",
    icon: ShieldIcon,
  },
  {
    title: "Prix bas et transparents",
    text: "Des occasions selectionnees avec des prix clairs, sans mauvaise surprise.",
    icon: TagIcon,
  },
  {
    title: "Vehicules propres",
    text: "Presentation soignee, habitacle propre et informations utiles avant la visite.",
    icon: WarrantyIcon,
  },
];

export default function HomeTrustCards() {
  return (
    <section className="bg-white py-16" aria-labelledby="reasons-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-[13px] font-bold uppercase tracking-wide text-blue-700">Pourquoi nous choisir</p>
        <h2 id="reasons-title" className="mt-2 text-2xl font-bold text-slate-900">
          Des voitures pretes a rouler, choisies avec serieux
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-gray-600">
          Chez Auto BHJ, on va droit au plus important : des vehicules propres, controles et proposes au bon
          prix pour acheter avec confiance.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ITEMS.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-[15px] text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
