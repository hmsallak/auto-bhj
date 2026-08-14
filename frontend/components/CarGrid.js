import CarCard from "./CarCard";

export default function CarGrid({ cars }) {
  if (!cars.length) {
    return <p className="empty">Aucune voiture ne correspond a votre recherche.</p>;
  }

  return (
    <div className="listing-list">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
