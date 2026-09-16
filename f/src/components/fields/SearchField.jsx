function SearchField({ value, onChange }) {
  return <label className="search-field"><span>Search destinations</span><input value={value} onChange={onChange} placeholder="Try Paris or Big Sur" /></label>
}

export default SearchField
