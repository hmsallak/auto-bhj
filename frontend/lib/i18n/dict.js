// Dictionnaire de traduction FR / NL du site public.
// - Bascule 100% cote client (cookie "lang"), meme URL, changement instantane.
// - Cle absente en NL -> repli automatique sur le FR -> repli sur la cle brute.
// On remplit ce fichier section par section.

export const LANGS = ["fr", "nl"];
export const DEFAULT_LANG = "fr";
export const LANG_COOKIE = "lang";

export const DICT = {
  fr: {
    nav: {
      home: "Accueil",
      stock: "Nos véhicules",
      faq: "FAQ",
      contact: "Contact",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
    },
    footer: {
      tagline: "Véhicules d'occasion contrôlés, à Sint-Pieters-Leeuw.",
      navTitle: "Navigation",
      home: "Accueil",
      stock: "Stock",
      faq: "FAQ",
      contactTitle: "Contact",
      legalTitle: "Informations légales",
      mentions: "Mentions légales",
      privacy: "Politique de confidentialité",
      cookies: "Politique cookies",
      terms: "Conditions générales",
      rights: "Tous droits réservés.",
    },
    hero: {
      title1: "Votre voiture d'occasion",
      title2: "au juste prix",
      subtitle:
        "Des véhicules fiables et révisés pour les jeunes conducteurs, les familles et tous ceux qui cherchent une voiture pratique sans dépasser leur budget.",
    },
    journey: {
      eyebrow: "Le parcours",
      title: "Comment ca se passe ?",
      cta: "Voir nos vehicules →",
      stepAria: "Etape",
      steps: [
        {
          title: "Decouvrez le vehicule",
          description:
            "Consultez les informations du vehicule sur notre site puis contactez-nous pour organiser une visite.",
        },
        {
          title: "Visitez & essayez",
          description:
            "Examinez tranquillement le vehicule et effectuez un essai, sans pression commerciale.",
        },
        {
          title: "Controle technique",
          description:
            "Le vehicule suit les formalites necessaires et passe au controle technique avant la vente.",
        },
        {
          title: "Votre voiture est prete",
          description:
            "Documents prepares, remise des cles : il ne reste plus qu'a prendre la route.",
        },
      ],
    },
    about: {
      eyebrow: "A propos de nous",
      title: "Auto BHJ, votre partenaire de confiance",
      subtitle:
        "Une entreprise familiale passionnee par l'automobile et engagee a vous proposer des vehicules d'occasion fiables au juste prix.",
      imgAlt: "Le hall d'exposition Auto BHJ",
      who: "Qui sommes-nous ?",
      h3pre: "Une entreprise familiale a votre service depuis ",
      h3strong: "plus de 10 ans",
      p1: "Chez Auto BHJ, nous croyons qu'acheter une voiture doit rester simple, transparent et accessible.",
      p2pre: "C'est pourquoi nous selectionnons avec soin chaque vehicule afin de vous proposer le ",
      p2strong: "meilleur rapport qualite/prix",
      p3: "Que vous soyez jeune conducteur, une famille ou simplement a la recherche d'un vehicule fiable pour votre quotidien, nous sommes la pour vous accompagner a chaque etape.",
      points: [
        "Vehicules selectionnes avec soin",
        "Prix justes et transparents",
        "Conseils honnetes et personnalises",
      ],
      pillars: [
        { title: "Entreprise familiale", text: "Une equipe passionnee a votre ecoute." },
        {
          title: "Confiance & transparence",
          text: "Des informations claires et un accompagnement honnete.",
        },
        { title: "Accompagnement", text: "Nous vous guidons avant, pendant et apres l'achat." },
        {
          title: "Vehicules fiables",
          text: "Controles et prepares pour rouler en toute serenite.",
        },
      ],
    },
    young: {
      eyebrow: "Jeune conducteur",
      title: "Votre premiere voiture, sans exploser votre budget.",
      text: "Permis en poche ou encore en apprentissage ? Decouvrez nos petites voitures d'occasion selectionnees pour vos premiers kilometres et vos trajets du quotidien.",
      imgAlt:
        "Jeune conducteur souriant appuye sur sa premiere voiture, plaque d'apprentissage L sur le toit",
      benefits: [
        { title: "Budget accessible", text: "Des vehicules adaptes a un premier achat." },
        {
          title: "Pratique au quotidien",
          text: "Ecole, travail, formation ou petits deplacements.",
        },
        { title: "Vehicules revises", text: "Pour commencer a conduire avec plus de serenite." },
      ],
      cta: "Voir les voitures petit budget",
      link: "Decouvrir notre catalogue",
    },
    contact: {
      aria: "Nous contacter",
      eyebrow: "Une question, une voiture qui vous plait ?",
      title: "Contactez-nous, on repond vite",
      waText: "Bonjour Auto BHJ, je souhaite prendre rendez-vous pour une voiture.",
      quick: "Message rapide",
      call: "Appel direct",
      email: "Par e-mail",
      appointment: "Sur rendez-vous",
    },
    latest: {
      eyebrow: "Notre stock",
      title: "Nos dernieres voitures arrivees",
      text: "Un apercu des vehicules recemment mis en ligne. Retrouvez tout le stock, avec les filtres, sur la page catalogue.",
      loading: "Chargement du stock...",
      cta: "Voir toutes nos voitures",
    },
    grid: { empty: "Aucune voiture disponible pour le moment." },
    stock: {
      eyebrow: "Catalogue",
      h1: "Trouvez la voiture ideale",
      intro:
        "Des occasions soigneusement selectionnees, pretes a prendre la route, avec des prix clairs et un accompagnement simple du premier contact a la remise des cles.",
      searchPlaceholder: "Reference, marque, modele, carburant...",
      moreFilters: "Plus de filtres",
      lessFilters: "Moins de filtres",
      sortPrefix: "Trier",
      clearOne: "Effacer filtre",
      clearAll: "Effacer les filtres",
      budget: "Budget (EUR)",
      min: "Min",
      max: "Max",
      budgetMinAria: "Budget minimum",
      budgetMaxAria: "Budget maximum",
      price: "Prix",
      resultOne: "resultat",
      resultMany: "resultats",
      loading: "Chargement du stock...",
      nextPage: "Page suivante",
      paginationAria: "Pagination du stock",
      activeFiltersAria: "Filtres actifs",
      yearAndUp: "et plus",
      labels: {
        brand: "Marque",
        model: "Modele",
        body: "Carrosserie",
        fuel: "Carburant",
        gearbox: "Boite de vitesse",
        status: "Disponibilite",
        yearMin: "Annee minimum",
        kmMax: "Kilometrage max",
        km: "Kilometres",
      },
      defaults: {
        brand: "Toutes les marques",
        model: "Tous les modeles",
        body: "Toutes",
        fuel: "Tous",
        gearbox: "Toutes",
        status: "Tous les statuts",
        year: "Toutes",
        km: "Tous les km",
        brandShort: "Marque",
        gearboxShort: "Boite de vitesse",
        fuelShort: "Carburant",
        kmShort: "Kilometres",
      },
      sort: {
        recommended: "Pertinence",
        newest: "Plus recents",
        price_asc: "Prix croissant",
        price_desc: "Prix decroissant",
        km_asc: "Kilometrage bas",
        year_desc: "Annee recente",
      },
      chips: {
        search: "Recherche",
        brand: "Marque",
        model: "Modele",
        body: "Carrosserie",
        status: "Disponibilite",
        min: "Min",
        max: "Max",
        since: "Depuis",
        fuel: "Carburant",
        gearbox: "Boite",
      },
    },
    fiche: {
      back: "Retour a la liste des vehicules",
      backAria: "Retour",
      priceContactAria: "Prix et contact",
      respondFast: "Appel direct ou message, nous vous repondons rapidement.",
      byAppointment: "Visite sur rendez-vous · FR / NL",
      directions: "Voir l'itineraire",
      locationAria: "Localisation du garage",
      openMapAria: "Ouvrir la carte dans Google Maps",
      mapAlt: "Plan d'acces - Auto BHJ, Mekingenweg 99, Sint-Pieters-Leeuw",
    },
    spec: {
      year: "Annee",
      mileage: "Kilometrage",
      fuel: "Carburant",
      gearbox: "Boite",
      power: "Puissance",
      euro: "Norme Euro",
      techTitle: "Caracteristiques techniques",
      equipmentTitle: "Equipements",
      descriptionTitle: "Description",
      noDescription: "Contactez-nous pour plus d'informations.",
      sections: {
        identity: "Identite & carrosserie",
        engine: "Motorisation & performance",
        inout: "Exterieur & interieur",
        history: "Historique",
      },
      rows: {
        brand: "Marque",
        model: "Modele",
        bodyType: "Type de carrosserie",
        doors: "Portes",
        seats: "Sieges",
        fuel: "Carburant",
        gearbox: "Boite de vitesses",
        gears: "Nombre de vitesses",
        cylinders: "Cylindres",
        engineCc: "Cylindree",
        power: "Puissance",
        consumption: "Consommation",
        exteriorColor: "Couleur exterieure",
        paintType: "Type de peinture",
        interiorColor: "Couleur interieure",
        interiorMaterial: "Materiau interieur",
        previousOwners: "Proprietaires precedents",
      },
    },
    actions: {
      contact: "Contacter",
      mailSubject: "Vehicule",
      mailBody: "Bonjour Auto BHJ, je suis interesse par le vehicule",
      mailSubjectGeneric: "Demande d'information",
      mailBodyGeneric: "Bonjour Auto BHJ, je souhaite des informations sur une voiture.",
    },
    bar: {
      call: "Appeler",
      contact: "Contacter",
      waMsg: "Bonjour Auto BHJ, je suis interesse par le vehicule",
      waMsgGeneric: "Bonjour Auto BHJ, je souhaite des informations sur une voiture.",
      waAria: "Ecrire sur WhatsApp au sujet du vehicule",
      waAriaGeneric: "Ecrire sur WhatsApp a Auto BHJ",
    },
    apptForm: {
      defaultMessage:
        "Bonjour,\n\nVotre vehicule m'interesse. Je souhaiterais convenir d'un rendez-vous pour le voir ; merci de m'indiquer vos disponibilites.\n\nCordialement,",
      aria: "Nous contacter au sujet de ce vehicule",
      title: "Nous contacter",
      yourMessage: "Votre message",
      name: "Nom",
      email: "Email",
      phone: "Telephone",
      vehiclePrefix: "Vehicule",
      consentPre:
        "J'accepte qu'Auto BHJ utilise mes coordonnees pour repondre a ma demande. Elles ne sont pas communiquees a des tiers et je peux en demander la suppression a tout moment. En savoir plus : ",
      consentLink: "politique de confidentialite",
      errConsent: "Merci de cocher la case d'acceptation.",
      errSend: "Envoi impossible. Reessayez dans un instant.",
      errNetwork: "Envoi impossible. Verifiez votre connexion.",
      success: "Merci, nous vous recontactons rapidement.",
      submit: "Envoyer la demande",
      sending: "Envoi...",
      sent: "Envoye !",
    },
    share: {
      copied: "Lien copie",
      shareAria: "Partager cette annonce",
      printAria: "Imprimer cette fiche",
    },
    gallery: {
      close: "Fermer",
      prev: "Photo precedente",
      next: "Photo suivante",
      openAria: "Voir toutes les photos en plein ecran",
      noPhoto: "Pas de photo",
      sold: "Vehicule vendu",
      soldPhotos: "Photos non disponibles",
      allPhotos: "Toutes les photos",
      showPhoto: "Afficher la photo",
      photo: "photo",
    },
    faqPage: {
      eyebrow: "FAQ",
      title: "Questions frequentes",
      intro:
        "Retrouvez ici les reponses aux questions les plus courantes avant de venir voir une voiture.",
      otherQ: "Une autre question ?",
      otherQText: "Notre equipe est disponible pour vous repondre rapidement.",
      contactBtn: "Nous contacter",
      listAria: "Questions frequentes Auto BHJ",
      trust: [
        { title: "Visite sur rendez-vous", text: "Simple et calme" },
        { title: "Vehicules controles", text: "Informations claires" },
        { title: "Equipe a votre ecoute", text: "Conseils et accompagnement" },
      ],
      items: [
        {
          question: "Comment se passe la visite d'un vehicule ?",
          answer:
            "Vous prenez rendez-vous par telephone ou WhatsApp. On confirme la disponibilite du vehicule, puis vous venez le voir tranquillement sur place.",
        },
        {
          question: "Puis-je faire un essai routier ?",
          answer:
            "Oui, un essai est possible sur rendez-vous avec votre permis de conduire. L'objectif est de vous laisser verifier la voiture sans pression.",
        },
        {
          question: "Les vehicules sont-ils controles ?",
          answer:
            "Chaque vehicule est verifie avant la mise en vente : etat general, documents, kilometrage et points importants visibles avant la visite.",
        },
        {
          question: "Le prix affiche est-il clair ?",
          answer:
            "Oui. Nous affichons un prix simple et lisible pour que vous puissiez comparer rapidement et avancer sans mauvaise surprise.",
        },
        {
          question: "Proposez-vous une garantie ?",
          answer:
            "Les conditions de garantie dependent du vehicule. Elles sont expliquees clairement avant l'achat afin que tout soit compris par ecrit.",
        },
        {
          question: "Comment vous contacter rapidement ?",
          answer:
            "Le plus simple est de nous appeler au 0483 20 88 01 ou de nous envoyer un message WhatsApp. Nous repondons rapidement aux demandes.",
        },
      ],
    },
    legal: { updated: "Derniere mise a jour :" },
    cookie: {
      title: "Cookies",
      text: "Nous utilisons des cookies necessaires au fonctionnement du site et, avec votre accord, des cookies de mesure d'audience ou de marketing.",
      more: "En savoir plus",
      acceptAll: "Tout accepter",
      rejectAll: "Tout refuser",
      customize: "Personnaliser",
      save: "Enregistrer mes choix",
      alwaysOn: "Toujours actif",
      manage: "Gerer les cookies",
      necessary: "Necessaires",
      necessaryDesc:
        "Indispensables au fonctionnement du site (langue, session). Toujours actifs.",
      analytics: "Mesure d'audience",
      analyticsDesc:
        "Statistiques de visite anonymisees pour ameliorer le site. Aucun outil de ce type n'est actif aujourd'hui.",
      marketing: "Marketing",
      marketingDesc:
        "Personnalisation et publicite. Aucun outil de ce type n'est actif aujourd'hui.",
    },
  },

  nl: {
    nav: {
      home: "Home",
      stock: "Onze wagens",
      faq: "FAQ",
      contact: "Contact",
      openMenu: "Menu openen",
      closeMenu: "Menu sluiten",
    },
    footer: {
      tagline: "Gecontroleerde tweedehandswagens in Sint-Pieters-Leeuw.",
      navTitle: "Navigatie",
      home: "Home",
      stock: "Aanbod",
      faq: "FAQ",
      contactTitle: "Contact",
      legalTitle: "Wettelijke informatie",
      mentions: "Wettelijke vermeldingen",
      privacy: "Privacybeleid",
      cookies: "Cookiebeleid",
      terms: "Algemene voorwaarden",
      rights: "Alle rechten voorbehouden.",
    },
    hero: {
      title1: "Uw tweedehandswagen",
      title2: "aan de juiste prijs",
      subtitle:
        "Betrouwbare, nagekeken wagens voor jonge bestuurders, gezinnen en iedereen die een praktische auto zoekt zonder zijn budget te overschrijden.",
    },
    journey: {
      eyebrow: "Het traject",
      title: "Hoe verloopt het?",
      cta: "Bekijk onze wagens →",
      stepAria: "Stap",
      steps: [
        {
          title: "Ontdek de wagen",
          description:
            "Bekijk de gegevens van de wagen op onze site en neem contact op om een bezoek te regelen.",
        },
        {
          title: "Kom langs & test",
          description:
            "Bekijk de wagen rustig en maak een testrit, zonder verkoopdruk.",
        },
        {
          title: "Technische keuring",
          description:
            "De wagen doorloopt de nodige formaliteiten en gaat door de technische keuring voor de verkoop.",
        },
        {
          title: "Uw wagen staat klaar",
          description:
            "Documenten klaar, sleutels overhandigd: u kunt meteen de baan op.",
        },
      ],
    },
    about: {
      eyebrow: "Over ons",
      title: "Auto BHJ, uw betrouwbare partner",
      subtitle:
        "Een familiebedrijf met passie voor auto's, dat u betrouwbare tweedehandswagens aan de juiste prijs wil aanbieden.",
      imgAlt: "De toonzaal van Auto BHJ",
      who: "Wie zijn wij?",
      h3pre: "Een familiebedrijf tot uw dienst sinds ",
      h3strong: "meer dan 10 jaar",
      p1: "Bij Auto BHJ vinden we dat een auto kopen eenvoudig, transparant en toegankelijk moet blijven.",
      p2pre: "Daarom kiezen we elke wagen met zorg om u de ",
      p2strong: "beste prijs-kwaliteitverhouding",
      p3: "Of u nu een jonge bestuurder bent, een gezin of gewoon op zoek naar een betrouwbare wagen voor elke dag: wij begeleiden u bij elke stap.",
      points: [
        "Wagens met zorg geselecteerd",
        "Eerlijke en transparante prijzen",
        "Eerlijk en persoonlijk advies",
      ],
      pillars: [
        { title: "Familiebedrijf", text: "Een gepassioneerd team dat naar u luistert." },
        {
          title: "Vertrouwen & transparantie",
          text: "Duidelijke informatie en eerlijke begeleiding.",
        },
        { title: "Begeleiding", text: "Wij begeleiden u voor, tijdens en na de aankoop." },
        {
          title: "Betrouwbare wagens",
          text: "Gekeurd en klaargemaakt om zorgeloos te rijden.",
        },
      ],
    },
    young: {
      eyebrow: "Jonge bestuurder",
      title: "Uw eerste wagen, zonder uw budget te laten ontploffen.",
      text: "Rijbewijs op zak of nog in opleiding? Ontdek onze kleine tweedehandswagens, geselecteerd voor uw eerste kilometers en uw dagelijkse ritten.",
      imgAlt:
        "Lachende jonge bestuurder die tegen zijn eerste wagen leunt, L-plaat op het dak",
      benefits: [
        { title: "Betaalbaar budget", text: "Wagens die passen bij een eerste aankoop." },
        {
          title: "Praktisch elke dag",
          text: "School, werk, opleiding of korte verplaatsingen.",
        },
        { title: "Nagekeken wagens", text: "Om met een geruster gevoel te beginnen rijden." },
      ],
      cta: "Bekijk de wagens met klein budget",
      link: "Ontdek ons aanbod",
    },
    contact: {
      aria: "Contacteer ons",
      eyebrow: "Een vraag, een wagen die u bevalt?",
      title: "Contacteer ons, wij antwoorden snel",
      waText: "Hallo Auto BHJ, ik wil graag een afspraak maken voor een wagen.",
      quick: "Snel bericht",
      call: "Rechtstreeks bellen",
      email: "Via e-mail",
      appointment: "Op afspraak",
    },
    latest: {
      eyebrow: "Ons aanbod",
      title: "Onze laatst binnengekomen wagens",
      text: "Een greep uit de recent online geplaatste wagens. Het volledige aanbod, met filters, vindt u op de aanbodpagina.",
      loading: "Aanbod laden...",
      cta: "Bekijk al onze wagens",
    },
    grid: { empty: "Op dit moment geen wagens beschikbaar." },
    stock: {
      eyebrow: "Aanbod",
      h1: "Vind de ideale wagen",
      intro:
        "Zorgvuldig geselecteerde occasies, klaar voor de baan, met duidelijke prijzen en eenvoudige begeleiding van het eerste contact tot de sleuteloverdracht.",
      searchPlaceholder: "Referentie, merk, model, brandstof...",
      moreFilters: "Meer filters",
      lessFilters: "Minder filters",
      sortPrefix: "Sorteren",
      clearOne: "Filter wissen",
      clearAll: "Filters wissen",
      budget: "Budget (EUR)",
      min: "Min",
      max: "Max",
      budgetMinAria: "Minimumbudget",
      budgetMaxAria: "Maximumbudget",
      price: "Prijs",
      resultOne: "resultaat",
      resultMany: "resultaten",
      loading: "Aanbod laden...",
      nextPage: "Volgende pagina",
      paginationAria: "Paginering aanbod",
      activeFiltersAria: "Actieve filters",
      yearAndUp: "en meer",
      labels: {
        brand: "Merk",
        model: "Model",
        body: "Carrosserie",
        fuel: "Brandstof",
        gearbox: "Versnellingsbak",
        status: "Beschikbaarheid",
        yearMin: "Minimumjaar",
        kmMax: "Max. kilometerstand",
        km: "Kilometers",
      },
      defaults: {
        brand: "Alle merken",
        model: "Alle modellen",
        body: "Alle",
        fuel: "Alle",
        gearbox: "Alle",
        status: "Alle statussen",
        year: "Alle",
        km: "Alle km",
        brandShort: "Merk",
        gearboxShort: "Versnellingsbak",
        fuelShort: "Brandstof",
        kmShort: "Kilometers",
      },
      sort: {
        recommended: "Relevantie",
        newest: "Nieuwste",
        price_asc: "Prijs oplopend",
        price_desc: "Prijs aflopend",
        km_asc: "Laagste kilometerstand",
        year_desc: "Recent bouwjaar",
      },
      chips: {
        search: "Zoeken",
        brand: "Merk",
        model: "Model",
        body: "Carrosserie",
        status: "Beschikbaarheid",
        min: "Min",
        max: "Max",
        since: "Vanaf",
        fuel: "Brandstof",
        gearbox: "Versnellingsbak",
      },
    },
    fiche: {
      back: "Terug naar het aanbod",
      backAria: "Terug",
      priceContactAria: "Prijs en contact",
      respondFast: "Bel of stuur een bericht, wij antwoorden snel.",
      byAppointment: "Bezoek op afspraak · FR / NL",
      directions: "Bekijk de route",
      locationAria: "Locatie van de garage",
      openMapAria: "Kaart openen in Google Maps",
      mapAlt: "Routeplan - Auto BHJ, Mekingenweg 99, Sint-Pieters-Leeuw",
    },
    spec: {
      year: "Bouwjaar",
      mileage: "Kilometerstand",
      fuel: "Brandstof",
      gearbox: "Versnellingsbak",
      power: "Vermogen",
      euro: "Euronorm",
      techTitle: "Technische kenmerken",
      equipmentTitle: "Uitrusting",
      descriptionTitle: "Beschrijving",
      noDescription: "Neem contact op voor meer informatie.",
      sections: {
        identity: "Identiteit & carrosserie",
        engine: "Motor & prestaties",
        inout: "Exterieur & interieur",
        history: "Historiek",
      },
      rows: {
        brand: "Merk",
        model: "Model",
        bodyType: "Carrosserietype",
        doors: "Deuren",
        seats: "Zetels",
        fuel: "Brandstof",
        gearbox: "Versnellingsbak",
        gears: "Aantal versnellingen",
        cylinders: "Cilinders",
        engineCc: "Cilinderinhoud",
        power: "Vermogen",
        consumption: "Verbruik",
        exteriorColor: "Buitenkleur",
        paintType: "Laktype",
        interiorColor: "Binnenkleur",
        interiorMaterial: "Interieurmateriaal",
        previousOwners: "Vorige eigenaars",
      },
    },
    actions: {
      contact: "Contacteren",
      mailSubject: "Wagen",
      mailBody: "Hallo Auto BHJ, ik ben geinteresseerd in wagen",
      mailSubjectGeneric: "Informatieaanvraag",
      mailBodyGeneric: "Hallo Auto BHJ, ik wil graag info over een wagen.",
    },
    bar: {
      call: "Bellen",
      contact: "Contacteren",
      waMsg: "Hallo Auto BHJ, ik ben geinteresseerd in wagen",
      waMsgGeneric: "Hallo Auto BHJ, ik wil graag info over een wagen.",
      waAria: "WhatsApp sturen over wagen",
      waAriaGeneric: "WhatsApp sturen naar Auto BHJ",
    },
    apptForm: {
      defaultMessage:
        "Hallo,\n\nUw wagen interesseert mij. Ik zou graag een afspraak maken om hem te bekijken; laat me weten wanneer het u past.\n\nMet vriendelijke groeten,",
      aria: "Contacteer ons over deze wagen",
      title: "Contacteer ons",
      yourMessage: "Uw bericht",
      name: "Naam",
      email: "E-mail",
      phone: "Telefoon",
      vehiclePrefix: "Wagen",
      consentPre:
        "Ik ga ermee akkoord dat Auto BHJ mijn gegevens gebruikt om mijn vraag te beantwoorden. Ze worden niet aan derden doorgegeven en ik kan de verwijdering ervan op elk moment vragen. Meer info: ",
      consentLink: "privacybeleid",
      errConsent: "Vink het vakje aan om akkoord te gaan.",
      errSend: "Verzenden mislukt. Probeer het zo dadelijk opnieuw.",
      errNetwork: "Verzenden mislukt. Controleer uw verbinding.",
      success: "Bedankt, wij nemen snel contact met u op.",
      submit: "Aanvraag versturen",
      sending: "Versturen...",
      sent: "Verstuurd!",
    },
    share: {
      copied: "Link gekopieerd",
      shareAria: "Deze advertentie delen",
      printAria: "Deze fiche afdrukken",
    },
    gallery: {
      close: "Sluiten",
      prev: "Vorige foto",
      next: "Volgende foto",
      openAria: "Alle foto's op volledig scherm bekijken",
      noPhoto: "Geen foto",
      sold: "Wagen verkocht",
      soldPhotos: "Foto's niet beschikbaar",
      allPhotos: "Alle foto's",
      showPhoto: "Foto tonen",
      photo: "foto",
    },
    faqPage: {
      eyebrow: "FAQ",
      title: "Veelgestelde vragen",
      intro:
        "Hier vindt u de antwoorden op de meest voorkomende vragen voordat u een wagen komt bekijken.",
      otherQ: "Nog een vraag?",
      otherQText: "Ons team staat klaar om u snel te antwoorden.",
      contactBtn: "Contacteer ons",
      listAria: "Veelgestelde vragen Auto BHJ",
      trust: [
        { title: "Bezoek op afspraak", text: "Eenvoudig en rustig" },
        { title: "Gecontroleerde wagens", text: "Duidelijke informatie" },
        { title: "Team dat naar u luistert", text: "Advies en begeleiding" },
      ],
      items: [
        {
          question: "Hoe verloopt een bezoek aan een wagen?",
          answer:
            "U maakt een afspraak via telefoon of WhatsApp. Wij bevestigen de beschikbaarheid van de wagen en daarna komt u hem rustig ter plaatse bekijken.",
        },
        {
          question: "Kan ik een proefrit maken?",
          answer:
            "Ja, een proefrit is mogelijk op afspraak, met uw rijbewijs. Zo kunt u de wagen zonder druk controleren.",
        },
        {
          question: "Worden de wagens gecontroleerd?",
          answer:
            "Elke wagen wordt nagekeken voor de verkoop: algemene staat, documenten, kilometerstand en belangrijke punten die voor het bezoek zichtbaar zijn.",
        },
        {
          question: "Is de weergegeven prijs duidelijk?",
          answer:
            "Ja. Wij tonen een eenvoudige, leesbare prijs zodat u snel kunt vergelijken en verder kunt zonder verrassingen.",
        },
        {
          question: "Bieden jullie een garantie?",
          answer:
            "De garantievoorwaarden hangen af van de wagen. Ze worden duidelijk uitgelegd voor de aankoop, zodat alles schriftelijk begrepen is.",
        },
        {
          question: "Hoe kan ik u snel bereiken?",
          answer:
            "Het eenvoudigst is bellen naar 0483 20 88 01 of ons een WhatsApp-bericht sturen. Wij antwoorden snel op aanvragen.",
        },
      ],
    },
    legal: { updated: "Laatste update:" },
    cookie: {
      title: "Cookies",
      text: "We gebruiken cookies die nodig zijn voor de werking van de site en, met uw toestemming, cookies voor bezoekmeting of marketing.",
      more: "Meer info",
      acceptAll: "Alles aanvaarden",
      rejectAll: "Alles weigeren",
      customize: "Aanpassen",
      save: "Mijn keuzes bewaren",
      alwaysOn: "Altijd actief",
      manage: "Cookies beheren",
      necessary: "Noodzakelijk",
      necessaryDesc:
        "Onmisbaar voor de werking van de site (taal, sessie). Altijd actief.",
      analytics: "Bezoekmeting",
      analyticsDesc:
        "Geanonimiseerde bezoekstatistieken om de site te verbeteren. Op dit moment is geen enkel dergelijk hulpmiddel actief.",
      marketing: "Marketing",
      marketingDesc:
        "Personalisatie en reclame. Op dit moment is geen enkel dergelijk hulpmiddel actief.",
    },
  },
};

