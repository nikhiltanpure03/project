function PasswordField({ value, onChange }) {
  return <label>Password<input type="password" name="password" value={value} onChange={onChange} placeholder="Enter your password" required /></label>
}

export default PasswordField
