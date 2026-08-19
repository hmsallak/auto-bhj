import SiteHeader from "../../components/site/SiteHeader";
import Footer from "../../components/site/Footer";
import ScrollReveal from "../../components/site/ScrollReveal";

export default function SiteLayout({ children }) {
  return (
    <>
      <div className="auto-motion-bg" aria-hidden="true" />
      <SiteHeader />
      <main>{children}</main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
