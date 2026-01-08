import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isConfigured } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // 'citizen' or 'official'

    // Demo Login for Prototype if Firebase is not configured
    const demoLogin = async (email, role) => {
        const demoUser = {
            uid: 'demo-' + role + '-123',
            email: email,
            displayName: role === 'citizen' ? 'John Citizen' : 'Officer Smith',
        };
        setCurrentUser(demoUser);
        setUserRole(role);
        setLoading(false);
        return demoUser;
    };

    // Mock OTP Login for Prototype
    const loginWithOTP = async (identifier, role) => {
        // Simulate sending OTP
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'OTP Sent to ' + identifier });
            }, 1000);
        });
    };

    const verifyOTP = async (identifier, otp, role) => {
        // Simulate verification (Fixed OTP: 123456)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '123456') {
                    const user = {
                        uid: 'otp-user-' + Date.now(),
                        email: identifier.includes('@') ? identifier : undefined,
                        phoneNumber: !identifier.includes('@') ? identifier : undefined,
                        displayName: role === 'citizen' ? 'Citizen User' : 'Official User',
                    };
                    setCurrentUser(user);
                    setUserRole(role);
                    setLoading(false);
                    resolve(user);
                } else {
                    reject(new Error('Invalid OTP'));
                }
            }, 1000);
        });
    };

    const login = async (email, password) => {
        if (!isConfigured) return demoLogin(email, 'citizen'); // Default fallback
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = (email, password) => {
        if (!isConfigured) return demoLogin(email, 'citizen');
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        if (!isConfigured) {
            setCurrentUser(null);
            setUserRole(null);
            return Promise.resolve();
        }
        return signOut(auth);
    };

    useEffect(() => {
        if (!isConfigured) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // In a real app, we would fetch the user role from Firestore here
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loginWithOTP,
        verifyOTP,
        login,
        register,
        logout,
        demoLogin // Exposed for specific demo buttons
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
