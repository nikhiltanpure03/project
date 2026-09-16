function RoleField({ value, onChange }) {
  return <div className="role-switch" aria-label="Account type"><button type="button" className={value === 'guest' ? 'selected' : ''} onClick={() => onChange('guest')}>Guest</button><button type="button" className={value === 'host' ? 'selected' : ''} onClick={() => onChange('host')}>Host</button></div>
}

export default RoleField
