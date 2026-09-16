function GuestCountField({ value, onChange }) {
  return (
    <label>Guests
      <select name="guests" value={value} onChange={onChange}>
        <option value="1">1 guest</option>
        <option value="2">2 guests</option>
        <option value="3">3 guests</option>
        <option value="4">4 guests</option>
      </select>
    </label>
  )
}

export default GuestCountField
