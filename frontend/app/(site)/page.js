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

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Vehicules d'occasion selectionnes</p>
          <h1>Votre prochaine voiture vous attend chez Auto BHJ</h1>
          <p className="hero-text">
            Decouvrez notre selection de vehicules d&apos;occasion, choisis avec
            soin et disponibles a Bruxelles.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#stock">
              Voir nos vehicules
            </a>
            <a className="button neutral" href="#contact">
              Nous contacter
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