// Valeurs "enum" des voitures (stockees en francais en base). Le libelle
// affiche est traduit ; la valeur brute (cle de filtre) ne change jamais.
export const CAR_ENUMS = {
  fr: {
    status: { available: "Disponible", reserved: "Reserve", sold: "Vendu" },
    fuel: {},
    gearbox: {},
    body: {},
    powerUnit: "ch",
    kmSuffix: "km",
  },
  nl: {
    status: { available: "Beschikbaar", reserved: "Gereserveerd", sold: "Verkocht" },
    fuel: {
      essence: "Benzine",
      diesel: "Diesel",
      hybride: "Hybride",
      "hybride rechargeable": "Plug-in hybride",
      electrique: "Elektrisch",
      lpg: "LPG",
      gpl: "LPG",
    },
    gearbox: {
      manuelle: "Handgeschakeld",
      automatique: "Automaat",
      "semi-automatique": "Semi-automaat",
    },
    body: {
      berline: "Sedan",
      citadine: "Stadswagen",
      break: "Break",
      suv: "SUV",
      monospace: "Monovolume",
      cabriolet: "Cabrio",
      coupe: "Coupe",
      "4x4": "4x4",
      "pick-up": "Pick-up",
      utilitaire: "Bestelwagen",
    },
    powerUnit: "pk",
    kmSuffix: "km",
  },
};

// Resout une cle pointee ("hero.title1") dans un objet.
export function lookup(lang, key) {
  const fromLang = key.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), DICT[lang]);
  if (fromLang != null) return fromLang;
  const fromFr = key.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), DICT.fr);
  return fromFr != null ? fromFr : key;
}
