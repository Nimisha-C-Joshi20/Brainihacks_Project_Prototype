import React, { useState, useEffect } from 'react';
import SideNav from '../../components/SideNav';
import { useAuth } from '../../context/AuthContext';
import { getIssues, updateIssueStatus } from '../../services/issueService';

import { useNavigate } from 'react-router-dom';

const OfficialDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('All'); // All, Pending, Resolved

    useEffect(() => {
        // Poll for updates (mock real-time)
        const loadIssues = () => {
            setReports(getIssues());
        };
        loadIssues();
        const interval = setInterval(loadIssues, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleStatusChange = (id, newStatus) => {
        updateIssueStatus(id, newStatus);
        setReports(getIssues()); // Refresh immediately
    };

    const filteredReports = reports.filter(r =>
        filter === 'All' ? true : r.status === filter
    );

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'Critical': return '#EF4444';
            case 'High': return '#F59E0B';
            case 'Medium': return '#3B82F6';
            default: return '#10B981';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <SideNav role="official" />
            <div className="screen-container" style={{ flex: 1, paddingBottom: '2rem' }}>
                <header style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Official Dashboard</h2>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        >
                            Sign Out
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {['All', 'Pending', 'Resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '99px',
                                    border: 'none',
                                    background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                                    color: filter === f ? 'white' : 'var(--text-main)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: filter === f ? 'var(--shadow-md)' : 'none',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredReports.map(report => (
                        <div key={report.id} className="card" style={{ borderLeft: `4px solid ${getUrgencyColor(report.urgency)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{report.id} • {report.date}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: getUrgencyColor(report.urgency) }}>{report.urgency} Priority</span>
                            </div>
                            <h4 style={{ marginBottom: '0.25rem' }}>{report.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{report.description}</p>
                            {report.location && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>📍 {report.location.address}</p>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {report.status !== 'Resolved' && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        onClick={() => handleStatusChange(report.id, 'Resolved')}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                {report.status !== 'Pending' && (
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        onClick={() => handleStatusChange(report.id, 'Pending')}
                                    >
                                        Re-open
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredReports.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No issues found.</p>}
                </div>
            </div>
        </div>
    );
};

export default OfficialDashboard;
