import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeatureBanner from '../components/FeatureBanner'
import ExperienceSection from '../components/ExperienceSection'
import { experiences, perks } from '../data/listings'

function HomePage() {
  return (
    <div className="page-shell">
      <Header />

      <main>
        <HeroSection />
        <FeatureBanner perks={perks} />
        <ExperienceSection experiences={experiences} />
      </main>
    </div>
  )
}

export default HomePage
