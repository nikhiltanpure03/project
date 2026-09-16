import Header from '../components/Header'

const principles = [
  ['01', 'Stay curious', 'We believe the best trips leave you with a new question, a new favorite dish, or a new way home.'],
  ['02', 'Choose thoughtful', 'Every space and host is selected for the details that make everyday travel feel considered.'],
  ['03', 'Leave it better', 'We are building a more generous way to travel, one local connection and lighter footprint at a time.'],
]

function AboutPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <div><p className="eyebrow">A different way to go</p><h1>Travel is better when it feels personal.</h1><p>airbnb is a collection of places, people, and possibilities for travelers who want to feel somewhere, not simply see it.</p></div>
          <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85" alt="Cabin beside a quiet mountain lake" />
        </section>
        <section className="about-story"><p className="eyebrow dark">The idea</p><h2>Make more room for the good stuff.</h2><p>We started with a simple belief: a home can be the beginning of a richer journey. Today, we help people find stays with character and hosts with stories, while keeping the experience warm, clear, and human.</p></section>
        <section className="principles"><div className="section-heading"><div><p className="eyebrow dark">What guides us</p><h2>Good travel has a point of view.</h2></div></div><div className="principle-grid">{principles.map(([number, title, detail]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>
        <section className="host-callout"><div><p className="eyebrow">Open your door</p><h2>Your place has a story, too.</h2><p>Share a space that matters to you with guests looking for something real.</p></div><button type="button" className="primary-btn">Become a host</button></section>
      </main>
    </div>
  )
}

export default AboutPage
