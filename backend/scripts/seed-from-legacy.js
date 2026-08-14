const fs = require("fs");
const path = require("path");
const { createCar } = require("../models/cars");

const legacyFile = path.join(__dirname, "..", "..", "data", "cars.json");

function run() {
  if (!fs.existsSync(legacyFile)) {
    console.log(`Aucun fichier legacy trouve (${legacyFile}), rien a migrer.`);
    return;
  }

  const legacyCars = JSON.parse(fs.readFileSync(legacyFile, "utf8") || "[]");
  console.log(`${legacyCars.length} voiture(s) trouvee(s) dans l'ancien fichier JSON.`);

  let migrated = 0;
  let failed = 0;

  for (const legacyCar of legacyCars) {
    const result = createCar(legacyCar);

    if (result.error) {
      failed += 1;
      console.warn(
        `- Echec pour ${legacyCar.brand || "?"} ${legacyCar.model || "?"}: ${result.error}`
      );
      continue;
    }

    migrated += 1;
    console.log(`- Migree: ${result.car.reference} (${result.car.brand} ${result.car.model})`);

    if (legacyCar.price && Number(legacyCar.price) > 1_000_000) {
      console.warn(
        `  ATTENTION: prix suspect (${legacyCar.price}) pour ${result.car.reference}, a corriger depuis l'admin.`
      );
    }
  }

  console.log(`Termine: ${migrated} migree(s), ${failed} echec(s).`);
  if (migrated > 0) {
    console.log(
      "Vous pouvez maintenant supprimer l'ancien dossier data/ (racine) apres verification."
    );
  }
}

run();
