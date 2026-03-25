import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MapPin, ParkingSquare, DollarSign,
  Users, CalendarCheck, Receipt, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import './AdminLayout.css';

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/admin/zones',        icon: MapPin,          label: 'Zones' },
  { to: '/admin/spaces',       icon: ParkingSquare,   label: 'Spaces' },
  { to: '/admin/pricing',      icon: DollarSign,      label: 'Pricing' },
  { to: '/admin/reservations', icon: CalendarCheck,   label: 'Reservations' },
  { to: '/admin/billing',      icon: Receipt,         label: 'Billing' },
  { to: '/admin/users',        icon: Users,           label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <MapPin size={22} strokeWidth={2.5} />
          <span>ParkCity</span>
          <button className="btn btn-ghost btn-icon mobile-close" onClick={() => setOpen(false)}><X size={18}/></button>
        </div>

        <div className="sidebar-section-label">Management</div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="sidebar-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0] ?? 'A'}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="btn btn-ghost btn-icon mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-title">City Administration</div>
          <div className="topbar-badge">Admin Portal</div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
