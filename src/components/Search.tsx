interface SearchProps {
  value: string
  onChange: (query: string) => void
}

const Search = ({ value, onChange }: SearchProps) => (
  <label>
    Search here:{" "}
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Repository name or description"
      className="search-input"
    />
  </label>
)

export default Search
