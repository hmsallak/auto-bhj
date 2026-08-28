import HomeCarCard from "./HomeCarCard";

// - cols=4 : apercu de la home (grille 1 / 2 / 4 colonnes).
// - cols=3 : page stock. Une carte par ligne sur mobile (photo a gauche,
//   descriptif a droite), grille 3 colonnes a partir de `lg`.
// Classes ecrites en entier pour rester detectables par Tailwind.
const GRID_BY_COLS = {
  3: "flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-5",
  4: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
};

export default function HomeCarGrid({ cars, cols = 4 }) {
  if (!cars.length) {
    return (
      <p className="py-10 text-center text-[15px] text-body">
        Aucune voiture disponible pour le moment.
      </p>
    );
  }

  return (
    <div className={GRID_BY_COLS[cols] || GRID_BY_COLS[4]}>
      {cars.map((car, index) => (
        <HomeCarCard key={car.id} car={car} priority={index === 0} stock={cols === 3} />
      ))}
    </div>
  );
}
