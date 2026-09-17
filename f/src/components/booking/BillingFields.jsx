import GuestTypeField from '../fields/GuestTypeField'

function BillingFields({ guestName, guestType, mobileNumber, idProofType, idProofNumber, onChange, onGuestTypeChange }) {
  return (
    <section className="billing-form-section" aria-label="Billing details">
      <label>Guest name<input name="guestName" value={guestName} onChange={onChange} placeholder="Your full name" autoComplete="name" required /></label>
      <label>Mobile number<input name="mobileNumber" value={mobileNumber} onChange={onChange} placeholder="10-digit mobile number" inputMode="tel" autoComplete="tel" required /></label>
      <label>ID proof type<select name="idProofType" value={idProofType} onChange={onChange} required><option value="">Select proof</option><option value="Aadhaar">Aadhaar</option><option value="Passport">Passport</option><option value="Driving licence">Driving licence</option><option value="Voter ID">Voter ID</option></select></label>
      <label>ID proof number<input name="idProofNumber" value={idProofNumber} onChange={onChange} placeholder="Enter ID proof number" required /></label>
      <GuestTypeField value={guestType} onChange={onGuestTypeChange} />
    </section>
  )
}

export default BillingFields
