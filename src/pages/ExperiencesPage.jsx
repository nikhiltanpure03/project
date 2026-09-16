import Header from '../components/Header'
import { experiences } from '../data/listings'

const extraExperiences = [
  { title: 'A table in the garden', detail: 'An unhurried farm lunch prepared around what is ripe today.', image: 'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=1000&q=85', category: 'Taste' },
  { title: 'The art of the aperitivo', detail: 'Golden-hour drinks, small plates, and a local host who knows everyone.', image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85', category: 'Gather' },
  { title: 'Forest bathing', detail: 'A quiet, sensory walk through ancient trees with a naturalist guide.', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85', category: 'Wander' },
]

function ExperiencesPage() {
  const allExperiences = [...experiences.map((item) => ({ ...item, category: 'Signature' })), ...extraExperiences]

  return (
    <div className="page-shell">
      <Header />
      <main className="experiences-page">
        <section className="experience-intro">
          <p className="eyebrow">Go beyond the address</p>
          <h1>Small moments. Lasting memories.</h1>
          <p>Meet the people, flavors, and landscapes that make a place feel truly alive.</p>
        </section>
        <section className="experience-feature">
          <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=85" alt="Friends sharing a meal outdoors" />
          <div>
            <p className="eyebrow">The slow travel edit</p>
            <h2>Leave room for the unexpected.</h2>
            <p>Our hosts open the door to rituals you cannot find in a guidebook, from market mornings to trails that end at the perfect view.</p>
          </div>
        </section>
        <section className="experience-library">
          <div className="section-heading"><div><p className="eyebrow dark">Curated for curious travelers</p><h2>Make the day part of the trip</h2></div></div>
          <div className="experience-grid expanded-experience-grid">
            {allExperiences.map((item) => <article key={item.title} className="experience-card"><img src={item.image} alt={item.title} /><div className="experience-copy"><span className="tag">{item.category}</span><h3>{item.title}</h3><p>{item.detail}</p><button type="button" className="text-btn">Explore experience <span aria-hidden="true">↗</span></button></div></article>)}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ExperiencesPage
