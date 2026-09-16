import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { stays } from '../data/listings'
import DateFields from '../components/fields/DateFields'
import GuestCountField from '../components/fields/GuestCountField'
import GuestTypeField from '../components/fields/GuestTypeField'
import CardNumberField from '../components/fields/CardNumberField'
import BillSummary from '../components/fields/BillSummary'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

function ListingDetailPage() {
  const { id } = useParams()
  const [stay, setStay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 2, card: '', guestType: 'indian' })
  const [paid, setPaid] = useState(false)

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0
    return Math.max(0, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000))
  }, [booking.checkIn, booking.checkOut])

  const updateBooking = (event) => setBooking((current) => ({ ...current, [event.target.name]: event.target.value }))

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((response) => setStay(response.data))
      .catch(() => setStay(stays.find((item) => String(item.id) === id) || null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-shell detail-shell">
        <Link to="/" className="back-link">← Back to homes</Link>
        <div className="detail-empty">
          <h2>Loading listing...</h2>
        </div>
      </div>
    )
  }

  if (!stay) {
    return (
      <div className="page-shell detail-shell">
        <Link to="/" className="back-link">← Back to homes</Link>
        <div className="detail-empty">
          <h2>Listing not found</h2>
          <p>The place you are looking for no longer exists or was removed.</p>
        </div>
      </div>
    )
  }

  const isIndianGuest = booking.guestType === 'indian'
  const currency = isIndianGuest ? '₹' : '$'
  const nightlyPrice = isIndianGuest ? stay.price * 83 : stay.price
  const subtotal = nights * nightlyPrice
  const serviceFee = Math.round(subtotal * 0.12)
  const taxes = Math.round(subtotal * 0.08)
  const advance = subtotal + serviceFee + taxes

  if (paid) {
    return <div className="page-shell detail-shell"><Link to="/discover" className="back-link">Back to stays</Link><div className="booking-success"><span className="success-mark">✓</span><p className="eyebrow">Payment accepted</p><h1>Your booking is confirmed.</h1><p>Your {isIndianGuest ? 'Indian guest' : 'international guest'} advance payment of {currency}{advance.toLocaleString()} was accepted for {stay.title}.</p><Link to="/discover" className="primary-btn">Explore more stays</Link></div></div>
  }

  return (
    <div className="page-shell detail-shell">
      <Link to="/" className="back-link">← Back to homes</Link>

      <div className="detail-hero">
        <img src={stay.image} alt={stay.title} />
      </div>

      <div className="detail-content">
        <div>
          <p className="eyebrow dark">{stay.tag}</p>
          <h1>{stay.title}</h1>
          <p className="detail-location">{stay.location}</p>
        </div>

        <div className="detail-meta">
          <span>★ {stay.rating}</span>
          <span>{stay.reviews} reviews</span>
          <span>Entire home</span>
        </div>

        <div className="detail-card">
          <div className="detail-price-row">
            <strong>{currency}{nightlyPrice.toLocaleString()}</strong>
            <span>/ night</span>
          </div>
          <ul>
            <li>2 guests</li>
            <li>1 bedroom</li>
            <li>2 bathrooms</li>
            <li>Sea-view terrace</li>
          </ul>
          <div className="advance-booking">
            <DateFields checkIn={booking.checkIn} checkOut={booking.checkOut} onChange={updateBooking} />
            <GuestCountField value={booking.guests} onChange={updateBooking} />
            <GuestTypeField value={booking.guestType} onChange={(guestType) => setBooking((current) => ({ ...current, guestType }))} />
            <BillSummary currency={currency} nightlyPrice={nightlyPrice} nights={nights} advance={advance} />
            <CardNumberField value={booking.card} onChange={updateBooking} />
            <button type="button" className="primary-btn" disabled={!nights || !booking.card} onClick={() => setPaid(true)}>Pay advance {currency}{(advance || nightlyPrice).toLocaleString()}</button>
            <small className="payment-note">Demo payment only. No real card is charged.</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailPage
