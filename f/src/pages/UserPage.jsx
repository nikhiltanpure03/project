import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { getAccount, getAccountBookings } from '../api/listingApi'
import { getCurrentAccount } from '../services/auth'

function UserPage() {
  const [account, setAccount] = useState(getCurrentAccount())
  const [bookingCount, setBookingCount] = useState(0)

  useEffect(() => {
    if (!account?.id) return
    getAccount(account.id).then((response) => setAccount(response.data)).catch(() => {})
    getAccountBookings(account.id).then((response) => setBookingCount(response.data.length)).catch(() => {})
  }, [account?.id])

  const details = account ? [['Full name', account.name], ['Email address', account.email], ['Account type', account.role], ['Member since', account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-GB') : 'Recently joined']] : []
  const displayName = account?.name || 'Guest account'

  return (
    <div className="page-shell">
      <Header />
      <main className="user-page">
        <section className="user-profile-heading"><div className="large-avatar">{displayName.charAt(0).toUpperCase()}</div><div><p className="eyebrow">Personal account</p><h1>{displayName}</h1><p>{account?.role === 'ADMIN' ? 'Administrator account' : 'Guest profile'} · {bookingCount} booking{bookingCount === 1 ? '' : 's'}</p></div></section>
        <section className="user-details-panel"><div className="panel-heading"><div><p className="eyebrow dark">Profile information</p><h2>Personal details</h2></div><span className="status-pill positive">Stored account</span></div><div className="user-details-grid">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="user-actions"><Link to="/admin/bookings" className="secondary-btn">Check my bookings ({bookingCount})</Link><Link to="/discover" className="text-btn">Back to stays <span aria-hidden="true">↗</span></Link></div></section>
      </main>
    </div>
  )
}

export default UserPage
