import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Map, CalendarCheck, Receipt, LogOut, MapPin } from 'lucide-react';
import './CitizenLayout.css';

const NAV = [
  { to: '/citizen',             icon: Home,         label: 'Home',         end: true },
  { to: '/citizen/map',         icon: Map,          label: 'Find Parking' },
  { to: '/citizen/reservations',icon: CalendarCheck,label: 'My Parking' },
  { to: '/citizen/billing',     icon: Receipt,      label: 'Billing' },
];

export default function CitizenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="citizen-shell">
      {/* Top header */}
      <header className="citizen-header">
        <div className="citizen-logo">
          <MapPin size={20} strokeWidth={2.5} />
          <span>ParkCity</span>
        </div>
        <div className="citizen-header-right">
          <div className="citizen-user-chip">
            <div className="sidebar-avatar small">{user?.name?.[0] ?? 'C'}</div>
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="citizen-main">
        <Outlet />
      </main>

      {/* Bottom nav (mobile-first) */}
      <nav className="citizen-bottomnav">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `bnav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
