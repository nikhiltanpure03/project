import { Link } from 'react-router-dom'

const stats = [
  { value: '2.4k+', label: 'guest homes' },
  { value: '4.9/5', label: 'average rating' },
  { value: '120+', label: 'global cities' },
]

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Plan a different kind of getaway</p>
        <h1>Find the perfect stay for your next adventure.</h1>
        <p className="hero-text">
          Explore handpicked homes, scenic cabins, and design-forward escapes with
          thoughtful comforts and welcoming hosts.
        </p>

        <div className="hero-actions">
          <Link to="/discover" className="primary-btn">
            Explore stays
          </Link>
          <Link to="/experiences" className="secondary-btn">
            View experiences
          </Link>
        </div>

        <div className="stats-row" aria-label="Airbnb statistics">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual" aria-label="Featured property image">
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury home with a pool and scenic views"
        />
        <div className="floating-card">
          <span className="float-label">Top rated</span>
          <strong>Emerald Ridge House</strong>
          <span>4.9 · 268 reviews</span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
