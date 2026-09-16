import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmailField from '../components/fields/EmailField'
import PasswordField from '../components/fields/PasswordField'
import RememberField from '../components/fields/RememberField'
import RoleField from '../components/fields/RoleField'
import { createAccount } from '../api/listingApi'

function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('guest')
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [account, setAccount] = useState({ name: '', email: '', password: '' })
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountError, setAccountError] = useState('')

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const updateAccount = (event) => setAccount((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submitLogin = (event) => {
    event.preventDefault()
    setSubmitted(true)
    navigate(role === 'host' ? '/about' : '/discover')
  }

  const submitAccount = async (event) => {
    event.preventDefault()
    setAccountError('')
    try {
      await createAccount(account)
      setAccountCreated(true)
    } catch {
      setAccountError('Account could not be created. Please try again.')
    }
  }

  return (
    <div className="login-shell">
      <Link to="/" className="login-brand"><span>air</span>bnb</Link>
      <main className="login-card">
        <div className="login-intro"><p className="eyebrow">Welcome back</p><h1>Go somewhere good.</h1><p>Sign in to manage your trips, saved stays, and hosting plans.</p></div>
        {!creatingAccount && <><RoleField value={role} onChange={setRole} /><form className="login-form" onSubmit={submitLogin}><EmailField value={form.email} onChange={updateField} /><PasswordField value={form.password} onChange={updateField} /><div className="login-options"><RememberField /><button type="button" className="text-btn">Forgot password?</button></div><button type="submit" className="primary-btn">Continue as {role}</button>{submitted && <p className="login-note" role="status">Demo sign-in successful.</p>}</form><p className="login-footer">New to airbnb? <button type="button" className="text-btn" onClick={() => setCreatingAccount(true)}>Create an account</button></p></>}
        {creatingAccount && <><div className="login-intro"><p className="eyebrow">New here?</p><h1>Create your account.</h1><p>Save stays and keep every trip in one place.</p></div><form className="login-form" onSubmit={submitAccount}><label>Full name<input name="name" value={account.name} onChange={updateAccount} placeholder="Your full name" autoComplete="name" required /></label><EmailField value={account.email} onChange={updateAccount} /><PasswordField value={account.password} onChange={updateAccount} /><button type="submit" className="primary-btn">Create account</button>{accountCreated && <p className="login-note" role="status">Account created successfully.</p>}{accountError && <p className="booking-error" role="alert">{accountError}</p>}</form><p className="login-footer"><button type="button" className="text-btn" onClick={() => setCreatingAccount(false)}>Back to sign in</button></p></>}
      </main>
    </div>
  )
}

export default LoginPage
