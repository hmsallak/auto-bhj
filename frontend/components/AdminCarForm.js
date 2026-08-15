"use client";

import { useEffect, useRef, useState } from "react";

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
};

let nextPhotoKey = 0;

function photosFromUrls(urls) {
  return (urls || []).map((url) => ({
    key: `existing-${nextPhotoKey++}`,
    kind: "existing",
    url,
    previewUrl: url,
  }));
}

export default function AdminCarForm({ editingCar, onSubmit, onCancel, message, isError }) {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const values = editingCar || emptyCar;
    for (const [key, value] of Object.entries({ ...emptyCar, ...values })) {
      if (form.elements[key]) form.elements[key].value = value ?? "";
    }

    setPhotos(photosFromUrls(editingCar?.images));
  }, [editingCar]);

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

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
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

    onSubmit(formData);
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
