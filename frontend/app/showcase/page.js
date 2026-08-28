import JourneyScrollStory from "../../components/site/JourneyScrollStory";

// Page de test isolee (hors layout (home) : pas de header/footer du site).
export const metadata = {
  title: "Parcours - demo scroll story",
};

export default function ShowcasePage() {
  return <JourneyScrollStory />;
}
