import Footer from "../../components/site/Footer";
import ScrollReveal from "../../components/site/ScrollReveal";

export default function SiteLayout({ children }) {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">AB</span>
          <span>Auto BHJ</span>
        </a>
        <nav>
          <a href="/#stock">Stock</a>
          <a href="/#a-propos">A propos</a>
          <a href="/#services">Services</a>
          <a href="/#faq">FAQ</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
