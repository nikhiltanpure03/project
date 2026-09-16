import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { deleteBooking, getBookings } from '../api/listingApi'

function formatDate(value) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not selected'
}

function formatMoney(payment) {
  return `${payment?.currency || ''}${Number(payment?.totalPaid || 0).toLocaleString()}`
}

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const loadBookings = () => {
    setLoading(true)
    setError('')
    getBookings()
      .then((response) => {
        setBookings(response.data)
        setSelectedBooking(null)
      })
      .catch(() => setError('Bookings could not be loaded. Check that the backend is running.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const removeBooking = (id) => {
    if (!window.confirm('Remove this booking?')) return
    deleteBooking(id).then(loadBookings).catch(() => setError('Booking could not be removed.'))
  }

  const printBill = (booking) => {
    setSelectedBooking(booking)
    window.setTimeout(() => window.print(), 0)
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="admin-page">
        <div className="admin-heading">
          <div>
            <p className="eyebrow dark">Operations</p>
            <h1>All bookings</h1>
            <p>Review confirmed stays, guest dates, and payment totals. Total bookings: {bookings.length}.</p>
          </div>
          <div className="admin-actions"><button type="button" className="secondary-btn" onClick={loadBookings}>Refresh</button></div>
        </div>

        {loading && <div className="detail-empty"><h2>Loading bookings...</h2></div>}
        {error && <div className="detail-empty"><h2>Could not load bookings</h2><p>{error}</p></div>}
        {!loading && !error && bookings.length === 0 && <div className="detail-empty"><h2>No bookings yet</h2><p>Confirmed bookings will appear here.</p></div>}
        {!loading && !error && bookings.length > 0 && (
          <div className="booking-table-wrap">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Stay</th>
                  <th>Booked by</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Guest type</th>
                  <th>Status</th>
                  <th>Total paid</th>
                  <th>Card</th>
                  <th>Booked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.listingTitle}</strong><span>Booking #{booking.id}</span></td>
                    <td>{booking.billing?.guestName || 'Not provided'}</td>
                    <td>{formatDate(booking.checkIn)}<span>to {formatDate(booking.checkOut)}</span></td>
                    <td>{booking.billing?.guests}</td>
                    <td>{booking.billing?.guestType === 'indian' ? 'Indian' : 'International'}</td>
                    <td>{booking.status || 'CONFIRMED'} / {booking.payment?.status || 'PAID'}</td>
                    <td>{booking.payment?.currency}{Number(booking.payment?.totalPaid || 0).toLocaleString()}</td>
                    <td>•••• {booking.payment?.cardLastFour}</td>
                    <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                    <td><div className="booking-actions"><button type="button" className="secondary-btn" onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}>{selectedBooking?.id === booking.id ? 'Hide' : 'View'}</button><button type="button" className="secondary-btn" onClick={() => printBill(booking)}>Print bill</button><button type="button" className="remove-booking-btn" onClick={() => removeBooking(booking.id)}>Remove</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedBooking && <section className="booking-detail-panel" aria-label="Booking details">
          <div className="booking-detail-heading"><div><p className="eyebrow dark">Complete record</p><h2>Booking #{selectedBooking.id}</h2></div><button type="button" className="secondary-btn" onClick={() => printBill(selectedBooking)}>Print bill</button></div>
          <div className="booking-detail-columns">
            <div><h3>Booking</h3><p><strong>Stay</strong>{selectedBooking.listingTitle}</p><p><strong>Listing ID</strong>{selectedBooking.listingId}</p><p><strong>Check-in</strong>{formatDate(selectedBooking.checkIn)}</p><p><strong>Check-out</strong>{formatDate(selectedBooking.checkOut)}</p><p><strong>Booking status</strong>{selectedBooking.status || 'CONFIRMED'}</p><p><strong>Created</strong>{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('en-GB') : '—'}</p></div>
            <div><h3>Billing</h3><p><strong>Name</strong>{selectedBooking.billing?.guestName || 'Not provided'}</p><p><strong>Guest type</strong>{selectedBooking.billing?.guestType || '—'}</p><p><strong>Guests</strong>{selectedBooking.billing?.guests || '—'}</p></div>
            <div><h3>Payment</h3><p><strong>Payment status</strong>{selectedBooking.payment?.status || 'PAID'}</p><p><strong>Nightly price</strong>{selectedBooking.payment?.currency}{Number(selectedBooking.payment?.nightlyPrice || 0).toLocaleString()}</p><p><strong>Subtotal</strong>{selectedBooking.payment?.currency}{Number(selectedBooking.payment?.subtotal || 0).toLocaleString()}</p><p><strong>Service fee</strong>{selectedBooking.payment?.currency}{Number(selectedBooking.payment?.serviceFee || 0).toLocaleString()}</p><p><strong>Taxes</strong>{selectedBooking.payment?.currency}{Number(selectedBooking.payment?.taxes || 0).toLocaleString()}</p><p><strong>Total paid</strong>{formatMoney(selectedBooking.payment)}</p><p><strong>Card</strong>•••• {selectedBooking.payment?.cardLastFour || '—'}</p></div>
          </div>
        </section>}
        {selectedBooking && <section className="print-bill" aria-hidden="true"><p className="eyebrow">airbnb</p><h1>Booking bill</h1><p>Booking #{selectedBooking.id}</p><hr /><h2>{selectedBooking.listingTitle}</h2><p>{selectedBooking.billing?.guestName || 'Guest'} · {selectedBooking.billing?.guestType || 'Guest'}</p><p>{formatDate(selectedBooking.checkIn)} to {formatDate(selectedBooking.checkOut)}</p><hr /><p>Nightly price: {selectedBooking.payment?.currency}{Number(selectedBooking.payment?.nightlyPrice || 0).toLocaleString()}</p><p>Subtotal: {selectedBooking.payment?.currency}{Number(selectedBooking.payment?.subtotal || 0).toLocaleString()}</p><p>Service fee: {selectedBooking.payment?.currency}{Number(selectedBooking.payment?.serviceFee || 0).toLocaleString()}</p><p>Taxes: {selectedBooking.payment?.currency}{Number(selectedBooking.payment?.taxes || 0).toLocaleString()}</p><h2>Total paid: {formatMoney(selectedBooking.payment)}</h2><p>Payment card: •••• {selectedBooking.payment?.cardLastFour || '—'}</p></section>}
      </main>
    </div>
  )
}

export default AdminBookingsPage
