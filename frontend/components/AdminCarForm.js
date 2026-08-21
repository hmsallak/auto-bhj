"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./site/icons";

const emptyCar = {
  brand: "",
  model: "",
  year: "",
  mileage: "",
  price: "",
  fuel: "Essence",
  gearbox: "Manuelle",
  status: "available",
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
  previousOwners: "",
};

const STEPS = [
  { id: "basics", label: "Informations" },
  { id: "photos", label: "Photos" },
  { id: "description", label: "Description" },
  { id: "details", label: "Details techniques" },
  { id: "equipment", label: "Equipements" },
  { id: "review", label: "Recapitulatif" },
];

const REVIEW_STEP = STEPS.length - 1;

const BASIC_REQUIRED = ["brand", "model", "year", "mileage", "price", "fuel", "gearbox", "status"];

const DETAIL_LABELS = [
  ["bodyType", "Carrosserie"],
  ["exteriorColor", "Couleur exterieure"],
  ["seats", "Sieges"],
  ["doors", "Portes"],
  ["powerKw", "Puissance (kW)"],
  ["powerCh", "Puissance (ch)"],
  ["engineCc", "Cylindree (cm3)"],
  ["gears", "Vitesses"],
  ["cylinders", "Cylindres"],
  ["emissionClass", "Classe d'emission"],
  ["consumption", "Consommation"],
  ["paintType", "Type de peinture"],
  ["interiorColor", "Couleur interieure"],
  ["interiorMaterial", "Interieur"],
  ["previousOwners", "Proprietaires precedents"],
];

const STATUS_LABEL = { available: "Disponible", reserved: "Reserve", sold: "Vendu" };

// Fixed checklist instead of free text: covers what the previously imported
// listings actually used (so editing an older car keeps its checkboxes
// ticked) plus the other common options seen across listings.
const EQUIPMENT_CATALOG = {
  Confort: [
    "Climatisation",
    "Climatisation automatique",
    "Vitres electriques",
    "Vitres teintees",
    "Retroviseurs lateraux electriques",
    "Regulateur de vitesse",
    "Volant en cuir",
    "Volant multifonctions",
    "Sieges chauffants",
    "Sieges arrieres 1/3 - 2/3",
    "Accoudoir",
    "Capteurs de stationnement",
    "Commande au volant",
  ],
  "Divertissement / Medias": [
    "Bluetooth",
    "CarPlay",
    "CD",
    "MP3",
    "GPS / Navigation",
    "Ordinateur de bord",
  ],
  Securite: [
    "ABS",
    "ESP",
    "Direction assistee",
    "Anti-demarrage",
    "Airbag avant",
    "Airbag conducteur",
    "Airbag passager",
    "Airbags lateraux",
    "Airbag arriere",
    "Verrouillage centralise",
    "Verrouillage centralise avec telecommande",
    "Feux anti-brouillard",
    "Phares de jour",
    "Isofix",
  ],
  Autres: [
    "Jantes alliage",
    "Roue de secours",
    "Sieges sport",
    "Toit ouvrant",
    "Attelage remorque",
    "Start&Stop",
  ],
};

let nextPhotoKey = 0;

function equipmentToSelection(equipment) {
  return new Set(Object.values(equipment || {}).flat());
}

function selectionToEquipment(selected) {
  const result = {};
  for (const [category, items] of Object.entries(EQUIPMENT_CATALOG)) {
    const checked = items.filter((item) => selected.has(item));
    if (checked.length) result[category] = checked;
  }
  return Object.keys(result).length ? result : null;
}

function photosFromUrls(urls) {
  return (urls || []).map((url) => ({
    key: `existing-${nextPhotoKey++}`,
    kind: "existing",
    url,
    previewUrl: url,
  }));
}

