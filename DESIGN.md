# Design system Auto BHJ

Regles de design/CSS extraites de la page d'accueil (etat au 2026-08-24),
qui fait reference. Avant de coder une nouvelle section ou un nouveau
composant : verifier ici d'abord plutot que d'inventer une nouvelle valeur
ou de redefinir un style deja existant sous un autre nom. Si une regle ici
ne convient plus, on la change ICI puis on repercute -- on ne cree pas une
variante de plus a cote.

Tous les tokens cites vivent dans `frontend/app/globals.css`, bloc `:root`.

## 1. Couleurs / fond d'ecran

Le site alterne deux "systemes" de fond, jamais un fond arbitraire choisi
au cas par cas :

| Systeme | Fond section | Texte principal | Texte attenue | Bordure/ligne |
| --- | --- | --- | --- | --- |
| **Carbon** (sombre) | `var(--carbon)` `#1b2329` | `var(--carbon-text)` `#f2f0ec` | `var(--carbon-text-dim)` `#9a9a9f` | `var(--carbon-line)` |
| **Paper** (clair) | `#f4f3f4` (variante actuelle du fond clair -- voir note) | `var(--paper-ink)` `#17160f` | `var(--paper-muted)` `#6b6a64` | `var(--paper-line)` |

- **Rouge de marque** : `var(--signal)` `#e11d2e`, hover/actif `var(--signal-dim)` `#7a1019`. Seule couleur d'accent du site -- pas de bleu/vert/orange decoratif en general. Deux exceptions deliberees, a garder isolees et ne pas laisser s'etendre : l'orange `#f25d0c` du lien "Effacer les filtres", et le vert `#25d366` (couleur de marque WhatsApp) sur la seule icone `.contact-simple-icon-whatsapp` -- les autres icones de contact restent rouge.
- **Alternance** : les sections se succedent sombre/claire pour rythmer la page (Hero sombre -> Pourquoi nous choisir clair -> Catalogue sombre -> A propos clair -> Contact sombre). Ne pas mettre deux sections claires ou deux sections sombres cote a cote sans raison.
- **Cards sur fond sombre** : jamais une couleur pleine differente -- une surface legerement plus claire que le fond, en overlay blanc transparent : `background: rgba(255, 255, 255, 0.045); border: 1px solid rgba(255, 255, 255, 0.1);` (ex. `.stock-catalog-proof-item`, `.contact-simple-card`).
- **Cards sur fond clair** : blanc pur `#ffffff` (ex. `.reasons-card`, `.about-bhj-feature`) plutot que `var(--paper)`/`#f7f6f3` -- trop proche du fond de section `#f4f3f4` pour rester lisible (piege deja rencontre sur `.about-bhj-feature`, corrige le 2026-08-24).

> Note : `--paper` (`#f7f6f3`) et le nouveau fond de section `#f4f3f4` sont
> deux valeurs tres proches mais pas identiques. A terme il faudrait n'en
> garder qu'une (voir section Ecarts).

## 2. Typographie

Deux polices, chargees via `next/font` dans `app/layout.js` :

- **`var(--font-display)`** = Outfit -- pour tous les titres (`h1`-`h4`), `.brand`, `.eyebrow`, `.button`, boutons/CTA. Regle globale deja posee (`globals.css` ligne ~217) : ne pas la redeclarer par composant, elle s'applique automatiquement a tout `h1`-`h4`.
- **`var(--font-template)`** = Plus Jakarta Sans -- texte courant (`body`), paragraphes, labels de formulaire.

Echelle observee sur la home (a garder comme reference, pas de nouvelle taille arbitraire) :
- Grand titre de section : `clamp(28px, 3.6vw, 46px)` a `clamp(38px, 5vw, 76px)` selon l'importance de la section, `font-weight: 850`.
- Eyebrow/kicker (petit mot au-dessus du titre) : 12-15px, `font-weight: 850-900`, `letter-spacing: 0.06em-0.14em`, `text-transform: uppercase`, couleur `var(--signal)`.
- Texte de lede/intro : `clamp(16px, 1.35vw, 21px)`, couleur attenuee (`rgba(242,240,236,0.72)` sur sombre / `var(--paper-muted)` sur clair).
- Texte de card (titre) : 15-17px, `font-weight: 800`. Texte de card (description) : 11-13px.

## 3. Icones

Deux familles d'icones coexistent, chacune a son usage -- ne pas les melanger :

**a) Icones PNG extraites** (`frontend/public/icons/*.png`)
Style trait rouge sur fond transparent, issues de la grille de reference
24 icones fournie par l'utilisateur. Utilisees pour : caracteristiques
voiture (carburant, kilometrage, annee, boite de vitesses), CTA "Voir
plus" des cards vehicule, contact (telephone, whatsapp, adresse...).
Normalisation : plus grande dimension de l'icone mise a 96px dans un
canvas uniforme de 140px (poids visuel identique quelle que soit l'icone
source). Si une icone doit apparaitre sur un fond rouge/fonce ou elle
deviendrait invisible, appliquer `filter: brightness(0) invert(1)` plutot
que de chercher/creer une variante blanche du fichier.

