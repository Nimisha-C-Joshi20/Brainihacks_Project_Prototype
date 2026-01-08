import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SideNav = ({ role = 'citizen' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const NavItem = ({ to, label, icon }) => {
        const isActive = currentPath === to;
        return (
            <button
                onClick={() => navigate(to)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? 'var(--primary-gradient)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 0.5rem',
                    marginBottom: '0.75rem',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
                <span style={{ fontSize: '1.5rem', marginBottom: '0.2rem', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' }}>{icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '600' : '500', letterSpacing: '0.02em' }}>{label}</span>
            </button>
        );
    };

    return (
        <div style={{
            width: '80px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 0.5rem',
            paddingTop: '6rem', // Space for top header content if needed
            zIndex: 90,
            flexShrink: 0
        }}>
            {role === 'citizen' ? (
                <>
                    <NavItem to="/citizen/dashboard" label="Home" icon="🏠" />
                    <NavItem to="/citizen/report" label="Report" icon="📷" />
                </>
            ) : (
                <>
                    <NavItem to="/official/dashboard" label="Dash" icon="📊" />
                </>
            )}
        </div>
    );
};

export default SideNav;
