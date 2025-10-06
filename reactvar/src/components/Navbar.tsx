import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="profile-section">
        <img src="/Homepage_images/circle-user.png" alt="Profile" className="profile-icon" />
        {user ? (
          <span>Hi, {user.username || user.email}</span>
        ) : (
          <Link to="/login" className="link">Login</Link>
        )}
      </div>

      <div className="main-content">
        <Link to="/">
          <img src="/Homepage_images/LOGO_WHITE.png" alt="CamFlea" className="logo" />
        </Link>
        
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-icon">
              <img src="/Homepage_images/search.png" alt="Search" />
            </button>
          </form>
        </div>

        <div className="ask-ai-container">
          <span className="ask-ai">Ask AI</span>
          <img src="/Homepage_images/ai.png" alt="AI" className="ask-ai-icon" />
        </div>
      </div>

      <div className="notifications-container">
        <Link to="/notifications" className="nav-item">
          <img src="/Homepage_images/bell.png" alt="Notifications" className="nav-icon" />
          <span>Notifications</span>
        </Link>
        
        <Link to="/messages" className="nav-item">
          <img src="/Homepage_images/star.png" alt="Messages" className="nav-icon" />
          <span>Messages</span>
        </Link>
        
        <Link to="/post-item" className="nav-item">
          <img src="/Homepage_images/bulb.png" alt="Post" className="nav-icon" />
          <span>Post</span>
        </Link>
        
        {user && (
          <button onClick={handleSignOut} className="logout nav-item">
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;