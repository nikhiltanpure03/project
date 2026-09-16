import { Link } from 'react-router-dom'
import Header from '../components/Header'

const details = [
  ['Full name', 'Aanya Shah'],
  ['Email address', 'aanya.shah@example.com'],
  ['Phone number', '+91 98765 43210'],
  ['Home location', 'Mumbai, Maharashtra'],
  ['Date of birth', '12 March 1995'],
  ['Preferred language', 'English'],
]

function UserPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="user-page">
        <section className="user-profile-heading"><div className="large-avatar">A</div><div><p className="eyebrow">Personal account</p><h1>Aanya Shah</h1><p>Guest profile · Member since 2024</p></div></section>
        <section className="user-details-panel"><div className="panel-heading"><div><p className="eyebrow dark">Profile information</p><h2>Personal details</h2></div><span className="status-pill positive">Verified</span></div><div className="user-details-grid">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="user-actions"><button type="button" className="secondary-btn">Edit details</button><Link to="/discover" className="text-btn">Back to stays <span aria-hidden="true">↗</span></Link></div></section>
      </main>
    </div>
  )
}

export default UserPage
