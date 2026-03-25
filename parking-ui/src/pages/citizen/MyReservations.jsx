import React, { useEffect, useState } from 'react';
import { reservationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { XCircle, CheckCircle, Clock, MapPin, RefreshCw, CalendarCheck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const STATUS_META = {
  ACTIVE:    { label:'Active',    class:'badge-teal',     dot:'dot-green' },
  RESERVED:  { label:'Upcoming', class:'badge-reserved',  dot:'dot-amber' },
  FINISHED:  { label:'Finished', class:'badge-free',      dot:'' },
  CANCELLED: { label:'Cancelled',class:'badge-occupied',  dot:'' },
};

const DEMO = [
  { id:101, spaceName:'A-02', zoneName:'Zone A – Central',  status:'ACTIVE',    startTime:'2024-03-25T09:00:00', endTime:null,                  totalAmount:null },
  { id:100, spaceName:'B-01', zoneName:'Zone B – Station',  status:'RESERVED',  startTime:'2024-03-26T14:00:00', endTime:'2024-03-26T16:00:00', totalAmount:null },
  { id:99,  spaceName:'B-04', zoneName:'Zone B – Station',  status:'FINISHED',  startTime:'2024-03-24T10:00:00', endTime:'2024-03-24T14:00:00', totalAmount:8.50 },
  { id:98,  spaceName:'C-01', zoneName:'Zone C – Market',   status:'FINISHED',  startTime:'2024-03-23T09:00:00', endTime:'2024-03-23T11:00:00', totalAmount:6.00 },
  { id:97,  spaceName:'A-05', zoneName:'Zone A – Central',  status:'CANCELLED', startTime:'2024-03-22T08:00:00', endTime:null,                  totalAmount:null },
];

export default function MyReservations() {
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [filter,       setFilter]       = useState('');
  const [loading,      setLoading]      = useState(true);

  const load = () => {
    setLoading(true);
    reservationApi.getMine()
      .then(r => setReservations(r.data?.content ?? r.data ?? []))
      .catch(() => setReservations(DEMO))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try { await reservationApi.cancel(id); toast.success('Reservation cancelled'); load(); }
    catch { toast.error('Could not cancel reservation'); }
  };

  const handleCheckIn = async (id) => {
    try { await reservationApi.checkIn(id); toast.success('Checked in! Enjoy your parking.'); load(); }
    catch { toast.error('Check-in failed'); }
  };

  const fmt = (dt) => { try { return format(new Date(dt), 'dd MMM yyyy, HH:mm'); } catch { return '—'; } };
  const fromNow = (dt) => { try { return formatDistanceToNow(new Date(dt), { addSuffix: true }); } catch { return ''; } };

  const filtered = filter ? reservations.filter(r => r.status === filter) : reservations;
  const active   = reservations.find(r => r.status === 'ACTIVE');

  return (
    <div className="animate-in" style={{ maxWidth:680, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontFamily:'var(--font-display)' }}>My Parking</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:13 }}>All your reservations in one place</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14}/></button>
      </div>

      {/* Active session card */}
      {active && (
        <div className="card animate-in" style={{ borderColor:'rgba(0,212,184,0.4)', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--teal)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
                🟢 Currently Parked
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>
                {active.spaceName}
              </div>
              <div style={{ color:'var(--text-secondary)', fontSize:13 }}>{active.zoneName}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Started</div>
              <div style={{ fontWeight:600 }}>{fmt(active.startTime)}</div>
              <div style={{ fontSize:12, color:'var(--teal)' }}>{fromNow(active.startTime)}</div>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(active.id)}>
            <XCircle size={14}/> End Session
          </button>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[['','All'],['ACTIVE','Active'],['RESERVED','Upcoming'],['FINISHED','Finished'],['CANCELLED','Cancelled']].map(([v,l]) => (
          <button key={v} className={`btn btn-sm ${filter===v?'btn-primary':'btn-secondary'}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60, color:'var(--text-muted)' }}>
          <CalendarCheck size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <div>No reservations found</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(r => {
            const meta = STATUS_META[r.status] ?? { label:r.status, class:'badge-teal', dot:'' };
            return (
              <div key={r.id} className="card" style={{
                borderColor: r.status==='ACTIVE' ? 'rgba(0,212,184,0.3)' : 'var(--border)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <strong style={{ fontSize:16 }}>{r.spaceName}</strong>
                      <span className={`badge ${meta.class}`} style={{ fontSize:11 }}>
                        {meta.dot && <span className={`dot ${meta.dot}`}/>}
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', fontSize:13, marginBottom:10 }}>
                      <MapPin size={12}/> {r.zoneName}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'auto auto', gap:'4px 24px', fontSize:13 }}>
                      <span style={{ color:'var(--text-muted)' }}>Start</span>
                      <span>{fmt(r.startTime)}</span>
                      {r.endTime && <>
                        <span style={{ color:'var(--text-muted)' }}>End</span>
                        <span>{fmt(r.endTime)}</span>
                      </>}
                      {r.totalAmount != null && <>
                        <span style={{ color:'var(--text-muted)' }}>Total</span>
                        <span style={{ fontWeight:700, color:'var(--green)' }}>€{Number(r.totalAmount).toFixed(2)}</span>
                      </>}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {r.status === 'RESERVED' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleCheckIn(r.id)}>
                          <CheckCircle size={13}/> Check In
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.id)}>
                          <XCircle size={13}/> Cancel
                        </button>
                      </>
                    )}
                    {r.status === 'ACTIVE' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.id)}>
                        <XCircle size={13}/> End
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
