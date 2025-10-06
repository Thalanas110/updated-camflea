import React from 'react';
import type { ItemFilters } from '../types';

interface SearchFilterProps {
  filters: ItemFilters;
  onFilterChange: (filters: ItemFilters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filters, onFilterChange }) => {
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Vehicles',
    'Other'
  ];

  const conditions = [
    'new',
    'used', 
    'refurbished'
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? undefined : category
    });
  };

  const handleConditionChange = (condition: string) => {
    onFilterChange({
      ...filters,
      condition: filters.condition === condition ? undefined : condition
    });
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onFilterChange({
      ...filters,
      [field]: numValue
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="search-filter-sidebar">
      <div className="filter-header">
        <h3>Filter Items</h3>
        <button onClick={clearFilters} className="clear-filters">
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-options">
          {categories.map(category => (
            <label key={category} className="filter-option">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Condition</h4>
        <div className="filter-options">
          {conditions.map(condition => (
            <label key={condition} className="filter-option">
              <input
                type="checkbox"
                checked={filters.condition === condition}
                onChange={() => handleConditionChange(condition)}
              />
              <span className="capitalize">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) => handlePriceChange('priceMin', e.target.value)}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) => handlePriceChange('priceMax', e.target.value)}
            className="price-input"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;