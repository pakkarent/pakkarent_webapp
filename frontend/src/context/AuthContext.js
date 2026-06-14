import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';
import getSupabase from '../utils/supabase';
import { setSupabaseAccessToken, clearAuthTokens } from '../utils/authToken';

const AuthContext = createContext(null);

const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

async function syncSupabaseSession(session, profile) {
  const res = await axios.post(
    `${API_BASE}/api/auth/supabase/sync`,
    profile || {},
    { headers: { Authorization: `Bearer ${session.access_token}` } }
  );
  setSupabaseAccessToken(session.access_token);
  localStorage.removeItem('pakkarent_token');
  localStorage.setItem('pakkarent_user', JSON.stringify(res.data.user));
  return res.data.user;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((appUser, accessToken) => {
    if (accessToken) setSupabaseAccessToken(accessToken);
    if (appUser) localStorage.setItem('pakkarent_user', JSON.stringify(appUser));
    setUser(appUser);
  }, []);

  const clearLocalAuth = useCallback(() => {
    clearAuthTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    const sb = getSupabase();

    const restore = async () => {
      if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
          try {
            const appUser = await syncSupabaseSession(session);
            setUser(appUser);
            setLoading(false);
            return;
          } catch {
            clearLocalAuth();
          }
        }
      }

      const legacyToken = localStorage.getItem('pakkarent_token');
      const savedUser = localStorage.getItem('pakkarent_user');
      if (legacyToken && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    restore();

    if (!sb) return undefined;

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clearLocalAuth();
        return;
      }
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        try {
          const appUser = await syncSupabaseSession(session);
          setUser(appUser);
        } catch {
          // keep existing session state on background refresh failures
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [clearLocalAuth]);

  const login = async (email, password, website = '') => {
    const res = await authAPI.login({ email, password, website });
    const { token, user: appUser } = res.data;
    localStorage.setItem('pakkarent_token', token);
    setSupabaseAccessToken(null);
    localStorage.setItem('pakkarent_user', JSON.stringify(appUser));
    setUser(appUser);
    return appUser;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, user: appUser } = res.data;
    localStorage.setItem('pakkarent_token', token);
    setSupabaseAccessToken(null);
    localStorage.setItem('pakkarent_user', JSON.stringify(appUser));
    setUser(appUser);
    return appUser;
  };

  const loginWithGoogle = async () => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase is not configured');
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const sendPhoneOtp = async (phone) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase is not configured');
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await sb.auth.signInWithOtp({ phone: normalized });
    if (error) throw error;
    return normalized;
  };

  const verifyPhoneOtp = async (phone, otp, profile) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase is not configured');
    const { data, error } = await sb.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    if (error) throw error;
    if (data.session) {
      const appUser = await syncSupabaseSession(data.session, profile);
      setUser(appUser);
      return appUser;
    }
    throw new Error('Verification failed');
  };

  const logout = async () => {
    const sb = getSupabase();
    const legacyToken = localStorage.getItem('pakkarent_token');
    if (sb && !legacyToken) {
      await sb.auth.signOut();
    }
    clearLocalAuth();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      loginWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      logout,
      loading,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
