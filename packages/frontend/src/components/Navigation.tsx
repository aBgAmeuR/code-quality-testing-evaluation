import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import { User } from '../types';


const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/users" style={{
          color: 'white',
          textDecoration: 'none',
          marginRight: '20px'
        }}>Users</Link>
        <Link to="/products" style={{
          color: 'white',
          textDecoration: 'none'
        }}>Products</Link>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{
          color: 'white',
          marginRight: '20px'
        }}>
          Welcome, {user ? user.firstname : 'User'}!
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
