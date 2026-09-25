export const USER_PERMISSIONS = [
  {
    key: "stock_read",
    group: "Vehicules",
    label: "Lire voiture",
    description: "Voir la liste du stock et les fiches vehicules.",
  },
  {
    key: "stock_write",
    group: "Vehicules",
    label: "Modifier voiture",
    description: "Modifier une voiture existante, dont son statut (reservee, vendue).",
  },
  {
    key: "stock_create",
    group: "Vehicules",
    label: "Rajouter voiture",
    description: "Ajouter une nouvelle voiture au catalogue.",
  },
  {
    key: "stock_delete",
    group: "Vehicules",
    label: "Supprimer voiture",
    description: "Retirer definitivement une voiture du stock.",
  },
  {
    key: "messages_read",
    group: "Messages",
    label: "Lire message",
    description: "Consulter les demandes recues depuis le site.",
  },
  {
    key: "messages_delete",
    group: "Messages",
    label: "Supprimer message",
    description: "Supprimer une demande client.",
  },
  {
    key: "appointments_create",
    group: "Rendez-vous",
    label: "Planifier RDV",
    description: "Planifier et modifier un rendez-vous (depuis une demande ou a la main).",
  },
  {
    key: "appointments_cancel",
    group: "Rendez-vous",
    label: "Annuler RDV",
    description: "Annuler un rendez-vous (le client est prevenu par e-mail).",
  },
];

// Seeing the appointments needs either appointment right.
export const APPOINTMENT_VIEW_PERMISSIONS = ["appointments_create", "appointments_cancel"];

export const USER_PERMISSION_GROUPS = [...new Set(USER_PERMISSIONS.map((permission) => permission.group))];

export function permissionLabel(key) {
  return USER_PERMISSIONS.find((permission) => permission.key === key)?.label || key;
}
