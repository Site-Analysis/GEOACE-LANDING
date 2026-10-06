export const metadata = {
  title: 'Who GeoAce is for',
  description: 'GeoAce brings scattered site data into focus for architects, designers, developers, land owners and technology collaborators.',
};

const audiences = [
  {
    label: 'ARCHITECTS & DESIGNERS',
    title: 'Start design from the full site.',
    text: 'Terrain, climate, regulations and surroundings are scattered across sources and arrive late. We want to hear where that slows your early design decisions.',
  },
  {
    label: 'DEVELOPERS & LAND OWNERS',
    title: 'Decide on a place with clearer facts.',
    text: 'Before buying, planning or building, you need to know what a site can really support. Tell us what you struggle to find out, and when.',
  },
  {
    label: 'TECHNOLOGY & DATA COLLABORATORS',
    title: 'Build the picture together.',
    text: 'Site data is fragmented and hard to connect. If you work with spatial data, tools or research, we would like to compare notes.',
  },
];

export default function Customers() {
  return (
    <div className="cust">
      <header className="cust-header">
        <a className="brand" href="/" aria-label="GeoAce Studio home"><span className="brand-mark" aria-hidden="true" /><span>GeoAce<small>STUDIO</small></span></a>
      </header>
      <main>
        <section className="cust-hero">
          <div className="eyebrow"><span aria-hidden="true">+</span> WHO IT’S FOR</div>
          <h1>Built for people<br />who shape <em>places.</em></h1>
          <p className="intro">GeoAce turns scattered land data, regulations, terrain, climate and wider site context into clear site intelligence. If your work depends on understanding a place, we should talk.</p>
        </section>
        <section className="cust-grid" aria-label="Who GeoAce is for">
          {audiences.map(a => (
            <article key={a.label}>
              <p className="cust-label">{a.label}</p>
              <h2>{a.title}</h2>
              <p>{a.text}</p>
            </article>
          ))}
        </section>
        <section className="cust-contact">
          <h2>Tell us the problem you run into.</h2>
          <p className="intro">We are building this with the industry. It all starts with a conversation.</p>
          <div className="contact-menu static">
            <a href="mailto:contact@geoacestudio.com"><small>MAIL</small><strong>contact@geoacestudio.com</strong></a>
            <a href="tel:+917676460252"><small>CALL</small><strong>+91 7676460252</strong></a>
            <a href="https://wa.me/917676460252" target="_blank" rel="noopener noreferrer"><small>WHATSAPP</small><strong>wa.me/917676460252</strong></a>
          </div>
        </section>
      </main>
      <footer className="cust-footer"><span>GeoAce Studio Pvt Ltd</span></footer>
    </div>
  );
}
