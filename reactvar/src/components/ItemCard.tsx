import React from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/item/${item.id}`} className="item-card">
      <div className="item-image-container">
        {item.images && item.images.length > 0 ? (
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="item-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        ) : (
          <div className="no-image">
            <span>No Image</span>
          </div>
        )}
        <div className="condition-badge">
          {item.condition}
        </div>
      </div>
      
      <div className="item-details">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-description">{item.description}</p>
        <div className="item-meta">
          <span className="item-price">{formatPrice(item.price)}</span>
          <span className="item-date">{formatDate(item.created_at)}</span>
        </div>
        <div className="item-footer">
          <span className="item-category">{item.category}</span>
          {item.location && (
            <span className="item-location">{item.location}</span>
          )}
        </div>
        {item.seller && (
          <div className="seller-info">
            <span>By: {item.seller.username || item.seller.email}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;