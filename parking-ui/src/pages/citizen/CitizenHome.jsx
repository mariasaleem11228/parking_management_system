import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Map, CalendarCheck, Receipt, Clock, MapPin, ChevronRight, Car } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './CitizenHome.css';

export default function CitizenHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active,   setActive]   = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    reservationApi.getMine()
      .then(r => {
        const all = r.data?.content ?? r.data ?? [];
        setActive(all.find(r => r.status === 'ACTIVE' || r.status === 'RESERVED') ?? null);
        setRecent(all.filter(r => r.status === 'FINISHED' || r.status === 'CANCELLED').slice(0, 3));
      })
      .catch(() => {
        // demo fallback
        setActive({ id:101, spaceName:'A-02', zoneName:'Zone A – Central', status:'ACTIVE',
          startTime: new Date(Date.now() - 45*60*1000).toISOString() });
        setRecent([
          { id:99, spaceName:'B-04', zoneName:'Zone B – Station', status:'FINISHED', totalAmount:8.50, startTime:'2024-03-24T14:00:00' },
          { id:98, spaceName:'C-01', zoneName:'Zone C – Market',  status:'FINISHED', totalAmount:3.00, startTime:'2024-03-23T10:00:00' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label:'Find Parking', icon: Map,          color:'var(--teal)',   path:'/citizen/map' },
    { label:'My Bookings',  icon: CalendarCheck, color:'var(--blue)',   path:'/citizen/reservations' },
    { label:'Billing',      icon: Receipt,       color:'var(--amber)',  path:'/citizen/billing' },
  ];

  return (
    <div className="citizen-home animate-in">
      {/* Hero greeting */}
      <div className="home-hero">
        <div className="hero-text">
          <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Where would you like to park today?</p>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6,
                   background:'transparent', border:'1px solid var(--border)',
                   borderRadius:'var(--radius-sm)', padding:'6px 12px',
                   color:'var(--text-secondary)', cursor:'pointer', fontSize:13 }}
        >
          <LogOut size={15}/> Logout
        </button>

        {user?.licensePlate && (
          <div className="license-chip">
            <Car size={14}/> {user.licensePlate}
          </div>
        )}
      </div>

      {/* Active reservation banner */}
      {!loading && active && (
        <div className="active-banner animate-in" onClick={() => navigate('/citizen/reservations')}>
          <div className="active-banner-left">
            <div className="active-pulse" />
            <div>
              <div className="active-label">
                {active.status === 'ACTIVE' ? 'Currently Parked' : 'Upcoming Reservation'}
              </div>
              <div className="active-space">
                {active.spaceName} — {active.zoneName}
              </div>
              <div className="active-since">
                {active.status === 'ACTIVE'
                  ? `Started ${formatDistanceToNow(new Date(active.startTime), { addSuffix: true })}`
                  : `Starts ${formatDistanceToNow(new Date(active.startTime), { addSuffix: true })}`}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <ChevronRight size={18} color="var(--teal)"/>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:16, marginBottom:14, fontWeight:600 }}>Quick Actions</h2>
        <div className="quick-actions">
          {quickActions.map(({ label, icon: Icon, color, path }) => (
            <button key={label} className="quick-action-card" onClick={() => navigate(path)}>
              <div className="quick-action-icon" style={{ background:`${color}18`, color }}>
                <Icon size={22}/>
              </div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Find parking CTA */}
      <div className="find-cta" onClick={() => navigate('/citizen/map')}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:4 }}>
            Find Available Parking
          </div>
          <div style={{ fontSize:13, color:'rgba(11,15,26,0.7)' }}>
            Search map for free spaces near you
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:600 }}>
          <MapPin size={18}/> Open Map
        </div>
      </div>

      {/* Recent history */}
      {recent.length > 0 && (
        <div style={{ marginTop:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h2 style={{ fontSize:16, fontWeight:600 }}>Recent Parking</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/citizen/reservations')}>
              View all <ChevronRight size={14}/>
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {recent.map(r => (
              <div key={r.id} className="card card-sm" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ padding:8, borderRadius:'var(--radius-sm)', background:'var(--bg-elevated)' }}>
                    <Clock size={16} color="var(--text-muted)"/>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{r.spaceName} — {r.zoneName}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.startTime?.split('T')[0]}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, color:'var(--green)' }}>€{Number(r.totalAmount ?? 0).toFixed(2)}</div>
                  <span className={`badge ${r.status==='FINISHED'?'badge-free':'badge-occupied'}`} style={{ fontSize:11 }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
