import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="airbnb home">
        <span className="brand-mark">air</span>bnb
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : undefined}>Stays</NavLink>
        <NavLink to="/experiences" className={({ isActive }) => isActive ? 'active' : undefined}>Experiences</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : undefined}>About</NavLink>
      </nav>

      <div className="header-actions">
        <Link to="/login" className="ghost-btn">Become a Host</Link>
        <Link to="/user" className="profile-btn" aria-label="Open user profile">
          <span className="menu-lines" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="avatar">A</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
