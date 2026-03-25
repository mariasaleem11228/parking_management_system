import React, { useEffect, useState } from 'react';
import { analyticsApi, reservationApi, billingApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Car, CalendarCheck, TrendingUp, Activity, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#00d4b8', '#f59e0b', '#ef4444', '#3b82f6'];

// Fallback data for demo when backend isn't connected
const DEMO_STATS = {
  totalZones: 8, totalSpaces: 124, activeReservations: 37, todayRevenue: 428.50
};
const DEMO_OCCUPANCY = [
  { hour: '06:00', occupancy: 12 }, { hour: '08:00', occupancy: 64 },
  { hour: '10:00', occupancy: 80 }, { hour: '12:00', occupancy: 91 },
  { hour: '14:00', occupancy: 75 }, { hour: '16:00', occupancy: 88 },
  { hour: '18:00', occupancy: 72 }, { hour: '20:00', occupancy: 48 },
  { hour: '22:00', occupancy: 28 },
];
const DEMO_ZONE_PIE = [
  { name: 'Zone A – Central', value: 92 },
  { name: 'Zone B – Station', value: 65 },
  { name: 'Zone C – Market', value: 78 },
  { name: 'Zone D – Hospital', value: 44 },
];
const DEMO_RECENT = [
  { id: 1, spaceName: 'A-12', userName: 'Jane Doe',    status: 'ACTIVE',   startTime: '09:15', duration: '2h' },
  { id: 2, spaceName: 'B-04', userName: 'Mark Weber',  status: 'ACTIVE',   startTime: '10:00', duration: '1h' },
  { id: 3, spaceName: 'C-07', userName: 'Sara Klein',  status: 'FINISHED', startTime: '08:00', duration: '3h' },
  { id: 4, spaceName: 'A-21', userName: 'Tom Richter', status: 'CANCELLED',startTime: '11:30', duration: '—' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [stats,    setStats]    = useState(null);
  const [occupancy,setOccupancy]= useState(DEMO_OCCUPANCY);
  const [zonePie,  setZonePie]  = useState(DEMO_ZONE_PIE);
  const [recent,   setRecent]   = useState(DEMO_RECENT);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getZoneSummary().catch(() => null),
      analyticsApi.getOccupancy().catch(() => null),
      reservationApi.getAll({ size: 5, sort: 'createdAt,desc' }).catch(() => null),
    ]).then(([summary, occ, res]) => {
      if (summary?.data) {
        setStats({
          totalZones:          summary.data.totalZones        ?? DEMO_STATS.totalZones,
          totalSpaces:         summary.data.totalSpaces       ?? DEMO_STATS.totalSpaces,
          activeReservations:  summary.data.activeReservations?? DEMO_STATS.activeReservations,
          todayRevenue:        summary.data.todayRevenue      ?? DEMO_STATS.todayRevenue,
        });
        if (summary.data.zoneOccupancy?.length) setZonePie(summary.data.zoneOccupancy);
      } else {
        setStats(DEMO_STATS);
      }
      if (occ?.data?.length)   setOccupancy(occ.data);
      if (res?.data?.content?.length) setRecent(res.data.content.slice(0,5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', paddingTop:60 }}><span className="spinner" /></div>;

  const statCards = [
    { label:'Parking Zones',       value: stats.totalZones,          icon: MapPin,      color:'var(--teal)',   sub:'active zones' },
    { label:'Total Spaces',        value: stats.totalSpaces,         icon: Car,         color:'var(--blue)',   sub:'across all zones' },
    { label:'Active Reservations', value: stats.activeReservations,  icon: CalendarCheck,color:'var(--amber)', sub:'right now' },
    { label:"Today's Revenue",     value: `€${Number(stats.todayRevenue).toFixed(2)}`, icon: TrendingUp, color:'var(--green)', sub:'billing collected' },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's what's happening in your parking network today.</p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div className="stat-card" key={label}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span className="stat-label">{label}</span>
              <div style={{ padding:8, borderRadius:'var(--radius-sm)', background:`${color}18` }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:28 }}>
        {/* Occupancy area chart */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <Activity size={16} color="var(--teal)" />
            <h3 style={{ fontSize:15 }}>Occupancy Today</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={occupancy}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4b8" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00d4b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis unit="%" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:8, fontSize:13 }} />
              <Area type="monotone" dataKey="occupancy" stroke="var(--teal)" strokeWidth={2} fill="url(#tealGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone pie */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <MapPin size={16} color="var(--amber)" />
            <h3 style={{ fontSize:15 }}>Zone Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={zonePie} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} strokeWidth={2}>
                {zonePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} />
              <Legend wrapperStyle={{ fontSize:11, paddingTop:8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent reservations */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <Clock size={16} color="var(--purple)" />
          <h3 style={{ fontSize:15 }}>Recent Reservations</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Space</th><th>Citizen</th><th>Status</th><th>Start</th><th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.spaceName ?? r.id}</strong></td>
                  <td>{r.userName ?? r.citizenName ?? '—'}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'ACTIVE'    ? 'badge-teal' :
                      r.status === 'FINISHED'  ? 'badge-free' :
                      r.status === 'CANCELLED' ? 'badge-occupied' : 'badge-reserved'
                    }`}>{r.status}</span>
                  </td>
                  <td style={{ color:'var(--text-secondary)' }}>{r.startTime ?? '—'}</td>
                  <td style={{ color:'var(--text-secondary)' }}>{r.duration ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
