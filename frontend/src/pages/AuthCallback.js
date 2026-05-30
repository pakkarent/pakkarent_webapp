import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getSupabase from '../utils/supabase';
import './Auth.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setError('Supabase is not configured');
      return;
    }

    sb.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError || !session) {
        setError(sessionError?.message || 'Sign-in was cancelled or failed.');
        setTimeout(() => navigate('/login'), 2500);
        return;
      }
      navigate('/', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form auth-callback">
          {error ? (
            <>
              <p className="alert alert-error">{error}</p>
              <p>Redirecting to login…</p>
            </>
          ) : (
            <p>Completing sign-in…</p>
          )}
        </div>
      </div>
    </div>
  );
}
