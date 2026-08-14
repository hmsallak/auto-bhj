import { StarIcon, ShieldIcon, TagIcon } from "./icons";

export default function TrustBadge({ carsCount }) {
  return (
    <section className="section reveal trust-section">
      <div className="trust-grid">
        <div className="trust-rating">
          <div className="trust-stars" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <StarIcon key={`full-${i}`} className="star-filled" />
            ))}
            {[1, 2].map((i) => (
              <StarIcon key={`empty-${i}`} className="star-empty" />
            ))}
          </div>
          <p className="trust-score">3 / 5</p>
          <p className="trust-caption">
            Note vendeur professionnel sur AutoScout24 - 100% de recommandations
          </p>
        </div>

        <div className="trust-stats">
          <div>
            <ShieldIcon />
            <div>
              <strong>{carsCount}</strong>
              <span>vehicules actuellement en stock</span>
            </div>
          </div>
          <div>
            <TagIcon />
            <div>
              <strong>100%</strong>
              <span>des annonces avec prix affiche, sans frais caches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
