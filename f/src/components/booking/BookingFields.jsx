import DateFields from '../fields/DateFields'
import GuestCountField from '../fields/GuestCountField'

function BookingFields({ checkIn, checkOut, guests, onChange }) {
  return (
    <section className="booking-form-section" aria-label="Booking details">
      <DateFields checkIn={checkIn} checkOut={checkOut} onChange={onChange} />
      <GuestCountField value={guests} onChange={onChange} />
    </section>
  )
}

export default BookingFields
