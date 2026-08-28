const { getDb } = require("../db/connection");
const { createCar, deleteCar } = require("../models/cars");

// Les photos ne sont PAS gerees ici : lancer `fetch-2ememain-photos.js` apres
// cet import pour telecharger et attacher les galeries. Une fois les photos en
// place, relancer cet import ne les ecrase pas (fiches avec photos = conservees).

// Fiches reprises de la page vendeur 2ememain d'Auto BHJ le 28/08/2026 :
// https://www.2ememain.be/u/auto-bhj/49496779/
//
// Donnees relevees fiche par fiche. 2ememain n'expose ni les galeries photos
// completes ni certaines specs -> `images` est laisse vide (photos a ajouter
// dans l'admin) et cylindree / nb de cylindres / couleurs sont des valeurs
// constructeur usuelles (deduites de la motorisation), a verifier au besoin.
const CLOSING = "Pour plus d'infos, telephoner.";

const vehicles = [
  {
    brand: "Volkswagen",
    model: "Polo",
    year: 2008,
    mileage: 131000,
    price: 3399,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 51,
    powerCh: 70,
    engineCc: 1198,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: [
        "Climatisation",
        "Regulateur de vitesse",
        "Sieges chauffants",
        "Capteurs de stationnement",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
        "Vitres teintees",
      ],
      Securite: ["Direction assistee"],
      Autres: ["Jantes alu d'origine"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Superbe Volkswagen Polo 1.2 Essence, Euro 4, 03/06/2008, 131 000 km, 51 kW (70 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles, carnet d'entretien disponible. " +
      "Climatisation, regulateur de vitesse, sieges chauffants, capteurs de stationnement, vitres " +
      "electriques, retroviseur electrique, verrouillage central, jantes alu, vitres teintees. " +
      "Acces a toutes les zones de basses emissions (LEZ). " +
      CLOSING,
    images: [],
  },
  {
    brand: "Skoda",
    model: "Fabia",
    year: 2010,
    mileage: 140000,
    price: 3199,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    doors: 5,
    powerKw: 77,
    powerCh: 105,
    engineCc: 1197,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    equipment: {
      Confort: [
        "Climatisation digitale",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete au controle technique. " +
      "Superbe Skoda Fabia 1.2 TSI Essence, Euro 5a, 07/07/2010, 140 000 km, 77 kW (105 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles, carnet d'entretien complet. " +
      "Dernier entretien a 140 672 km (facture). Carrosserie grelee. " +
      "Climatisation digitale, vitres electriques, retroviseur electrique, verrouillage central, " +
      "direction assistee. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Nissan",
    model: "Micra",
    year: 2008,
    mileage: 129000,
    price: 2499,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    powerKw: 48,
    powerCh: 65,
    engineCc: 1240,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Tres belle Nissan Micra 1.2 Essence, Euro 4, 29/05/2008, seulement 129 000 km, 48 kW (65 ch). " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, commande au volant, vitres electriques, retroviseur electrique, verrouillage " +
      "central, direction assistee. Dernier entretien a 118 927 km. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Ford",
    model: "Fusion",
    year: 2004,
    mileage: 122000,
    price: 3299,
    fuel: "Essence",
    gearbox: "Automatique",
    status: "available",
    bodyType: "Monospace",
    doors: 5,
    powerKw: 59,
    powerCh: 80,
    engineCc: 1388,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: ["Climatisation", "Vitres electriques", "Verrouillage central"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Superbe Ford Fusion 1.4 Essence automatique, Euro 4, 13/08/2004, seulement 122 000 km, " +
      "59 kW (80 ch), 5 portes. Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, vitres electriques, verrouillage central, direction assistee. " +
      "Dernier entretien a 105 706 km. Acces aux zones de basses emissions (LEZ). " +
      CLOSING,
    images: [],
  },
  {
    brand: "Chevrolet",
    model: "Spark",
    year: 2013,
    mileage: 113000,
    price: 3499,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 60,
    powerCh: 82,
    engineCc: 1206,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    previousOwners: "1",
    equipment: {
      Confort: [
        "Climatisation",
        "Sieges chauffants",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
    },
    description:
      "Premier proprietaire. Voiture allemande, dedouanee et prete au controle technique. " +
      "Chevrolet Spark 1.2 Essence, Euro 5, 26/09/2013, 113 000 km, 60 kW (82 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, sieges chauffants, commande au volant, vitres electriques, retroviseur " +
      "electrique, verrouillage central, direction assistee. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Toyota",
    model: "Yaris",
    year: 2018,
    mileage: 226000,
    price: 5999,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    doors: 5,
    powerKw: 82,
    powerCh: 110,
    engineCc: 1496,
    gears: 6,
    cylinders: 4,
    emissionClass: "Euro 6",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Bluetooth", "Commande au volant"],
      Securite: ["Direction assistee"],
      Autres: ["Jantes alu"],
    },
    description:
      "Superbe Toyota Yaris 1.5 Essence, Euro 6c, 01/10/2018, 226 000 km, 82 kW (110 ch), " +
      "boite 6 vitesses, 5 portes. Interieur et exterieur tres propres, roule tres bien. " +
      "Climatisation, Bluetooth, commande au volant, vitres electriques, retroviseur electrique, " +
      "verrouillage central, direction assistee, jantes alu. Passee au controle technique. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Mazda",
    model: "2",
    year: 2007,
    mileage: 95000,
    price: 2999,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    doors: 5,
    powerKw: 59,
    powerCh: 80,
    engineCc: 1349,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete au controle technique. " +
      "Superbe Mazda 2 1.4 Essence, Euro 4, 05/09/2007, seulement 95 000 km, 59 kW (80 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, commande au volant, vitres electriques, retroviseur electrique, verrouillage " +
      "central, direction assistee. Dernier entretien a 89 400 km. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Ford",
    model: "Fiesta",
    year: 2011,
    mileage: 130000,
    price: 3299,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 44,
    powerCh: 60,
    engineCc: 1242,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Ford Fiesta 1.25 Essence, Euro 5a, 27/06/2011, seulement 130 000 km, 44 kW (60 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, commande au volant, vitres electriques, retroviseur electrique, verrouillage " +
      "central, direction assistee. Dernier entretien a 121 000 km. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Suzuki",
    model: "Splash",
    year: 2009,
    mileage: 144000,
    price: 2299,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 48,
    powerCh: 65,
    engineCc: 996,
    gears: 5,
    cylinders: 3,
    emissionClass: "Euro 4",
    previousOwners: "1",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      Securite: ["Direction assistee"],
    },
    description:
      "Premier proprietaire. Voiture allemande, dedouanee et prete au controle technique. " +
      "Suzuki Splash 1.0 Essence, Euro 4, 06/2009, 144 000 km, 48 kW (65 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. Embrayage neuf (+- 3 000 km). " +
      "Climatisation, vitres electriques, retroviseur electrique, verrouillage central, direction " +
      "assistee. Acces aux zones de basses emissions (LEZ). " +
      CLOSING,
    images: [],
  },
  {
    brand: "Hyundai",
    model: "i10",
    year: 2009,
    mileage: 130000,
    price: 2499,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 49,
    powerCh: 67,
    engineCc: 1086,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: ["Climatisation", "Vitres electriques", "Verrouillage central"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Superbe Hyundai i10 1.1 Essence, Euro 4, 27/03/2009, seulement 130 000 km, 49 kW (67 ch), " +
      "5 portes. Interieur et exterieur tres propres, roule tres bien. " +
      "Climatisation, vitres electriques, verrouillage central, direction assistee. " +
      "Dernier entretien a 113 409 km. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Fiat",
    model: "Punto",
    year: 2014,
    mileage: 118000,
    price: 4299,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 51,
    powerCh: 70,
    engineCc: 1242,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 6",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
      Autres: ["Jantes alu d'origine"],
    },
    description:
      "Voiture allemande, dedouanee et prete au controle technique. " +
      "Fiat Punto 1.2 Essence, Euro 6, 26/02/2014, 118 000 km, 51 kW (70 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. Courroie de distribution " +
      "recemment remplacee. Climatisation, commande au volant, vitres electriques, retroviseur " +
      "electrique, verrouillage central, direction assistee, jantes alu. " +
      "Carnet d'entretien jusqu'a 93 897 km. Acces aux zones de basses emissions (LEZ). " +
      CLOSING,
    images: [],
  },
  {
    brand: "Volkswagen",
    model: "Golf Plus",
    year: 2011,
    mileage: 124000,
    price: 4999,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Monospace",
    doors: 5,
    powerKw: 63,
    powerCh: 86,
    engineCc: 1197,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    equipment: {
      Confort: [
        "Climatisation",
        "Capteurs de stationnement",
        "Sieges chauffants",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Superbe Volkswagen Golf 6 Plus 1.2 TSI Essence, Euro 5, 29/11/2011, seulement 124 000 km, " +
      "63 kW (86 ch), 5 portes. Interieur et exterieur tres propres, roule tres bien, 2 cles. " +
      "Climatisation, capteurs de stationnement, sieges chauffants, vitres electriques, retroviseur " +
      "electrique, verrouillage central, direction assistee. Carnet d'entretien complet + facture " +
      "de conformite. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Opel",
    model: "Corsa",
    year: 2010,
    mileage: 173000,
    price: 2699,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 51,
    powerCh: 70,
    engineCc: 1229,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    equipment: {
      Confort: [
        "Climatisation",
        "Sieges chauffants",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
        "Vitres teintees",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
      Autres: ["Jantes alu"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Opel Corsa 1.2 Essence 111 ans, Euro 5, 12/2010, 173 000 km, 51 kW (70 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien. Climatisation, sieges chauffants, " +
      "commande au volant, vitres electriques, retroviseur electrique, verrouillage central, " +
      "direction assistee, jantes alu, vitres teintees. Peinture qui deteint legerement. " +
      CLOSING,
    images: [],
  },
  {
    brand: "Kia",
    model: "Picanto",
    year: 2010,
    mileage: 144000,
    price: 2699,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    doors: 5,
    powerKw: 48,
    powerCh: 65,
    engineCc: 1086,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: ["Climatisation", "Vitres electriques", "Verrouillage central"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete au controle technique. " +
      "Kia Picanto 1.1 Essence, Euro 4, 31/03/2010, 144 000 km, 48 kW (65 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. Freins arriere neufs. " +
      "Distribution faite a 112 572 km. Climatisation, vitres electriques, verrouillage central, " +
      "direction assistee. Acces aux zones de basses emissions (LEZ). " +
      CLOSING,
    images: [],
  },
  {
    brand: "Renault",
    model: "Twingo",
    year: 2009,
    mileage: 154000,
    price: 2699,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Citadine",
    powerKw: 56,
    powerCh: 75,
    engineCc: 1149,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    equipment: {
      Confort: [
        "Climatisation",
        "Vitres electriques",
        "Retroviseur electrique",
        "Verrouillage central",
      ],
      "Divertissement / Medias": ["Commande au volant"],
      Securite: ["Direction assistee"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Renault Twingo 1.2 Essence, Euro 4, 29/09/2009, 154 000 km, 56 kW (75 ch). " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. Distribution revisee " +
      "(a 118 332 km). Climatisation, commande au volant, vitres electriques, retroviseur " +
      "electrique, verrouillage central, direction assistee. Carnet d'entretien complet " +
      "jusqu'a 146 625 km. " +
      CLOSING,
    images: [],
  },
];

function run() {
  const db = getDb();

  // Idempotent : pour chaque voiture de la liste, on cherche une fiche deja
  // presente (meme marque + modele + kilometrage). Ne touche jamais aux
  // voitures absentes de cette liste.
  const findDup = db.prepare(
    `SELECT c.id, c.reference, c.status,
            (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) AS imgs
     FROM cars c
     WHERE lower(c.brand) = lower(?) AND lower(c.model) = lower(?) AND c.mileage = ?`
  );

  let imported = 0;
  let replaced = 0;
  let skipped = 0;
  let failed = 0;

  for (const vehicle of vehicles) {
    const existing = findDup.all(vehicle.brand, vehicle.model, vehicle.mileage);
    const incomingHasPhotos = (vehicle.images || []).length > 0;

    // On ne remplace jamais : une fiche marquee "vendu", ni une fiche qui a
    // deja des photos quand l'import n'en apporte pas de nouvelles.
    const protectedRow = existing.find(
      (row) => row.status === "sold" || (row.imgs > 0 && !incomingHasPhotos)
    );
    if (protectedRow) {
      skipped += 1;
      console.log(
        `- Conservee : ${protectedRow.reference} (${vehicle.brand} ${vehicle.model}) -- deja ${protectedRow.imgs} photo(s), non ecrasee`
      );
      continue;
    }

    for (const row of existing) {
      deleteCar(row.id);
      replaced += 1;
    }

    const result = createCar(vehicle);
    if (result.error) {
      failed += 1;
      console.warn(`- Echec ${vehicle.brand} ${vehicle.model} : ${result.error}`);
      continue;
    }

    imported += 1;
    console.log(
      `- Importee : ${result.car.reference} (${result.car.brand} ${result.car.model}, ${vehicle.price} EUR, ${result.car.images.length} photo(s))`
    );
  }

  console.log(
    `Termine : ${imported} importee(s), ${replaced} remplacee(s), ${skipped} conservee(s), ${failed} echec(s).`
  );
}

run();
