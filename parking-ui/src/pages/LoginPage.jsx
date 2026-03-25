import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapPin } from 'lucide-react';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'ADMIN' ? '/admin' : '/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <MapPin size={28} />
          <span>ParkCity</span>
        </div>
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-sub">Access your parking dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input className="input" type="email" placeholder="you@city.gov" value={form.email} onChange={set('email')} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/register">Register here</Link>
        </p>

        {/* Demo hint */}
        <div className="auth-demo">
          <p>Demo logins — Admin: <code>admin@city.gov</code> / <code>admin</code></p>
          <p>Citizen: <code>jane@example.com</code> / <code>citizen</code></p>
        </div>
      </div>
    </div>
  );
}
