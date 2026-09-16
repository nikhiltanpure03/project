import GuestTypeField from '../fields/GuestTypeField'

function BillingFields({ guestName, guestType, onChange, onGuestTypeChange }) {
  return (
    <section className="billing-form-section" aria-label="Billing details">
      <label>Guest name<input name="guestName" value={guestName} onChange={onChange} placeholder="Your full name" autoComplete="name" required /></label>
      <GuestTypeField value={guestType} onChange={onGuestTypeChange} />
    </section>
  )
}

export default BillingFields
