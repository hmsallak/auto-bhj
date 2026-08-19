import { listCars } from "../../../backend/models/cars";
import CarBrowser from "../../components/CarBrowser";
import FeaturedCars from "../../components/site/FeaturedCars";
import BrandsStrip from "../../components/site/BrandsStrip";
import TrustBadge from "../../components/site/TrustBadge";
import AboutUs from "../../components/site/AboutUs";
import WhyChooseUs from "../../components/site/WhyChooseUs";
import Services from "../../components/site/Services";
import HowItWorks from "../../components/site/HowItWorks";
import Faq from "../../components/site/Faq";
import LocationHours from "../../components/site/LocationHours";

// The stock changes whenever the admin adds/edits/removes a car, so this
// page must be re-rendered per request rather than cached from build time.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const cars = listCars();
  const availableCars = cars.filter((car) => car.status !== "reserved").length;
  const brandsCount = new Set(cars.map((car) => car.brand).filter(Boolean)).size;

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Stock occasion pret a visiter</p>
            <h1>Des voitures selectionnees, visibles et disponibles pres de Bruxelles.</h1>
            <p className="hero-text">
              Auto BHJ vous accompagne avec un stock controle, des prix affiches
              clairement et un contact direct pour organiser votre visite a
              Sint-Pieters-Leeuw.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#stock">
                Voir le stock
              </a>
              <a className="button neutral" href="#contact">
                Planifier une visite
              </a>
            </div>
          </div>

          <div className="hero-panel" aria-label="Resume du stock Auto BHJ">
            <span className="hero-panel-label">Auto BHJ en direct</span>
            <div className="hero-stats">
              <div>
                <strong>{availableCars}</strong>
                <span>vehicules disponibles</span>
              </div>
              <div>
                <strong>{brandsCount}</strong>
                <span>marques en stock</span>
              </div>
            </div>
            <p>
              Photos, references, kilometrage et prix consultables avant votre
              appel.
            </p>
            <a href="#stock" className="hero-panel-link">
              Explorer les annonces
            </a>
          </div>
        </div>
      </section>

      <FeaturedCars cars={cars} />
      <BrandsStrip cars={cars} />

      <section className="section" id="stock">
        <CarBrowser />
      </section>

      <TrustBadge carsCount={cars.length} />
      <AboutUs />
      <WhyChooseUs />
      <Services />
      <HowItWorks />
      <Faq />
      <LocationHours />
    </>
  );
}
