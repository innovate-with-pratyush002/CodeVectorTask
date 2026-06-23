import { categories } from "../services/productsApi.js";

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-group">
      <label htmlFor="category" className="filter-label">
        Category
      </label>

      <select
        id="category"
        className="filter-select"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
