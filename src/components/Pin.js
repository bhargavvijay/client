import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pin.css';

export default function Pin() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://home-backend-0zfs.onrender.com/check', {
        method: 'POST',
        body: JSON.stringify({ value }),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        navigate('/orders');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-container">
      <div className="pin-card">
        <h2>Enter Pin</h2>
        <div className="pin-input-group">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your PIN"
            maxLength={6}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || value.length !== 6}
          >
            {loading ? (
              <div className="loader"></div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
        {error && (
          <div className="error-message">{error}</div>
        )}
      </div>
    </div>
  );
}
