import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import LocationPicker from '../../components/LocationPicker';
import { analyzeComplaint } from '../../services/aiService';
import { addIssue } from '../../services/issueService';

const ReportIssue = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [urgency, setUrgency] = useState('');
    const [location, setLocation] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [sentiment, setSentiment] = useState(null);

    // Debounce analysis
    useEffect(() => {
        const timer = setTimeout(() => {
            if (description.length > 10) {
                performAnalysis();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [description]);

    const performAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeComplaint(description);
            setCategory(result.category);
            setUrgency(result.urgency);
            setSentiment(result.sentiment);
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !location) {
            alert('Please provide a description and location.');
            return;
        }

        // Save to LocalStorage
        addIssue({
            title: description.substring(0, 30) + '...', // Generate title from desc
            description,
            category,
            urgency,
            location,
            sentiment
        });

        alert('Report Submitted Successfully!');
        navigate('/citizen/dashboard');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <SideNav role="citizen" />
            <div className="screen-container" style={{ flex: 1, paddingBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>New Report</h2>

                <form onSubmit={handleSubmit}>
                    <LocationPicker onLocationSelect={setLocation} />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            className="input-field"
                            rows="4"
                            placeholder="Describe the issue... (e.g. 'Large pothole causing traffic')"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* AI Insights Card */}
                    {(isAnalyzing || category) && (
                        <div className="card" style={{
                            background: 'linear-gradient(to right, #eff6ff, #ffffff)',
                            border: '1px solid #bfdbfe'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ marginRight: '0.5rem' }}>🤖</span>
                                <h4 style={{ fontSize: '0.9rem', color: '#1e40af' }}>AI Analysis</h4>
                            </div>

                            {isAnalyzing ? (
                                <p style={{ fontSize: '0.8rem', color: '#60a5fa' }}>Analyzing content...</p>
                            ) : (
                                <div style={{ fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Category:</span>
                                        <span style={{ fontWeight: '600' }}>{category}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Urgency:</span>
                                        <span style={{
                                            fontWeight: '600',
                                            color: urgency === 'High' || urgency === 'Critical' ? 'var(--danger)' : 'var(--secondary)'
                                        }}>
                                            {urgency}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Photo Evidence</label>
                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            background: 'var(--bg-card)'
                        }}>
                            📷 Upload Photo
                            <input type="file" style={{ opacity: 0, position: 'absolute', left: 0, right: 0 }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;
