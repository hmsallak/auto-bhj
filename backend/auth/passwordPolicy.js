// Password rules for self-signup and admin-created accounts:
// at least 10 characters, with an uppercase, a lowercase and a digit,
// rejecting obvious sequences, a small list of common words, and the
// account's own e-mail. Returns an error string, or null when the
// password is acceptable.

const COMMON_WORDS = [
  "password",
  "motdepasse",
  "azerty",
  "qwerty",
  "admin",
  "login",
  "autobhj",
  "auto bhj",
  "bienvenue",
  "welcome",
  "secret",
];

const SEQUENCES = [
  "0123",
  "1234",
  "2345",
  "3456",
  "4567",
  "5678",
  "6789",
  "abcd",
  "qwerty",
  "azerty",
];

function validatePasswordStrength(password, { email = "" } = {}) {
  const pw = String(password || "");

  if (pw.length < 10) {
    return "Le mot de passe doit contenir au moins 10 caracteres.";
  }
  if (!/[a-z]/.test(pw)) return "Ajoute au moins une lettre minuscule.";
  if (!/[A-Z]/.test(pw)) return "Ajoute au moins une lettre majuscule.";
  if (!/[0-9]/.test(pw)) return "Ajoute au moins un chiffre.";

  const lower = pw.toLowerCase();

  if (/(.)\1{3,}/.test(lower)) {
    return "Evite de repeter quatre fois le meme caractere.";
  }
  if (SEQUENCES.some((seq) => lower.includes(seq))) {
    return "Evite les suites de touches ou de chiffres (1234, azerty...).";
  }
  if (COMMON_WORDS.some((word) => lower.includes(word))) {
    return "Ce mot de passe est trop courant.";
  }

  const localPart = String(email).toLowerCase().split("@")[0];
  if (localPart && localPart.length >= 3 && lower.includes(localPart)) {
    return "Le mot de passe ne doit pas contenir ton adresse e-mail.";
  }

  return null;
}

module.exports = { validatePasswordStrength };