**b) Icones SVG inline** (`components/site/icons.js` + petites fonctions
locales dans certains composants comme `CarBrowser.js`)
`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
`stroke-width="1.8"` (parfois `1.9`), `stroke-linecap/linejoin="round"`.
Utilisees pour les icones de feature/card (Pourquoi nous choisir, A
propos, garanties catalogue, contact). Toujours **contour seul, pas de
fond/bulle derriere** -- la couleur vient du `color` du wrapper
(`color: var(--signal)`), jamais codee en dur dans le SVG. C'est la regle
globale deja posee ligne ~10472 de `globals.css` ("Global content icon
language"). Meme le logo WhatsApp suit cette regle -- pas le pictogramme
plein/fill officiel, mais une bulle de discussion en contour (voir
`WhatsAppIcon`), seule sa couleur devient verte (voir section 1).

**Animation** : au repos (page fixe, apres l'entree en scroll), les
icones de card ont un leger zoom en boucle -- `animation: aboutIconPulse
2.6s ease-in-out infinite;` (`scale(1)` <-> `scale(1.1)`), desactive sous
`prefers-reduced-motion`. Reutiliser cette meme keyframe plutot que
d'en creer une nouvelle a chaque section.

## 4. Boutons / CTA

**Le bouton de reference** (etabli explicitement par l'utilisateur apres
rejet du style precedent -- voir `.reasons-contact-button` /
`.stock-catalog-more-button`) :

```css
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 48px;
padding: 0 32px;
border: none; /* ou 1px solid rgba(255,255,255,0.16) sur fond sombre */
border-radius: 10px;
background: var(--signal);
color: #ffffff;
font-family: var(--font-display);
font-size: 15px;
font-weight: 700;
```
Hover : `background: var(--signal-dim)`. Pas de degrade, pas de glossy
sheen, pas d'ombre en couches -- **simple, rouge plein, texte blanc**.
C'est la regle a suivre pour tout nouveau bouton du site public.

**Effet zoom en boucle optionnel** sur les CTA importants (pas tous les
boutons) : `animation: ctaPulse 2.6s ease-in-out infinite;` (`scale(1)`
<-> `scale(1.045)`).

## 5. Structure de section / cards

- Padding lateral standard d'une section : 24px minimum, jusqu'a
  `max(24px, calc((100vw - 1180px) / 2))` sur tres grand ecran (variable
  selon largeur de contenu cible de la section).
- Rayon de coin card : `var(--radius-card)` (16px) -- standardise sur les
  4 familles de cards de la home (`.reasons-card`, `.about-bhj-feature`,
  `.stock-catalog-proof-item`, `.contact-simple-card`). Utiliser ce token
  pour toute nouvelle card plutot qu'une valeur en dur.
- Layout multi-elements (3 cards, proof items, contact...) : **toujours
  horizontal (une rangee), y compris sur mobile**, jamais empile en
  colonne. Regle explicite validee plusieurs fois cette session -- ne pas
  revenir a un `grid-template-columns: 1fr` sur mobile pour ce type de
  contenu sauf demande explicite.
- Animation d'entree de card : `whileInView` (Framer Motion) avec
  `viewport={{ once: false, amount: 0.2-0.3 }}` -- les cards rejouent leur
  apparition en cascade (`staggerChildren` ~0.12s) a chaque fois que la
  section revient a l'ecran, pas seulement au premier chargement.

## 6. Ecarts constates (a corriger un jour, pas urgent)

- **Deux familles de boutons non alignees restent** (la 3e, le CTA Hero,
  a ete corrigee le 2026-08-24 -- voir section 4, elle suit maintenant la
  regle du bouton simple) :
  1. `.button.navy` / `.button.neutral` / `.button.whatsapp-banner`
     (`components/VehicleActions.js`, page fiche vehicule) -- systeme de
     boutons totalement different, ne suit pas la regle rouge/blanc.
  2. Le style par defaut d'`.action-btn` (fond `var(--carbon)`, glossy
     sheen, ombres en couches) n'est plus utilise nulle part sur le site
     public depuis la correction du CTA Hero -- `ActionButton.js` pourrait
     etre simplifie ou retire si aucun autre usage n'apparait.
- **`--radius-card`** : desormais utilise par les 4 familles de cards de
  la home (voir section 5) mais toujours quasiment absent du reste du
  fichier -- a etendre aux autres cards du site (fiche vehicule, admin)
  au fur et a mesure.
- **`--space-*` (echelle d'espacement) sous-utilisee** : 19 usages sur un
  fichier de plus de 9 500 lignes -- la grande majorite du padding/gap est
  en valeurs `px`/`clamp()` ecrites a la main plutot que via les tokens.
- **Deux valeurs de fond clair tres proches** : `var(--paper)` (`#f7f6f3`)
  et `#f4f3f4` (utilise directement sur `.reasons-section` et
  `.about-bhj-section`) coexistent sans qu'un token commun les relie.
- **Couleur orange isolee** (`#f25d0c`, lien "Effacer les filtres" du
  panneau de filtres mobile) -- seule couleur du site hors palette
  rouge/carbon/paper.
- La fiche vehicule (`app/(site)/cars/[reference]/page.js`) et l'espace
  admin n'ont pas encore ete repasses sur ce systeme de design -- ils
  utilisent encore des classes/anciens styles (`detail-*`, `panel`,
  `admin-*`) non couverts par ce document.
