// Auth.jsx
import React, { useState, useEffect } from 'react';
import { requestOTP, verifyOTP } from '../services/authService';
import '../Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLoggedInScreen, setShowLoggedInScreen] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setLoggedInUser(payload.email);
        setShowLoggedInScreen(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Token might be invalid, clear it
        logout();
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setLoggedInUser(null);
    setShowLoggedInScreen(false);
    setMessage({ text: 'Successfully logged out!', type: 'success' });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ text: 'Please enter a valid email', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await requestOTP(email);
      setStep(2);
      setMessage({ 
        text: `OTP sent to ${email}. Check your inbox!`, 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.detail || 'Failed to send OTP', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Please enter a 6-digit OTP', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Decode and set logged in user
      const payload = JSON.parse(atob(access.split('.')[1]));
      setLoggedInUser(payload.email);
      setShowLoggedInScreen(true);
      
      setMessage({ 
        text: `Successfully ${isLogin ? 'logged in' : 'signed up'}!`, 
        type: 'success' 
      });
      
      // Reset form for next time
      setEmail('');
      setOtp('');
      setStep(1);
      
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.detail || 'Invalid OTP', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setEmail('');
    setOtp('');
    setMessage({ text: '', type: '' });
  };

  const reLogin = () => {
    logout();
    setIsLogin(true);
    setStep(1);
    setEmail('');
    setOtp('');
    setMessage({ text: 'Please log in with your credentials', type: 'info' });
  };

  // If user is logged in, show the logged in state
  if (showLoggedInScreen && loggedInUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logged-in-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2>Welcome Back!</h2>
            <div className="user-email-display">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="email-icon">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <span>{loggedInUser}</span>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="logged-in-status">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>You are currently logged in</span>
            </div>
          </div>

          <div className="logged-in-actions">
            <button 
              className="action-button primary-action"
              onClick={() => {
                // Redirect to dashboard or home
                window.location.href = '/dashboard';
              }}
            >
              Go to Dashboard
            </button>
            
            <div className="auth-actions">
              <button 
                className="action-button secondary-action"
                onClick={reLogin}
              >
                Login as Different User
              </button>
              
              <button 
                className="action-button logout-action"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Not {loggedInUser}? 
              <button 
                type="button" 
                className="toggle-button"
                onClick={reLogin}
              >
                Click here to login as different user
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normal login/signup form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Sign up for a new account'}</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                required
                disabled={loading}
                maxLength={6}
              />
              <p className="otp-info">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div className="auth-actions">
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Change Email
              </button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await requestOTP(email);
                    setMessage({ 
                      text: 'New OTP sent!', 
                      type: 'success' 
                    });
                  } catch (error) {
                    setMessage({ 
                      text: 'Failed to resend OTP', 
                      type: 'error' 
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : `${isLogin ? 'Login' : 'Sign Up'}`}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleMode}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;