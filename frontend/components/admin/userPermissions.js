export const USER_PERMISSIONS = [
  {
    key: "stock_read",
    group: "Vehicules",
    label: "Lecture",
    description: "Voir la liste du stock et les fiches vehicules.",
  },
  {
    key: "stock_write",
    group: "Vehicules",
    label: "Ecriture",
    description: "Modifier les informations d'une voiture existante.",
  },
  {
    key: "stock_create",
    group: "Vehicules",
    label: "Creer voiture",
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
];

export const USER_PERMISSION_GROUPS = [...new Set(USER_PERMISSIONS.map((permission) => permission.group))];

export function permissionLabel(key) {
  return USER_PERMISSIONS.find((permission) => permission.key === key)?.label || key;
}
