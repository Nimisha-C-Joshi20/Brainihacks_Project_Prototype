import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [role, setRole] = useState('citizen'); // 'citizen' | 'official'
    const [step, setStep] = useState('INPUT'); // 'INPUT' | 'OTP'
    const [identifier, setIdentifier] = useState(''); // Email or Phone
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginWithOTP, verifyOTP, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!identifier) {
            setError('Please enter a valid email or phone number');
            setLoading(false);
            return;
        }

        try {
            await loginWithOTP(identifier, role);
            setStep('OTP');
            setLoading(false);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOTP(identifier, otp, role);
            navigate(role === 'citizen' ? '/citizen/dashboard' : '/official/dashboard');
        } catch (err) {
            setError('Invalid OTP. Use 123456');
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        try {
            await demoLogin(role === 'citizen' ? 'citizen@example.com' : 'official@example.com', role);
            navigate(role === 'citizen' ? '/citizen/dashboard' : '/official/dashboard');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', paddingTop: '15vh' }}>

            <div className="card">
                {/* Role Toggle */}
                <div style={{ display: 'flex', marginBottom: '1.5rem', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                    <button
                        className="btn"
                        style={{
                            flex: 1,
                            background: role === 'citizen' ? 'white' : 'transparent',
                            boxShadow: role === 'citizen' ? 'var(--shadow-sm)' : 'none',
                            color: role === 'citizen' ? 'var(--primary)' : 'var(--text-muted)'
                        }}
                        onClick={() => { setRole('citizen'); setStep('INPUT'); setError(''); }}
                    >
                        Citizen
                    </button>
                    <button
                        className="btn"
                        style={{
                            flex: 1,
                            background: role === 'official' ? 'white' : 'transparent',
                            boxShadow: role === 'official' ? 'var(--shadow-sm)' : 'none',
                            color: role === 'official' ? 'var(--primary)' : 'var(--text-muted)'
                        }}
                        onClick={() => { setRole('official'); setStep('INPUT'); setError(''); }}
                    >
                        Official
                    </button>
                </div>

                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
                    {step === 'INPUT' ? 'Login / Sign Up' : 'Verify OTP'}
                </h2>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                {step === 'INPUT' ? (
                    <form onSubmit={handleSendOTP}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}> Phone or Email</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. +1234567890 or user@example.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Enter the code sent to {identifier}
                            </p>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('INPUT')}
                            style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            Change Number
                        </button>
                    </form>
                )}

                <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }}></div>

                <button
                    onClick={handleDemoLogin}
                    className="btn btn-secondary"
                    style={{ width: '100%', border: '1px dashed var(--border)' }}
                >
                    Demo Login (Skip OTP)
                </button>
            </div>
        </div>
    );
};

export default Auth;
