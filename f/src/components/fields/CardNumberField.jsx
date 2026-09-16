function CardNumberField({ value, onChange }) {
  return (
    <label>Card number<input name="card" value={value} onChange={onChange} placeholder="4242 4242 4242 4242" inputMode="numeric" /></label>
  )
}

export default CardNumberField