export default function AdminCarForm({ editingCar, onSubmit, onCancel }) {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(new Set());
  const [stepIndex, setStepIndex] = useState(0);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const values = editingCar || emptyCar;
    for (const [key, value] of Object.entries({ ...emptyCar, ...values })) {
      if (form.elements[key]) form.elements[key].value = value ?? "";
    }

    setPhotos(photosFromUrls(editingCar?.images));
    setSelectedEquipment(equipmentToSelection(editingCar?.equipment));
    setStepIndex(0);
    setReview(null);
  }, [editingCar]);

  function toggleEquipmentItem(item) {
    setSelectedEquipment((current) => {
      const next = new Set(current);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  useEffect(() => {
    return () => {
      for (const photo of photos) {
        if (photo.kind === "new") URL.revokeObjectURL(photo.previewUrl);
      }
    };
  }, [photos]);

  function addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setPhotos((current) => [
      ...current,
      ...files.map((file) => ({
        key: `new-${nextPhotoKey++}`,
        kind: "new",
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function addPhotoUrl() {
    const url = photoUrlInput.trim();
    if (!url) return;

    setPhotos((current) => [
      ...current,
      { key: `existing-${nextPhotoKey++}`, kind: "existing", url, previewUrl: url },
    ]);
    setPhotoUrlInput("");
  }

  function removePhoto(key) {
    setPhotos((current) => current.filter((photo) => photo.key !== key));
  }

  function movePhoto(key, direction) {
    setPhotos((current) => {
      const index = current.findIndex((photo) => photo.key === key);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function validateBasics() {
    const form = formRef.current;
    if (!form) return true;

    for (const name of BASIC_REQUIRED) {
      const el = form.elements[name];
      if (el && !String(el.value || "").trim()) {
        el.reportValidity();
        el.focus();
        return false;
      }
    }
    return true;
  }

  function buildReview() {
    const form = formRef.current;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form).entries());
    setReview(data);
  }

  function goNext() {
    if (stepIndex === 0 && !validateBasics()) return;

    const next = Math.min(stepIndex + 1, REVIEW_STEP);
    if (next === REVIEW_STEP) buildReview();
    setStepIndex(next);
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goToStep(index) {
    if (index > stepIndex) return;
    setStepIndex(index);
  }

  // Submitting is a plain button click (not type="submit") on purpose: this
  // button sits in the exact same spot as "Suivant" and swaps in only once
  // stepIndex reaches REVIEW_STEP. With a real type="submit" button there,
  // clicking "Suivant" to *enter* the review step would flip that same DOM
  // node's type from button to submit before the browser finishes handling
  // the click, so the click itself fires a native submit - skipping the
  // recap entirely. A form onSubmit is kept only as a safety net that
  // always no-ops, so pressing Enter anywhere never submits early either.
  function handleFormSubmit(event) {
    event.preventDefault();
  }

  function submitForm() {
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const existingImages = [];
    const imageFiles = [];
    const order = [];

    for (const photo of photos) {
      if (photo.kind === "existing") {
        order.push(`existing:${existingImages.length}`);
        existingImages.push(photo.url);
      } else {
        order.push(`new:${imageFiles.length}`);
        imageFiles.push(photo.file);
      }
    }

    for (const url of existingImages) formData.append("existingImages", url);
    for (const file of imageFiles) formData.append("imageFiles", file);
    formData.append("imageOrder", JSON.stringify(order));

    const equipment = selectionToEquipment(selectedEquipment);
    if (equipment) formData.append("equipment", JSON.stringify(equipment));

    onSubmit(formData);
  }

  const equipment = selectionToEquipment(selectedEquipment);

  return (
    <div className="panel dash-panel">
      <p className="eyebrow">{editingCar ? "Modifier une voiture" : "Ajouter une voiture"}</p>
      <h2>{editingCar ? `Modifier ${editingCar.brand} ${editingCar.model}` : "Nouvelle annonce"}</h2>

      <ol className="wizard-steps">
        {STEPS.map((step, index) => (
          <li
            key={step.id}
            className={`wizard-step-dot ${index === stepIndex ? "current" : ""} ${
              index < stepIndex ? "done" : ""
            }`}
          >
            <button
              type="button"
              className="wizard-step-button"
              onClick={() => goToStep(index)}
              disabled={index > stepIndex}
            >
              <span className="wizard-step-number">{index < stepIndex ? "✓" : index + 1}</span>
              <span className="wizard-step-label">{step.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <form ref={formRef} className="form" onSubmit={handleFormSubmit}>
        <div className={`wizard-panel ${stepIndex === 0 ? "" : "wizard-panel-hidden"}`}>
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
                <option value="sold">Vendu</option>
              </select>
            </label>
          </div>
        </div>

        <div className={`wizard-panel ${stepIndex === 1 ? "" : "wizard-panel-hidden"}`}>
          <div className="photo-manager">
            <div className="photo-manager-head">
              <span>Photos {photos.length > 0 && `(${photos.length})`}</span>
              <button
                className="button neutral small"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Ajouter des photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                hidden
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>

            {photos.length ? (
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <div className="photo-thumb" key={photo.key}>
                    <img src={photo.previewUrl} alt="" />
                    {index === 0 && <span className="photo-thumb-cover">Couverture</span>}
                    <div className="photo-thumb-actions">
                      <button
                        type="button"
                        onClick={() => movePhoto(photo.key, -1)}
                        disabled={index === 0}
                        aria-label="Deplacer avant"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removePhoto(photo.key)}
                        aria-label="Supprimer la photo"
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhoto(photo.key, 1)}
                        disabled={index === photos.length - 1}
                        aria-label="Deplacer apres"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">Aucune photo. La premiere ajoutee sert de couverture.</p>
            )}

            <div className="photo-url-row">
              <input
                type="text"
                placeholder="Ou coller une URL d'image (https://...)"
                value={photoUrlInput}
                onChange={(event) => setPhotoUrlInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPhotoUrl();
                  }
                }}
              />
              <button className="button neutral small" type="button" onClick={addPhotoUrl}>
                Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className={`wizard-panel ${stepIndex === 2 ? "" : "wizard-panel-hidden"}`}>
          <label>
            Description
            <textarea
              name="description"
              rows={8}
              placeholder="Entretien, garantie, options principales"
            />
          </label>
        </div>

        <div className={`wizard-panel ${stepIndex === 3 ? "" : "wizard-panel-hidden"}`}>
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
          <div className="two-cols">
            <label>
              Proprietaires precedents
              <input name="previousOwners" placeholder="1, 2..." />
            </label>
          </div>
        </div>

        <div className={`wizard-panel ${stepIndex === 4 ? "" : "wizard-panel-hidden"}`}>
          <div className="equipment-picker">
            {Object.entries(EQUIPMENT_CATALOG).map(([category, items]) => (
              <div className="equipment-picker-group" key={category}>
                <h4>{category}</h4>
                <div className="equipment-picker-grid">
                  {items.map((item) => (
                    <label className="equipment-checkbox" key={item}>
                      <input
                        type="checkbox"
                        checked={selectedEquipment.has(item)}
                        onChange={() => toggleEquipmentItem(item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`wizard-panel ${stepIndex === REVIEW_STEP ? "" : "wizard-panel-hidden"}`}>
          {review && (
            <div className="wizard-review">
              <div className="wizard-preview-card">
                <div className="wizard-preview-media">
                  {photos[0] ? (
                    <img src={photos[0].previewUrl} alt="" />
                  ) : (
                    <div className="detail-media-placeholder">Pas de photo</div>
                  )}
                </div>
                <div className="wizard-preview-body">
                  <span className="wizard-preview-eyebrow">Apercu de l&apos;annonce</span>
                  <h3>
                    {review.brand} {review.model}
                  </h3>
                  <p className="wizard-preview-specs">
                    {review.fuel} · {review.mileage || "-"} km · {review.year || "-"} · {review.gearbox}
                  </p>
                  <p className="wizard-preview-price">{review.price || "-"} EUR</p>
                </div>
              </div>

              <div className="wizard-review-block">
                <div className="wizard-review-block-head">
                  <h4>Informations</h4>
                  <button type="button" className="link-button" onClick={() => goToStep(0)}>
                    Modifier
                  </button>
                </div>
                <p className="wizard-review-title">
                  {review.brand} {review.model}
                </p>
                <div className="data-grid">
                  <div className="data-row">
                    <span className="data-row-label">Annee</span>
                    <span className="data-row-value">{review.year || "-"}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-row-label">Kilometrage</span>
                    <span className="data-row-value">{review.mileage || "-"} km</span>
                  </div>
                  <div className="data-row">
                    <span className="data-row-label">Prix</span>
                    <span className="data-row-value">{review.price || "-"} EUR</span>
                  </div>
                  <div className="data-row">
                    <span className="data-row-label">Carburant</span>
                    <span className="data-row-value">{review.fuel}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-row-label">Boite</span>
                    <span className="data-row-value">{review.gearbox}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-row-label">Statut</span>
                    <span className="data-row-value">{STATUS_LABEL[review.status] || review.status}</span>
                  </div>
                </div>
              </div>

              <div className="wizard-review-block">
                <div className="wizard-review-block-head">
                  <h4>Photos ({photos.length})</h4>
                  <button type="button" className="link-button" onClick={() => goToStep(1)}>
                    Modifier
                  </button>
                </div>
                {photos.length ? (
                  <div className="photo-grid">
                    {photos.map((photo, index) => (
                      <div className="photo-thumb" key={photo.key}>
                        <img src={photo.previewUrl} alt="" />
                        {index === 0 && <span className="photo-thumb-cover">Couverture</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty">Aucune photo ajoutee.</p>
                )}
              </div>

              <div className="wizard-review-block">
                <div className="wizard-review-block-head">
                  <h4>Description</h4>
                  <button type="button" className="link-button" onClick={() => goToStep(2)}>
                    Modifier
                  </button>
                </div>
                <p className="car-description">
                  {review.description || "Aucune description renseignee."}
                </p>
              </div>

              <div className="wizard-review-block">
                <div className="wizard-review-block-head">
                  <h4>Details techniques</h4>
                  <button type="button" className="link-button" onClick={() => goToStep(3)}>
                    Modifier
                  </button>
                </div>
                {DETAIL_LABELS.some(([key]) => review[key]) ? (
                  <div className="data-grid">
                    {DETAIL_LABELS.filter(([key]) => review[key]).map(([key, label]) => (
                      <div className="data-row" key={key}>
                        <span className="data-row-label">{label}</span>
                        <span className="data-row-value">{review[key]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty">Aucun detail technique renseigne.</p>
                )}
              </div>

              <div className="wizard-review-block">
                <div className="wizard-review-block-head">
                  <h4>Equipements</h4>
                  <button type="button" className="link-button" onClick={() => goToStep(4)}>
                    Modifier
                  </button>
                </div>
                {equipment ? (
                  <div className="equipment-columns">
                    {Object.entries(equipment).map(([category, items]) => (
                      <div key={category} className="equipment-category">
                        <h4>{category}</h4>
                        <ul>
                          {items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty">Aucun equipement renseigne.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="wizard-nav">
          <div className="wizard-nav-side">
            {stepIndex > 0 && (
              <button className="button neutral" type="button" onClick={goBack}>
                <ChevronLeftIcon width="16" height="16" />
                Precedent
              </button>
            )}
            {editingCar && (
              <button className="button ghost" type="button" onClick={onCancel}>
                Annuler
              </button>
            )}
          </div>
          {stepIndex < REVIEW_STEP ? (
            <button className="button navy" type="button" onClick={goNext}>
              Suivant
              <ChevronRightIcon width="16" height="16" />
            </button>
          ) : (
            <button className="button primary" type="button" onClick={submitForm}>
              {editingCar ? "Mettre a jour les modifications" : "Publier la voiture"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
