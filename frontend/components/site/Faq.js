const QUESTIONS = [
  {
    q: "Puis-je faire un essai avant d'acheter ?",
    a: "Oui. Contactez-nous en mentionnant la reference de la voiture pour convenir d'un rendez-vous d'essai.",
  },
  {
    q: "Les vehicules sont-ils garantis ?",
    a: "Une garantie peut etre proposee selon le vehicule. Demandez les details lors de votre prise de contact.",
  },
  {
    q: "Reprenez-vous mon ancien vehicule ?",
    a: "Oui, la reprise est etudiee au cas par cas et peut etre deduite du prix d'achat de la nouvelle voiture.",
  },
  {
    q: "Les voitures sont-elles pretes pour le controle technique ?",
    a: "Les vehicules sont dedouanes et preparees en vue du passage au controle technique. Voir la fiche de chaque voiture pour le detail.",
  },
  {
    q: "Comment reconnaitre une voiture sur le site ?",
    a: "Chaque voiture a une reference unique (ex. AB-000123), visible sur sa fiche et utilisable pour la recherche sur la page d'accueil.",
  },
  {
    q: "Quels sont les moyens de paiement acceptes ?",
    a: "Virement bancaire et especes selon la reglementation en vigueur. Les details sont convenus directement avec vous avant la vente.",
  },
  {
    q: "Faut-il prendre rendez-vous pour visiter le garage ?",
    a: "Un rendez-vous n'est pas obligatoire mais fortement recommande afin qu'un vehicule et un interlocuteur soient disponibles a votre arrivee.",
  },
];

export default function Faq() {
  return (
    <section className="section reveal" id="faq">
      <div className="section-head">
        <div>
          <p className="eyebrow">Questions frequentes</p>
          <h2>Tout savoir avant de nous contacter</h2>
        </div>
      </div>

      <div className="faq-list">
        {QUESTIONS.map(({ q, a }) => (
          <details className="faq-item" key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
