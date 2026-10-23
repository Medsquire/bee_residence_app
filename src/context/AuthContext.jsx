import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';

const AUTH_STORAGE_KEY = 'bee_residence_auth_user';
const REMEMBER_KEY = 'bee_residence_remember_me';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if session exists in storage
    const saved = loadFromStorage(AUTH_STORAGE_KEY, null);
    if (saved) return saved;
    // Default to Rajesh Kumar (Head of Household) for smooth demo experience
    return INITIAL_USERS[0];
  });

  const [rememberMe, setRememberMe] = useState(() => {
    return loadFromStorage(REMEMBER_KEY, true);
  });

  useEffect(() => {
    if (currentUser) {
      saveToStorage(AUTH_STORAGE_KEY, currentUser);
    } else {
      removeFromStorage(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (phone, password, shouldRemember = true) => {
    // Normalize phone number (strip spaces and +91 prefix)
    const cleaned = ('' + phone).replace(/\D/g, '').slice(-10);
    
    // Find matching user from known users
    const matched = INITIAL_USERS.find(
      (u) => ('' + u.phone).replace(/\D/g, '').slice(-10) === cleaned
    );

    if (!matched) {
      return { success: false, error: 'Phone number not registered with Flat 1204.' };
    }

    if (password !== 'bee123' && password !== 'password') {
      return { success: false, error: 'Invalid password. (Use demo password: "bee123")' };
    }

    setCurrentUser(matched);
    setRememberMe(shouldRemember);
    saveToStorage(REMEMBER_KEY, shouldRemember);
    return { success: true, user: matched };
  };

  const logout = () => {
    setCurrentUser(null);
    removeFromStorage(AUTH_STORAGE_KEY);
  };

  // Quick switch role between Head and Member for demonstration
  const switchUser = (userId) => {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateProfile = (updates) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const isHead = currentUser?.role === 'HEAD' || currentUser?.isHead === true;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isHead,
        login,
        logout,
        switchUser,
        updateProfile,
        availableUsers: INITIAL_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
