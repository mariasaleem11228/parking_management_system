import React, { useEffect, useState } from 'react';
import { reservationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { XCircle, CheckCircle, RefreshCw, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  ACTIVE:    'badge-teal',
  RESERVED:  'badge-reserved',
  FINISHED:  'badge-free',
  CANCELLED: 'badge-occupied',
};

const DEMO = [
  { id:101, spaceName:'A-01', zoneName:'Zone A – Central',  userName:'Jane Doe',    status:'ACTIVE',    startTime:'2024-03-25T09:00:00', endTime:null,                  totalAmount:null },
  { id:102, spaceName:'B-03', zoneName:'Zone B – Station',  userName:'Mark Weber',  status:'ACTIVE',    startTime:'2024-03-25T10:30:00', endTime:null,                  totalAmount:null },
  { id:103, spaceName:'A-05', zoneName:'Zone A – Central',  userName:'Sara Klein',  status:'FINISHED',  startTime:'2024-03-25T07:00:00', endTime:'2024-03-25T09:30:00', totalAmount:6.25 },
  { id:104, spaceName:'C-02', zoneName:'Zone C – Market',   userName:'Tom Richter', status:'CANCELLED', startTime:'2024-03-25T08:00:00', endTime:null,                  totalAmount:null },
  { id:105, spaceName:'D-01', zoneName:'Zone D – Hospital', userName:'Jane Doe',    status:'RESERVED',  startTime:'2024-03-25T14:00:00', endTime:null,                  totalAmount:null },
];

export default function ReservationsAdmin() {
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [filter,       setFilter]       = useState('');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  const load = () => {
    reservationApi.getAll({ status: filter || undefined })
      .then(r => setReservations(r.data?.content ?? r.data ?? []))
      .catch(() => setReservations(DEMO))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const handleFinish = async (id) => {
    try { await reservationApi.finish(id); toast.success('Reservation finished'); load(); }
    catch { toast.error('Failed to finish reservation'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try { await reservationApi.cancel(id); toast.success('Reservation cancelled'); load(); }
    catch { toast.error('Failed to cancel reservation'); }
  };

  const fmt = (dt) => { try { return format(new Date(dt), 'dd MMM, HH:mm'); } catch { return dt; } };

  const filtered = reservations.filter(r => {
    const q = search.toLowerCase();
    return !search || (r.userName ?? '').toLowerCase().includes(q) || (r.spaceName ?? '').toLowerCase().includes(q);
  });

  const counts = { ACTIVE:0, RESERVED:0, FINISHED:0, CANCELLED:0 };
  reservations.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>Reservations</h1>
          <p>Monitor and manage all parking reservations across the city</p>
        </div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15}/> Refresh</button>
      </div>

      {/* Status filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        {[['', 'All'], ['ACTIVE', 'Active'], ['RESERVED', 'Reserved'], ['FINISHED', 'Finished'], ['CANCELLED', 'Cancelled']].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(val)}>
            {label}
            {val && <span style={{ marginLeft:4, opacity:0.7, fontSize:11 }}>({counts[val] ?? 0})</span>}
          </button>
        ))}
        <div style={{ position:'relative', marginLeft:'auto' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
          <input className="input" style={{ paddingLeft:32, width:220 }} placeholder="Search space or user…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Space</th><th>Zone</th><th>Citizen</th><th>Status</th><th>Start</th><th>End</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>#{r.id}</td>
                  <td><strong>{r.spaceName ?? '—'}</strong></td>
                  <td style={{ color:'var(--text-secondary)', fontSize:13 }}>{r.zoneName ?? '—'}</td>
                  <td>{r.userName ?? r.citizenName ?? '—'}</td>
                  <td><span className={`badge ${STATUS_COLORS[r.status] ?? 'badge-teal'}`}>{r.status}</span></td>
                  <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{r.startTime ? fmt(r.startTime) : '—'}</td>
                  <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{r.endTime   ? fmt(r.endTime)   : '—'}</td>
                  <td style={{ fontWeight:600, color:'var(--green)' }}>
                    {r.totalAmount != null ? `€${Number(r.totalAmount).toFixed(2)}` : '—'}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      {(r.status === 'ACTIVE' || r.status === 'RESERVED') && (
                        <>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Mark finished" onClick={() => handleFinish(r.id)}>
                            <CheckCircle size={14} color="var(--green)"/>
                          </button>
                          <button className="btn btn-danger btn-icon btn-sm" title="Cancel" onClick={() => handleCancel(r.id)}>
                            <XCircle size={14}/>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No reservations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
