import { PinIcon, StarIcon } from "./icons";

export default function AboutUs() {
  return (
    <section className="section reveal about-section" id="a-propos">
      <div className="about-grid">
        <div>
          <p className="eyebrow">A propos</p>
          <h2>Auto BHJ, vendeur professionnel a Sint-Pieters-Leeuw</h2>
          <p>
            Auto BHJ SRL est un vendeur professionnel de vehicules d'occasion
            base a Sint-Pieters-Leeuw, en Belgique. Nous selectionnons des
            voitures d'occasion a prix accessible, les preparons pour la vente
            et les proposons directement depuis notre garage, sans
            intermediaire.
          </p>
          <p>
            Notre approche est simple : un stock limite mais controle, des
            prix affiches sans negociation cachee, et un interlocuteur direct
            pour repondre a vos questions avant, pendant et apres l'achat.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-row">
            <StarIcon className="star-filled" />
            <div>
              <strong>Vendeur professionnel</strong>
              <span>Actif sur AutoScout24 depuis 2024</span>
            </div>
          </div>
          <div className="about-card-row">
            <PinIcon />
            <div>
              <strong>Auto BHJ SRL</strong>
              <span>Mekingenweg 99, 1600 Sint-Pieters-Leeuw</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
