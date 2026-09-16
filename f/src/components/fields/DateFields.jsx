function DateFields({ checkIn, checkOut, onChange }) {
  return (
    <div className="booking-fields">
      <label>Check-in<input name="checkIn" type="date" value={checkIn} onChange={onChange} /></label>
      <label>Check-out<input name="checkOut" type="date" value={checkOut} onChange={onChange} /></label>
    </div>
  )
}

export default DateFields
