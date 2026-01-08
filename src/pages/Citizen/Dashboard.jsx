
import React, { useState, useEffect } from 'react';
import SideNav from '../../components/SideNav';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getIssues } from '../../services/issueService';

const CitizenDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        setReports(getIssues());
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'var(--secondary)';
            case 'Pending': return 'var(--accent)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <SideNav role="citizen" />
            <div className="screen-container" style={{ flex: 1, paddingBottom: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem' }}>My Reports</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, Citizen</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                        Sign Out
                    </button>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reports.map(report => (
                        <div key={report.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ marginBottom: '0.25rem' }}>{report.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{report.date}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    backgroundColor: getStatusColor(report.status) + '20', // 20% opacity
                                    color: getStatusColor(report.status)
                                }}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    ))}

                    {reports.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <p>No reports yet.</p>
                            <p>Spot an issue? Reporting is just a tap away.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
