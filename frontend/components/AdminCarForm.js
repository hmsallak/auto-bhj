"use client";

import { useEffect, useRef } from "react";

const emptyCar = {
  brand: "",
  model: "",
  year: "",
  mileage: "",
  price: "",
  fuel: "Essence",
  gearbox: "Manuelle",
  status: "available",
  imageUrl: "",
  description: "",
  bodyType: "",
  seats: "",
  doors: "",
  powerKw: "",
  powerCh: "",
  engineCc: "",
  gears: "",
  cylinders: "",
  emissionClass: "",
  consumption: "",
  exteriorColor: "",
  paintType: "",
  interiorColor: "",
  interiorMaterial: "",
};

export default function AdminCarForm({ editingCar, onSubmit, onCancel, message, isError }) {
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const values = editingCar || emptyCar;
    for (const [key, value] of Object.entries({ ...emptyCar, ...values })) {
      if (form.elements[key]) form.elements[key].value = value ?? "";
    }
    if (form.elements.imageFile) form.elements.imageFile.value = "";
  }, [editingCar]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(new FormData(event.target));
  }

  return (
    <div className="panel dash-panel">
      <p className="eyebrow">{editingCar ? "Modifier une voiture" : "Ajouter une voiture"}</p>
      <h2>{editingCar ? `Modifier ${editingCar.brand} ${editingCar.model}` : "Nouvelle annonce"}</h2>
      <form ref={formRef} className="form" onSubmit={handleSubmit}>
        <div className="two-cols">
          <label>
            Marque
            <input name="brand" placeholder="BMW" required />
          </label>
          <label>
            Modele
            <input name="model" placeholder="Serie 3" required />
          </label>
        </div>
        <div className="two-cols">
          <label>
            Annee
            <input name="year" type="number" min="1980" max="2035" required />
          </label>
          <label>
            Kilometrage
            <input name="mileage" type="number" min="0" required />
          </label>
        </div>
        <div className="two-cols">
          <label>
            Prix EUR
            <input name="price" type="number" min="1" required />
          </label>
          <label>
            Carburant
            <select name="fuel" required>
              <option>Essence</option>
              <option>Diesel</option>
              <option>Hybride</option>
              <option>Electrique</option>
            </select>
          </label>
        </div>
        <div className="two-cols">
          <label>
            Boite
            <select name="gearbox" required>
              <option>Manuelle</option>
              <option>Automatique</option>
            </select>
          </label>
          <label>
            Statut
            <select name="status" required>
              <option value="available">Disponible</option>
              <option value="reserved">Reserve</option>
            </select>
          </label>
        </div>
        <label>
          Image locale
          <input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" />
        </label>
        <label>
          URL image optionnelle
          <input name="imageUrl" placeholder="https://..." />
        </label>
        <label>
          Description
          <textarea name="description" placeholder="Entretien, garantie, options principales" />
        </label>

        <details className="form-details">
          <summary>Details techniques (optionnel)</summary>
          <div className="two-cols">
            <label>
              Carrosserie
              <input name="bodyType" placeholder="Berline, Monospace..." />
            </label>
            <label>
              Couleur exterieure
              <input name="exteriorColor" placeholder="Noir" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Sieges
              <input name="seats" type="number" min="1" max="9" />
            </label>
            <label>
              Portes
              <input name="doors" type="number" min="2" max="6" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Puissance (kW)
              <input name="powerKw" type="number" min="0" />
            </label>
            <label>
              Puissance (ch)
              <input name="powerCh" type="number" min="0" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Cylindree (cm3)
              <input name="engineCc" type="number" min="0" />
            </label>
            <label>
              Vitesses
              <input name="gears" type="number" min="1" max="10" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Cylindres
              <input name="cylinders" type="number" min="1" max="16" />
            </label>
            <label>
              Classe d&apos;emission
              <input name="emissionClass" placeholder="Euro 5" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Consommation
              <input name="consumption" placeholder="5,00 l/100 km (mixte)" />
            </label>
            <label>
              Type de peinture
              <input name="paintType" placeholder="Metallisee, Autres..." />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Couleur interieure
              <input name="interiorColor" placeholder="Gris" />
            </label>
            <label>
              Interieur
              <input name="interiorMaterial" placeholder="Tissu, Cuir..." />
            </label>
          </div>
        </details>

        <div className="form-actions">
          <button className="button primary" type="submit">
            {editingCar ? "Enregistrer les modifications" : "Publier la voiture"}
          </button>
          {editingCar && (
            <button className="button neutral" type="button" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>
      {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
    </div>
  );
}
