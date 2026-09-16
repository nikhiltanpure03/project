function GuestTypeField({ value, onChange }) {
  return (
    <div className="guest-type-switch" aria-label="Booking guest type">
      <button type="button" className={value === 'indian' ? 'selected' : ''} onClick={() => onChange('indian')}>Indian guest · INR</button>
      <button type="button" className={value === 'international' ? 'selected' : ''} onClick={() => onChange('international')}>International guest · USD</button>
    </div>
  )
}

export default GuestTypeField
