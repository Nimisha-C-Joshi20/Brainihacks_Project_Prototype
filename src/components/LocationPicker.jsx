import React, { useState, useEffect } from 'react';

const LocationPicker = ({ onLocationSelect }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: 'Detected Location (Simulated Address)'
                };
                setLocation(newLocation);
                onLocationSelect(newLocation);
                setLoading(false);
            },
            (err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Location</label>

            <div
                style={{
                    height: '150px',
                    background: '#e5e7eb',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    backgroundImage: location ? 'url(https://via.placeholder.com/400x150/e5e7eb/9ca3af?text=Map+View)' : 'none',
                    backgroundSize: 'cover',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onClick={handleGetLocation}
            >
                {/* Map Simulation - Visual Mock */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'url("https://maps.googleapis.com/maps/api/staticmap?center=40.714%2c-73.998&zoom=12&size=400x150&sensor=false&key=YOUR_KEY") center/cover no-repeat',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}></div>

                {loading ? (
                    <span style={{ zIndex: 1 }}>Locating...</span>
                ) : location ? (
                    <div style={{ zIndex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>📍</span>
                        <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '4px' }}>
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                    </div>
                ) : (
                    <span style={{ zIndex: 1, color: 'var(--text-muted)' }}>Tap to set location</span>
                )}
            </div>

            <button
                type="button"
                onClick={handleGetLocation}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
            >
                📍 Use Current Location
            </button>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
};

export default LocationPicker;
