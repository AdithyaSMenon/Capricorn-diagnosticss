import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await login(email, password);
    if (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-logo" style={{ justifyContent: 'center', borderBottom: 'none', padding: 0, marginBottom: '1.5rem' }}>
          <div className="admin-logo-icon">CD</div>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9375rem', display: 'block' }}>Capricorn Diagnostics</span>
            <small style={{ color: 'var(--gray-400)', fontSize: '0.6875rem' }}>Admin Portal</small>
          </div>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to manage your website</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} id="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
          Restricted access. Admin only.
        </p>
      </div>
    </div>
  );
}
