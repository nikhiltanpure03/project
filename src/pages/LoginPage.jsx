import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmailField from '../components/fields/EmailField'
import PasswordField from '../components/fields/PasswordField'
import RememberField from '../components/fields/RememberField'
import RoleField from '../components/fields/RoleField'

function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('guest')
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submitLogin = (event) => {
    event.preventDefault()
    setSubmitted(true)
    navigate(role === 'host' ? '/about' : '/discover')
  }

  return (
    <div className="login-shell">
      <Link to="/" className="login-brand"><span>air</span>bnb</Link>
      <main className="login-card">
        <div className="login-intro"><p className="eyebrow">Welcome back</p><h1>Go somewhere good.</h1><p>Sign in to manage your trips, saved stays, and hosting plans.</p></div>
        <RoleField value={role} onChange={setRole} />
        <form className="login-form" onSubmit={submitLogin}><EmailField value={form.email} onChange={updateField} /><PasswordField value={form.password} onChange={updateField} /><div className="login-options"><RememberField /><button type="button" className="text-btn">Forgot password?</button></div><button type="submit" className="primary-btn">Continue as {role === 'guest' ? 'guest' : 'host'}</button>{submitted && <p className="login-note" role="status">Demo sign-in successful.</p>}</form>
        <p className="login-footer">New to airbnb? <button type="button" className="text-btn">Create an account</button></p>
      </main>
    </div>
  )
}

export default LoginPage
