import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { itemsService } from '../services/supabase';
import Navbar from '../components/Navbar';
import SearchFilter from '../components/SearchFilter';
import ItemCard from '../components/ItemCard';
import LoadingScreen from '../components/LoadingScreen';
import type { Item, ItemFilters } from '../types';

const HomePage: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, [filters, searchTerm]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = { ...filters, search: searchTerm };
      const data = await itemsService.getItems(searchFilters);
      
      setItems(data || []);
    } catch (err: any) {
      console.error('Error loading items:', err);
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: ItemFilters) => {
    setFilters(newFilters);
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="homepage">
      <Navbar onSearch={handleSearch} />
      
      <div className="main-container">
        <SearchFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <div className="content-area">
          <div className="items-header">
            <h2>Available Items</h2>
            <span className="items-count">{items.length} items found</span>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading items...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={loadItems} className="retry-button">
                Retry
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {items.length > 0 ? (
                items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))
              ) : (
                <div className="no-items">
                  <p>No items found matching your criteria</p>
                  <button onClick={() => {setFilters({}); setSearchTerm('');}}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;