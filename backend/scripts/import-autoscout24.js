const { getDb } = require("../db/connection");
const { createCar, deleteCar } = require("../models/cars");

// Fiches completes relevees manuellement (page par page, navigateur reel) sur
// https://www.autoscout24.be/fr/professional/auto-bhj le 14/08/2026.
function imagesFor(base, uuids) {
  return uuids.map(
    (uuid) =>
      `https://prod.pictures.autoscout24.net/listing-images/${base}_${uuid}.jpg/1920x1080.webp`
  );
}

const vehicles = [
  {
    brand: "Nissan",
    model: "Micra",
    year: 2012,
    mileage: 154000,
    price: 2999,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    seats: 5,
    doors: 5,
    powerKw: 59,
    powerCh: 80,
    engineCc: 1198,
    gears: 5,
    cylinders: 3,
    emissionClass: "Euro 5",
    consumption: "5,00 l/100 km (mixte)",
    exteriorColor: "Noir",
    paintType: "Autres",
    interiorColor: "Gris",
    interiorMaterial: "Tissu",
    equipment: {
      Confort: ["Climatisation", "Vitres electriques"],
      "Divertissement / Medias": ["Bluetooth", "CD", "MP3", "Ordinateur de bord"],
      Securite: [
        "ABS",
        "Airbag avant",
        "Airbag conducteur",
        "Airbag passager",
        "Airbags lateraux",
        "Direction assistee",
        "ESP",
        "Verrouillage centralise avec telecommande",
      ],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Nissan Micra 1.2 Essence, Euro 5a, 30/08/2012, 154 000 km, 5 portes, 59 kW (80 ch). " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. AIRCO, CarPlay, commande au volant, " +
      "vitres electriques, verrouillage central, direction assistee. Dernier entretien a 135 685 km (facture), " +
      "carnet d'entretien complet. Choc leger a l'avant, a l'arriere et griffes (voir photos). " +
      "Pour plus d'infos, telephoner.",
    images: imagesFor("3a83f622-40f3-406e-8519-e5323d7eae58", [
      "ad82e4b8-db26-48fa-af00-acf4335f697e",
      "201a8c2d-8d74-43b4-b7df-8f1aa9520da9",
      "595bdb90-c02b-4411-8314-77fe8bcb7e7a",
      "a6236f24-e611-49c7-a51c-1dead0691abd",
      "c67cd363-aff1-4421-bc4f-929fe3103a11",
      "4417a103-7507-4439-8892-1dcf59561fd3",
      "c852347e-17c2-403f-9069-259108372a0b",
      "7b6720af-24d6-42dc-9e42-2ae40ae19ab8",
      "4208288e-00bb-448c-9624-2649cfdc0bb0",
      "116e0b39-9d7c-4385-af07-5f8a1e23b254",
      "26b0a17a-be22-4e3a-ab6f-3eb7ee50998b",
    ]),
  },
  {
    brand: "Nissan",
    model: "Micra",
    year: 2009,
    mileage: 85000,
    price: 2699,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    seats: 5,
    doors: 5,
    powerKw: 48,
    powerCh: 65,
    engineCc: 1240,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 4",
    consumption: "5,90 l/100 km (mixte)",
    exteriorColor: "Argent",
    paintType: "Autres",
    interiorColor: "Gris",
    interiorMaterial: "Tissu",
    equipment: null,
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Nissan Micra 1.2 Essence, Euro 4, 5 portes, seulement 85 000 km, 27/05/2009, 48 kW (65 ch). " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. AIRCO, commande au volant, " +
      "vitres electriques, verrouillage central, retroviseur electrique, direction assistee. " +
      "Griffes autour du vehicule (voir photos). Pour plus d'infos, telephoner.",
    images: imagesFor("8cebc366-1233-40b7-92a6-802c77c866f9", [
      "4a7734ab-c7fe-40f4-ab84-87cb3fae5cf7",
      "24d7c021-cf90-48bb-b595-2083e76c1a1d",
      "47f5fa33-e16f-4059-9077-e599dad331d9",
      "041f00d5-8758-4326-81e3-efe6e8d36c52",
      "4cd5dc3d-0466-4694-8fdd-f2b2fed543fd",
      "9864ae36-a400-4a79-982a-b7e91c8eb80c",
      "3c08253c-00d1-4128-99b6-8ca56118ddd7",
      "8202bdb9-302c-4436-a2c9-3ea173aab738",
      "6b13d9b5-27d0-4505-97db-07205279c3ad",
      "4c6f8073-858f-491a-9b5d-c37c7dc3b09e",
      "b904d37e-c512-4e70-9c03-1467bfaaca3b",
    ]),
  },
  {
    brand: "SEAT",
    model: "Leon",
    year: 2012,
    mileage: 178000,
    price: 3499,
    fuel: "Essence",
    gearbox: "Manuelle",
    status: "available",
    bodyType: "Berline",
    seats: 5,
    doors: 5,
    powerKw: 77,
    powerCh: 105,
    engineCc: 1200,
    gears: 6,
    cylinders: 4,
    emissionClass: "Euro 5",
    consumption: null,
    exteriorColor: "Bleu",
    paintType: "Autres",
    interiorColor: "Gris",
    interiorMaterial: "Tissu",
    equipment: null,
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "SEAT Leon 1.2 TSI, edition COPA Ecomotive, Essence, Euro 5f, 11/07/2012, 178 000 km, 77 kW (105 ch). " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. AIRCO, Start&Stop, CarPlay, sieges chauffants, " +
      "capteurs de stationnement, commande au volant, 4 vitres electriques, retroviseur electrique, " +
      "verrouillage central, direction assistee, jantes alu d'origine. Carnet d'entretien. " +
      "Pour plus d'infos, telephoner.",
    images: imagesFor("81ca904e-30cd-4d58-a96c-303a0067fd72", [
      "13cdf3ce-9074-4566-be4f-0d6c29235328",
      "81dadd39-0c57-4e60-8598-731e2ddc427c",
      "ec475dd6-62e1-44a7-b9c5-de05a43db480",
      "c6813d00-f27e-4ace-9451-47df0f61eee4",
      "b2d7eaf9-887b-49aa-bbe3-e12ca4722113",
      "dcd66e09-9afd-410b-b79f-d7425389fda8",
      "7742115b-0996-4f92-adaf-7268ede082c3",
      "48b1d948-e91f-44de-bf9a-21b0f1bfe176",
      "f3552f4f-c016-49ad-9cff-548cf5fd580e",
      "2882ab22-4f7c-4c06-a27e-b165d3209bd9",
      "4af0db16-99dd-4de3-b35d-f44748c3a31f",
    ]),
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
    seats: 5,
    doors: 5,
    powerKw: 63,
    powerCh: 86,
    engineCc: 1197,
    gears: 5,
    cylinders: 4,
    emissionClass: "Euro 5",
    consumption: "5,90 l/100 km (mixte)",
    exteriorColor: "Argent",
    paintType: "Autres",
    interiorColor: "Gris",
    interiorMaterial: "Tissu",
    equipment: {
      Confort: [
        "Accoudoir",
        "Climatisation automatique",
        "Regulateur de vitesse",
        "Retroviseurs lateraux electriques",
        "Sieges arrieres 1/3 - 2/3",
        "Vitres electriques",
        "Vitres teintees",
        "Volant en cuir",
        "Volant multifonctions",
      ],
      "Divertissement / Medias": ["Ordinateur de bord"],
      Securite: [
        "ABS",
        "Airbag arriere",
        "Airbag avant",
        "Airbag conducteur",
        "Airbag passager",
        "Airbags lateraux",
        "Anti-demarrage",
        "Direction assistee",
        "Feux anti-brouillard",
        "Isofix",
        "Phares de jour",
        "Verrouillage centralise",
      ],
      Autres: ["Jantes alliage", "Roue de secours", "Sieges sport"],
    },
    description:
      "Voiture allemande, dedouanee et prete a etre passee au controle technique. " +
      "Volkswagen Golf 6 Plus 1.2 TSI, Essence, Euro 5, 29/11/2011, seulement 124 000 km, 63 kW (86 ch), 5 portes. " +
      "Interieur et exterieur tres propres, roule tres bien, 2 cles. AIRCO, capteurs de stationnement, " +
      "sieges chauffants, 4 vitres electriques, retroviseur electrique, verrouillage central, direction assistee. " +
      "Carnet d'entretien complet + facture. Pour plus d'infos, telephoner.",
    images: imagesFor("9af0b7ba-e733-4dd7-a429-741afdb503c2", [
      "96e38723-3a01-40dc-aa9b-100ec61fd724",
      "95682cd8-8bc7-41ba-acc2-b3fb7d3ea408",
      "a3f7b8e0-5243-475c-b399-a232155677c8",
      "1dc4336e-cf48-416f-b4df-10b794cb0f1e",
      "c28f51f6-e9c9-4939-aba0-c4f5cc27c811",
      "968a137d-b63d-40a5-bbd8-d7308989ed5a",
      "055ee097-52fb-4c32-b7bb-404279c91650",
      "fbece22c-6754-4db9-807d-95f97a713eaa",
      "72994e50-8569-4548-8963-a592dff1be1b",
      "af853695-48fe-4ceb-b701-506b000ad1e5",
    ]),
  },
];

function run() {
  const db = getDb();

  // Retire les fiches minimales importees precedemment (memes voitures, sans details)
  // pour eviter les doublons.
  const previous = db
    .prepare(
      "SELECT id, reference, brand, model FROM cars WHERE (brand = 'Nissan' AND model = 'Micra') OR (brand = 'SEAT' AND model = 'Leon') OR (brand = 'Volkswagen' AND model = 'Golf Plus')"
    )
    .all();

  for (const row of previous) {
    deleteCar(row.id);
    console.log(`- Ancienne fiche minimale supprimee: ${row.reference}`);
  }

  let imported = 0;
  let failed = 0;

  for (const vehicle of vehicles) {
    const result = createCar(vehicle);

    if (result.error) {
      failed += 1;
      console.warn(`- Echec pour ${vehicle.brand} ${vehicle.model}: ${result.error}`);
      continue;
    }

    imported += 1;
    console.log(
      `- Importee: ${result.car.reference} (${result.car.brand} ${result.car.model}, ${result.car.images.length} photos)`
    );
  }

  console.log(`Termine: ${imported} importee(s), ${failed} echec(s).`);
}

run();
