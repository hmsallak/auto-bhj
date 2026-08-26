"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useDragControls } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, UploadCloudIcon } from "./site/icons";

const EASE = [0.16, 1, 0.3, 1];
const PHOTO_LONG_PRESS_MS = 500;
const PHOTO_PRESS_MOVE_TOLERANCE = 10;
const PHOTO_DOUBLE_TAP_MS = 300;

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

function PhotoThumb({
  photo,
  index,
  photosLength,
  isDragging,
  isDropTarget,
  prefersReducedMotion,
  onDragStateChange,
  onReorder,
  onRemove,
  onMoveOneSlot,
  findPhotoKeyAtPoint,
}) {
  const dragControls = useDragControls();
  const pressTimerRef = useRef(null);
  const pressOriginRef = useRef(null);
  const lastTapAtRef = useRef(0);

  function clearPressTimer() {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    pressOriginRef.current = null;
  }

  function handlePointerDown(event) {
    if (prefersReducedMotion || photosLength <= 1) return;
    clearPressTimer();
    pressOriginRef.current = { x: event.clientX, y: event.clientY };
    pressTimerRef.current = setTimeout(() => {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(18);
      onDragStateChange(photo.key, null);
      dragControls.start(event);
    }, PHOTO_LONG_PRESS_MS);
  }

  // A scroll/swipe starts with the same pointerdown as a long-press - only
  // once the finger has moved past a small tolerance do we know it's a
  // scroll, not a hold, so the pending drag-start gets cancelled and the
  // page keeps scrolling normally instead of hijacking the gesture.
  function handlePointerMove(event) {
    const origin = pressOriginRef.current;
    if (!origin) return;

    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.hypot(dx, dy) > PHOTO_PRESS_MOVE_TOLERANCE) clearPressTimer();
  }

  // Simple, reliable alternative to the long-press drag on touch devices
  // where drag gestures are flaky: two quick taps swap the photo with its
  // neighbour.
  function handlePointerUp() {
    clearPressTimer();
    if (isDragging || photosLength <= 1) return;

    const now = Date.now();
    if (now - lastTapAtRef.current < PHOTO_DOUBLE_TAP_MS) {
      lastTapAtRef.current = 0;
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
      onMoveOneSlot(photo.key);
    } else {
      lastTapAtRef.current = now;
    }
  }

  return (
    <motion.div
      layout={!prefersReducedMotion && !isDragging}
      data-photo-key={photo.key}
      className={`photo-thumb ${isDragging ? "dragging" : ""} ${isDropTarget ? "drop-target" : ""}`}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.22, ease: EASE }}
      drag={!prefersReducedMotion && photosLength > 1}
      dragListener={false}
      dragControls={dragControls}
      dragSnapToOrigin
      dragElastic={0.15}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 5, boxShadow: "0 16px 32px rgba(15, 23, 42, 0.32)" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearPressTimer}
      onPointerCancel={clearPressTimer}
      onContextMenu={(event) => event.preventDefault()}
      onDrag={(event, info) => {
        const targetKey = findPhotoKeyAtPoint(info.point.x, info.point.y);
        onDragStateChange(photo.key, targetKey && targetKey !== photo.key ? targetKey : null);
      }}
      onDragEnd={(event, info) => {
        clearPressTimer();
        const targetKey = findPhotoKeyAtPoint(info.point.x, info.point.y);
        if (targetKey) onReorder(photo.key, targetKey);
        onDragStateChange(null, null);
      }}
    >
      <img src={photo.previewUrl} alt="" draggable={false} />
      <span className="photo-thumb-position">{index + 1}</span>
      {index === 0 && <span className="photo-thumb-cover">Couverture</span>}
      <div className="photo-thumb-actions">
        <button
          type="button"
          className="danger"
          onClick={() => onRemove(photo.key)}
          aria-label="Supprimer la photo"
        >
          <TrashIcon width="14" height="14" />
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminCarForm({ editingCar, onSubmit, onCancel }) {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(new Set());
  const [stepIndex, setStepIndex] = useState(0);
  const [review, setReview] = useState(null);
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedPhotoKey, setDraggedPhotoKey] = useState(null);
  const [dropTargetKey, setDropTargetKey] = useState(null);
  const [statusValue, setStatusValue] = useState(editingCar?.status || "available");
  const dragCounter = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const values = editingCar || emptyCar;
    for (const [key, value] of Object.entries({ ...emptyCar, ...values })) {
      if (!form.elements[key]) continue;
      // Sold cars store 0 as the "price erased" sentinel - show the field
      // empty (with its placeholder) instead of a literal 0.
      const displayValue = key === "price" && values.status === "sold" ? "" : value ?? "";
      form.elements[key].value = displayValue;
    }

    setPhotos(photosFromUrls(editingCar?.images));
    setSelectedEquipment(equipmentToSelection(editingCar?.equipment));
    setStatusValue(values.status || "available");
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
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
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

  function removePhoto(key) {
    setPhotos((current) => current.filter((photo) => photo.key !== key));
  }

  // The first photo (cover) has nothing before it to swap with, so double-
  // tapping it swaps it with the next one instead - every photo's double
  // tap always does something, instead of the cover being a dead end.
  function movePhotoOneSlot(key) {
    setPhotos((current) => {
      const index = current.findIndex((photo) => photo.key === key);
      if (index === -1 || current.length < 2) return current;

      const swapWith = index === 0 ? 1 : index - 1;
      const next = [...current];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  function reorderPhoto(draggedKey, targetKey) {
    if (!draggedKey || draggedKey === targetKey) return;

    setPhotos((current) => {
      const fromIndex = current.findIndex((photo) => photo.key === draggedKey);
      const toIndex = current.findIndex((photo) => photo.key === targetKey);
      if (fromIndex === -1 || toIndex === -1) return current;

      const next = [...current];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
  }

  function photoKeyAtPoint(x, y) {
    const target = document.elementFromPoint(x, y)?.closest("[data-photo-key]");
    return target?.getAttribute("data-photo-key") || null;
  }

  function handleDropzoneDragEnter(event) {
    event.preventDefault();
    dragCounter.current += 1;
    setIsDropzoneActive(true);
  }

  function handleDropzoneDragLeave(event) {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDropzoneActive(false);
  }

  function handleDropzoneDrop(event) {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDropzoneActive(false);
    addFiles(event.dataTransfer.files);
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

  async function submitForm() {
    if (isSubmitting) return;

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

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  const equipment = selectionToEquipment(selectedEquipment);

  return (
    <div className="panel dash-panel">
      <p className="eyebrow">{editingCar ? "Modifier une voiture" : "Ajouter une voiture"}</p>
      <h2>{editingCar ? `Modifier ${editingCar.brand} ${editingCar.model}` : "Nouvelle annonce"}</h2>
      <p className="wizard-mobile-progress">
        Etape {stepIndex + 1} sur {STEPS.length} - {STEPS[stepIndex].label}
      </p>

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
              <span className="wizard-step-number">
                {index === stepIndex && !prefersReducedMotion && (
                  <motion.span
                    layoutId="wizardStepRing"
                    className="wizard-step-ring"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}
                {index < stepIndex ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
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
              <input name="year" type="number" min="1980" max="2035" inputMode="numeric" required />
            </label>
            <label>
              Kilometrage
              <input name="mileage" type="number" min="0" inputMode="numeric" required />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Prix EUR
              <input
                name="price"
                type="number"
                min="1"
                inputMode="numeric"
                required={statusValue !== "sold"}
                disabled={statusValue === "sold"}
                placeholder={statusValue === "sold" ? "Masque - vehicule vendu" : undefined}
              />
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
              <select
                name="status"
                required
                value={statusValue}
                onChange={(event) => setStatusValue(event.target.value)}
              >
                <option value="available">Disponible</option>
                <option value="reserved">Reserve</option>
                <option value="sold">Vendu</option>
              </select>
            </label>
            {statusValue === "sold" && (
              <p className="hint-text">
                Le prix sera efface de la fiche et de la base des l&apos;enregistrement, sans
                trace recuperable.
              </p>
            )}
          </div>
        </div>

        <div className={`wizard-panel ${stepIndex === 1 ? "" : "wizard-panel-hidden"}`}>
          <div className="photo-manager">
            <div className="photo-manager-head">
              <span>Photos {photos.length > 0 && `(${photos.length})`}</span>
              {photos.length > 1 && (
                <p className="photo-manager-hint">
                  Glissez une photo, ou tapez deux fois pour la faire remonter d&apos;un cran.
                </p>
              )}
            </div>

            <div
              className={`photo-dropzone ${isDropzoneActive ? "active" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={handleDropzoneDragEnter}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={handleDropzoneDragLeave}
              onDrop={handleDropzoneDrop}
            >
              <UploadCloudIcon width="26" height="26" />
              <p className="photo-dropzone-title">
                Glissez vos photos ici <span>ou cliquez pour parcourir</span>
              </p>
              <span className="photo-dropzone-hint">JPG, PNG ou WEBP</span>
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
                <AnimatePresence initial={false}>
                  {photos.map((photo, index) => (
                    <PhotoThumb
                      key={photo.key}
                      photo={photo}
                      index={index}
                      photosLength={photos.length}
                      isDragging={draggedPhotoKey === photo.key}
                      isDropTarget={dropTargetKey === photo.key}
                      prefersReducedMotion={prefersReducedMotion}
                      onDragStateChange={(draggedKey, targetKey) => {
                        setDraggedPhotoKey(draggedKey);
                        setDropTargetKey(targetKey);
                      }}
                      onReorder={reorderPhoto}
                      onRemove={removePhoto}
                      onMoveOneSlot={movePhotoOneSlot}
                      findPhotoKeyAtPoint={photoKeyAtPoint}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p className="empty">Aucune photo pour l&apos;instant.</p>
            )}

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
              <input name="seats" type="number" min="1" max="9" inputMode="numeric" />
            </label>
            <label>
              Portes
              <input name="doors" type="number" min="2" max="6" inputMode="numeric" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Puissance (kW)
              <input name="powerKw" type="number" min="0" inputMode="numeric" />
            </label>
            <label>
              Puissance (ch)
              <input name="powerCh" type="number" min="0" inputMode="numeric" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Cylindree (cm3)
              <input name="engineCc" type="number" min="0" inputMode="numeric" />
            </label>
            <label>
              Vitesses
              <input name="gears" type="number" min="1" max="10" inputMode="numeric" />
            </label>
          </div>
          <div className="two-cols">
            <label>
              Cylindres
              <input name="cylinders" type="number" min="1" max="16" inputMode="numeric" />
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
            <button className="button primary" type="button" onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting
                ? "Envoi en cours..."
                : editingCar
                  ? "Mettre a jour les modifications"
                  : "Publier la voiture"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
