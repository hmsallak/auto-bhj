// Version history shown in Admin > Parametres. Newest first; the first
// entry is the current version. Add an entry with each release pushed to
// production (date = the day it went live).

export const CHANGELOG = [
  {
    version: "1.5.0",
    date: "2026-09-25",
    title: "Onglet Parametres",
    // Short, user-facing "Nouveautes" shown to everyone in Parametres > A propos;
    // `changes` is the detailed list (owner-only history).
    highlights: [
      "Choix des notifications et rappels de rendez-vous",
      "Parametres et Utilisateurs reorganises",
      "Nouveaux droits : Planifier et Annuler un rendez-vous",
    ],
    changes: [
      "Nouvel onglet Parametres : choix des types de notifications",
      "Notifications : nouvelles demandes, rappel 1 h avant un rendez-vous, resume du matin, demandes d'acces",
      "Un tap sur une notification ouvre directement le message ou le rendez-vous",
      "Parametres et Utilisateurs en style application : onglets et lignes a deplier",
      "Coordonnees du site, mot de passe et e-mail regroupes dans Parametres",
      "Nouveaux droits par utilisateur : Planifier RDV et Annuler RDV",
      "Journal par categorie (voitures, messages, rendez-vous, parametres), vidable par l'admin",
      "Historique des mises a jour",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-09-24",
    title: "Application Android BHJ Admin",
    changes: [
      "Application Android a installer (sans barre d'adresse)",
      "Admin installable sur l'ecran d'accueil",
      "Cloche de notifications : activation et notification de test",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-09-24",
    title: "Accueil et rendez-vous",
    changes: [
      "Accueil : le parcours d'achat tourne tout seul, sans bloquer le defilement",
      "Rendez-vous client : annulation uniquement par telephone",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-09-24",
    title: "Tableau de bord et rendez-vous",
    changes: [
      "Nouveau tableau de bord : stock, a traiter, age du stock",
      "Rendez-vous : planifier, modifier, annuler, fiche client",
      "E-mail de confirmation au client avec ajout a l'agenda",
      "Demandes en boite de reception, vehicules filtres par statut",
    ],
  },
  {
    version: "1.1.1",
    date: "2026-09-21",
    title: "Photos et corrections",
    changes: [
      "Visuels \"Photos en attente\" et \"Vendue !\" quand une photo manque",
      "Icone du site = logo Auto BHJ",
      "Correction du bouton Suivant pour les voitures vendues",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-08-28",
    title: "Site bilingue et referencement",
    changes: [
      "Site en francais et en neerlandais",
      "Bandeau de cookies, referencement Google complet",
      "Nouvelle fiche vehicule et import du catalogue 2ememain",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-08-27",
    title: "Lancement",
    changes: ["Site public et administration Auto BHJ", "Coordonnees du site modifiables depuis l'admin"],
  },
];

export const CURRENT_VERSION = CHANGELOG[0];
