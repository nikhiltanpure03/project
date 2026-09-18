import { Link } from "react-router-dom";

function ExperienceSection({ experiences }) {
  return (
    <section className="experience-section" id="experiences">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Experiences</p>
          <h2>Local moments worth booking</h2>
        </div>
        <Link to="/experiences">Explore more</Link>
      </div>

      <div className="experience-grid">
        {experiences.map((item) => (
          <article key={item.title} className="experience-card">
            <img src={item.image} alt={item.title} />
            <div className="experience-copy">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ExperienceSection;
