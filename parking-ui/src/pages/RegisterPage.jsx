import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapPin } from 'lucide-react';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ name:'', email:'', password:'', confirmPassword:'', licensePlate:'' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register({ ...payload, role: 'CITIZEN' });
      toast.success('Account created! Welcome aboard.');
      navigate('/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join ParkCity to find and reserve parking</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full name</label>
            <input className="input" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
          </div>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input className="input" type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="input-group">
            <label className="input-label">License Plate (optional)</label>
            <input className="input" type="text" placeholder="DO-PK-1234" value={form.licensePlate} onChange={set('licensePlate')} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="input-group">
            <label className="input-label">Confirm password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} required />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
