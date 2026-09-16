function EmailField({ value, onChange }) {
  return <label>Email address<input type="email" name="email" value={value} onChange={onChange} placeholder="you@example.com" required /></label>
}

export default EmailField
