import { Link } from 'react-router-dom'

function StaySection({ stays }) {
  return (
    <section className="stay-section" id="stays">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Popular stays</p>
          <h2>Places guests love</h2>
        </div>
        <Link to="/discover">Show all</Link>
      </div>

      <div className="stay-grid">
        {stays.map((stay) => (
          <Link to={`/listing/${stay.id}`} key={stay.id} className="stay-card-link">
            <article className="stay-card">
              <div className="card-image-wrap">
                <img src={stay.image} alt={stay.title} />
                <button
                  type="button"
                  className="favorite-btn"
                  aria-label={`Save ${stay.title}`}
                  onClick={(event) => event.preventDefault()}
                >
                  ♥
                </button>
              </div>

              <div className="card-body">
                <div className="card-topline">
                  <span className="tag">{stay.tag}</span>
                  <span className="rating">★ {stay.rating}</span>
                </div>

                <h3>{stay.title}</h3>
                <p>{stay.location}</p>

                <div className="card-bottom">
                  <strong>From ${stay.price}</strong>
                  <span>/ night</span>
                  <em>{stay.reviews} reviews</em>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default StaySection
