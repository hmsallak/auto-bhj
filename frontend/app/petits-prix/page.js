import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Voitures d'occasion à petits prix",
  description:
    "Voitures d'occasion révisées et garanties au meilleur prix : Renault, Peugeot, Dacia et plus, entre 3 000 € et 8 000 €.",
};

const MARQUES = ["Toutes marques", "Renault", "Peugeot", "Dacia", "Citroën", "Volkswagen"];
const PRIX_MAX = ["Prix max", "4 000 €", "5 000 €", "6 000 €", "7 000 €", "8 000 €"];
const KM_MAX = ["Kilométrage max", "50 000 km", "75 000 km", "100 000 km", "125 000 km", "150 000 km"];

const CARS = [
  {
    id: "clio-iv-2016",
    title: "Renault Clio IV",
    year: 2016,
    price: 6490,
    mileage: "89 000 km",
    fuel: "Essence",
    gearbox: "Manuelle",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    id: "208-2015",
    title: "Peugeot 208",
    year: 2015,
    price: 5990,
    mileage: "102 000 km",
    fuel: "Diesel",
    gearbox: "Manuelle",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    id: "sandero-2018",
    title: "Dacia Sandero",
    year: 2018,
    price: 7490,
    mileage: "76 000 km",
    fuel: "Essence",
    gearbox: "Manuelle",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop&auto=format&q=80",
  },
];

function MileageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13l3-3" />
      <path d="M9 4.5h6" />
    </svg>
  );
}

function FuelIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 21V7a2 2 0 012-2h5a2 2 0 012 2v14" />
      <path d="M4 11h9" />
      <path d="M15 8l2.5 2.5V17a1.5 1.5 0 003 0v-5l-3-3" />
    </svg>
  );
}

function GearboxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v4M12 17v4M4.6 7.5l3.5 2M15.9 14.5l3.5 2M4.6 16.5l3.5-2M15.9 9.5l3.5-2" />
    </svg>
  );
}

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[14px] font-medium text-gray-700">
      <Icon className="h-3.5 w-3.5 shrink-0 text-gray-500" />
      {children}
    </span>
  );
}

function CarCard({ car, priority }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <img
        src={car.image}
        alt={`${car.title} ${car.year}`}
        width={800}
        height={600}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="aspect-[4/3] w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-slate-900">
          {car.title} <span className="font-bold text-slate-700">{car.year}</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          <Badge icon={MileageIcon}>{car.mileage}</Badge>
          <Badge icon={FuelIcon}>{car.fuel}</Badge>
          <Badge icon={GearboxIcon}>{car.gearbox}</Badge>
        </div>

        <p className="text-2xl font-extrabold text-blue-700">
          {car.price.toLocaleString("fr-FR")} €
        </p>

        <button
          type="button"
          className="mt-auto inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-4 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Voir le véhicule
        </button>
      </div>
    </div>
  );
}

function FilterSelect({ label, options }) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <select
        id={id}
        className="min-h-[48px] cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-[15px] font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        defaultValue={options[0]}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function PetitsPrixPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-[#F9FAFB] text-slate-900`}>
      <main>
        <section className="px-6 pb-14 pt-16 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-slate-900">
              Voitures d&apos;occasion révisées et garanties au meilleur prix
            </h1>
            <p className="mt-4 text-[15px] font-normal text-gray-600">
              Un stock sélectionné, des prix affichés, aucune mauvaise surprise.
            </p>
          </div>

          <form
            className="mx-auto mt-8 flex max-w-4xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:p-6"
            aria-label="Rechercher un véhicule"
          >
            <FilterSelect label="Marque" options={MARQUES} />
            <FilterSelect label="Prix Max" options={PRIX_MAX} />
            <FilterSelect label="Kilométrage Max" options={KM_MAX} />

            <button
              type="submit"
              className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-8 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:min-w-[160px]"
            >
              Rechercher
            </button>
          </form>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-slate-900">Nos meilleures offres du moment</h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CARS.map((car, index) => (
                <CarCard key={car.id} car={car} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
