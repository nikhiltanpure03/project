function RoleField({ value, onChange }) {
  return (
    <div className="role-switch" aria-label="Account type">
      <button
        type="button"
        className={value === "guest" ? "selected" : ""}
        onClick={() => onChange("guest")}
      >
        User
      </button>
      <button
        type="button"
        className={value === "admin" ? "selected" : ""}
        onClick={() => onChange("admin")}
      >
        Admin
      </button>
    </div>
  );
}

export default RoleField;
