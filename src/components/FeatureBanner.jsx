function FeatureBanner({ perks }) {
  return (
    <section className="feature-banner" id="about">
      <div className="feature-copy">
        <p className="eyebrow dark">Why guests choose airbnb</p>
        <h2>Thoughtful stays that feel like home.</h2>
      </div>

      <ul className="feature-list">
        {perks.map((perk) => (
          <li key={perk}>{perk}</li>
        ))}
      </ul>
    </section>
  )
}

export default FeatureBanner
