# Design system Auto BHJ

Regles de design/CSS extraites de la page d'accueil (etat au 2026-08-24),
qui fait reference. Avant de coder une nouvelle section ou un nouveau
composant : verifier ici d'abord plutot que d'inventer une nouvelle valeur
ou de redefinir un style deja existant sous un autre nom. Si une regle ici
ne convient plus, on la change ICI puis on repercute -- on ne cree pas une
variante de plus a cote.

Tous les tokens cites vivent dans `frontend/app/globals.css`, bloc `:root`.

## 1. Couleurs / fond d'ecran

Le site utilise maintenant une dominante claire selon la regle **60-30-10**,
suite au retour client du 2026-08-25 :

- **60% fond dominant** : blanc casse `#F8F9FA`, pour les grands espaces.
- **30% surfaces secondaires** : gris clair `#E9ECEF`, pour cartes, filtres
  et blocs qui doivent detourer les photos.
- **10% accent** : bleu intense `#0056B3`, pour CTA, prix, liens actifs et
  icones importantes. Le bleu marine `#0A2540` sert au texte fort et aux
  hovers.

| Systeme | Fond section | Texte principal | Texte attenue | Bordure/ligne |
| --- | --- | --- | --- | --- |
| **60 Fond** | `var(--carbon)` `#F8F9FA` | `var(--carbon-text)` `#0A2540` | `var(--carbon-text-dim)` `#516170` | `var(--carbon-line)` |
| **30 Surfaces** | `var(--carbon-raised)` `#E9ECEF` | `var(--carbon-text)` `#0A2540` | `var(--carbon-text-dim)` `#516170` | `var(--carbon-line)` |
| **10 Accent** | `var(--signal)` `#0056B3` | `#ffffff` | hover `var(--signal-dim)` `#0A2540` | accents/focus |

- **Bleu d'accent** : `var(--signal)` `#0056B3`, hover/actif `var(--signal-dim)` `#0A2540`. C'est la couleur reservee aux boutons, prix, liens actifs, focus et icones importantes.
- **Boutons d'action** (2026-08-28) : teal `var(--color-cta)` `#2d6b76`, hover `var(--color-cta-dark)` `#245861` -- meme couleur que le header (`bg-[#2d6b76]`). C'est la couleur des CTA pleins (`bg-cta`) : header, sections home, formulaire fiche, barre mobile, pagination stock. Les icones trait, liens et accents restent en vert `var(--color-brand)` `#1a4d3e` (`text-brand`) -- ne pas confondre bouton (teal) et accent (vert).
- **Exceptions** : le vert `#25d366` reste uniquement pour WhatsApp. Le back-office admin garde son theme operationnel separe.
- **Cards et filtres** : utiliser `var(--carbon-raised)` `#E9ECEF` avec `border: 1px solid var(--carbon-line)`. Eviter les anciens overlays sombres ou les cards blanches dominantes.
- **Rouge** : ne plus l'utiliser sur le site public comme accent d'action.

> Note : `--paper` (`#f7f6f3`) et le nouveau fond de section `#f4f3f4` sont
> deux valeurs tres proches mais pas identiques. A terme il faudrait n'en
> garder qu'une (voir section Ecarts).

## 2. Typographie

Deux polices, chargees via `next/font` dans `app/layout.js` :

- **`var(--font-display)`** = Montserrat -- pour tous les titres (`h1`-`h4`), `.brand`, `.eyebrow`, `.button`, boutons/CTA. Regle globale deja posee (`globals.css` ligne ~217) : ne pas la redeclarer par composant, elle s'applique automatiquement a tout `h1`-`h4`.
- **`var(--font-template)`** = Plus Jakarta Sans -- texte courant (`body`), paragraphes, labels de formulaire. Applique via `globals.css` `body { font-family: var(--font-template) }`. (2026-08-28 : l'override `Inter` qui trainait sur le wrapper du layout `(home)` a ete retire -- tout le site public utilise maintenant vraiment ce couple Montserrat / Plus Jakarta Sans, comme l'admin utilise Poppins de son cote.)

Echelle observee sur la home (a garder comme reference, pas de nouvelle taille arbitraire) :
- Regle globale `h1` / `h2` (`globals.css` ~1305) : `h1` = `clamp(22px, 7vw, 70px)`, `h2` = `clamp(22px, 4vw, 42px)`. Le plancher a ete abaisse a 22px le 2026-08-28 : avant, `h1` a 38px minimum faisait deborder le titre du Hero hors de l'ecran sur mobile (scroll horizontal / dezoom). `overflow-wrap: break-word` ajoute sur `h1`-`h3` en filet de securite, et `overflow-x-clip` sur le wrapper du layout `(home)`.
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

**Bouton de reference (2026-08-28)** -- style "pilule majuscules", applique a
tous les CTA pleins du site public :

```
inline-flex items-center justify-center rounded-full
bg-cta hover:bg-cta-dark        /* #2d6b76 -> #245861 (le teal du header) */
px-10 py-4                       /* CTA de section ; header + barre mobile gardent px-5 / px-3 + min-h-[46px] */
text-[13-15px] font-semibold uppercase tracking-wider   /* letter-spacing 0.05em */
text-white transition-colors
```

Pas de degrade, pas d'ombre en couches. La couleur (`bg-cta`) est la seule
chose reprise du site -- le reste (pilule, majuscules, letter-spacing) vient
du composant scroll-story du registre que l'utilisateur a valide.
Exceptions : pagination du stock (petits carres numerotes) et le selecteur
segmente de `QrLanding` gardent leur style propre. WhatsApp reste `#25d366`.

<details><summary>Ancien bouton de reference (avant 2026-08-28)</summary>

Etabli apres rejet du style precedent -- voir `.reasons-contact-button` /
`.stock-catalog-more-button` :

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
sheen, pas d'ombre en couches.

</details>

**Effet zoom en boucle optionnel** sur les CTA importants (pas tous les
boutons) : `animation: ctaPulse 2.6s ease-in-out infinite;` (`scale(1)`
<-> `scale(1.045)`).

## 5. Structure de section / cards

- **Espacement des sections de la home (Tailwind, 2026-08-28)** : echelle
  unique appliquee a toutes les sections + header + footer pour eviter les
  sauts brutaux entre petit et grand ecran.
  - Gouttiere laterale (sur le conteneur interne `mx-auto max-w-6xl/7xl`) :
    `px-6 md:px-10 xl:px-16` (24 -> 40 -> 64px). Le `max-w-*` reste le
    plafond du contenu ; `xl:px-16` sert surtout de plancher sur ecran
    moyen/carre ou les sections touchaient les bords.
  - Rythme vertical (sur la balise `<section>`) : `py-14 sm:py-16 lg:py-20`
    (56 -> 64 -> 80px). Exceptions : Hero garde `py-20` constant ;
    `JourneyScrollStory` a son rythme propre (panneau sticky `100svh`) et
    ne suit pas cette regle.
- Ancien systeme CSS (legacy `globals.css`, non-Tailwind) : padding lateral
  `max(24px, calc((100vw - 1180px) / 2))` -- conserve pour les vieilles
  classes `.section` / `.stock-catalog-hero` etc., a ne pas melanger avec
  l'echelle Tailwind ci-dessus.
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
