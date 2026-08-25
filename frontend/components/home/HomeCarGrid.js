import HomeCarCard from "./HomeCarCard";

export default function HomeCarGrid({ cars }) {
  if (!cars.length) {
    return (
      <p className="py-10 text-center text-[15px] text-body">
        Aucune voiture ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cars.map((car, index) => (
        <HomeCarCard key={car.id} car={car} priority={index === 0} />
      ))}
    </div>
  );
}
