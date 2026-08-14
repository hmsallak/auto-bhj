export default function BrandsStrip({ cars }) {
  const brands = [...new Set(cars.map((car) => car.brand))].sort();
  if (!brands.length) return null;

  return (
    <section className="section reveal brands-section">
      <p className="eyebrow">Marques disponibles en stock</p>
      <div className="brands-row">
        {brands.map((brand) => (
          <a key={brand} href="#stock" className="brand-chip">
            {brand}
          </a>
        ))}
      </div>
    </section>
  );
}
