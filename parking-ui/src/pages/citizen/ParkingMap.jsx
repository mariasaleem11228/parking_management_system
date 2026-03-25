import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { spaceApi, zoneApi, reservationApi, pricingApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Car, CalendarCheck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:        require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:      require('leaflet/dist/images/marker-shadow.png'),
});

const makeIcon = (status) => L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:${status==='FREE'?'#10b981':status==='RESERVED'?'#f59e0b':'#ef4444'};
    border:3px solid #0b0f1a;
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const DORTMUND_CENTER = [51.5136, 7.4653];

// Demo spaces mapped to Dortmund coordinates
const DEMO_SPACES = [
  { id:1, name:'A-01', zoneId:1, zoneName:'Zone A – Central',  status:'FREE',     lat:51.5145, lng:7.4660, pricePerHour:2.50 },
  { id:2, name:'A-02', zoneId:1, zoneName:'Zone A – Central',  status:'FREE',     lat:51.5140, lng:7.4648, pricePerHour:3.00 },
  { id:3, name:'A-03', zoneId:1, zoneName:'Zone A – Central',  status:'OCCUPIED',  lat:51.5132, lng:7.4656, pricePerHour:2.50 },
  { id:4, name:'B-01', zoneId:2, zoneName:'Zone B – Station',  status:'FREE',     lat:51.5180, lng:7.4590, pricePerHour:0.00 },
  { id:5, name:'B-02', zoneId:2, zoneName:'Zone B – Station',  status:'RESERVED',  lat:51.5175, lng:7.4580, pricePerHour:2.00 },
  { id:6, name:'C-01', zoneId:3, zoneName:'Zone C – Market',   status:'FREE',     lat:51.5125, lng:7.4668, pricePerHour:3.00 },
  { id:7, name:'C-02', zoneId:3, zoneName:'Zone C – Market',   status:'FREE',     lat:51.5120, lng:7.4655, pricePerHour:1.00 },
  { id:8, name:'D-01', zoneId:4, zoneName:'Zone D – Hospital', status:'FREE',      lat:51.5052, lng:7.4555, pricePerHour:2.00 },
];

export default function ParkingMap() {
  const toast = useToast();
  const [spaces,      setSpaces]      = useState([]);
  const [showFree,    setShowFree]    = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [booking,     setBooking]     = useState(false);
  const [bookForm,    setBookForm]    = useState({ date:'', startTime:'', duration:1 });
  const [saving,      setSaving]      = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    spaceApi.getAvailable().then(r => {
      const data = r.data?.content ?? r.data ?? [];
      setSpaces(data.length ? data : DEMO_SPACES);
    }).catch(() => setSpaces(DEMO_SPACES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = spaces.filter(s =>
    (!showFree || s.status === 'FREE')
  );

  const handleReserve = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const startDateTime = `${bookForm.date}T${bookForm.startTime}:00`;
      const endDateTime   = new Date(new Date(startDateTime).getTime() + bookForm.duration * 3600000).toISOString();
      await reservationApi.create({
        spaceId: selected.id,
        startTime: startDateTime,
        endTime:   endDateTime,
      });
      toast.success(`Space ${selected.name} reserved!`);
      setBooking(false);
      setSelected(null);
      // Refresh spaces
      spaceApi.getAvailable().then(r => setSpaces(r.data?.content ?? r.data ?? DEMO_SPACES)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reservation failed');
    } finally { setSaving(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ height:'calc(100vh - 120px)', display:'flex', flexDirection:'column', gap:12 }}>
      {/* Filters bar */}
      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', flexShrink:0 }}>
        <h2 style={{ fontSize:18, fontFamily:'var(--font-display)', marginRight:4 }}>Find Parking</h2>
        <div style={{ flex:1 }} />
        {/* Only free toggle */}
        <button
          className={`btn btn-sm ${showFree ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFree(!showFree)}
        >
          Available only
        </button>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--text-secondary)', flexShrink:0 }}>
        {[['var(--green)','Free'],['var(--amber)','Reserved'],['var(--red)','Occupied']].map(([c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="dot" style={{ background:c }} /> {l}
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="map-container" style={{ flex:1, minHeight:300 }}>
        <MapContainer center={DORTMUND_CENTER} zoom={14} style={{ height:'100%', width:'100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map(space => {
            const lat = space.lat ?? space.latitude;
            const lng = space.lng ?? space.longitude;
            if (!lat || !lng) return null;
            return (
              <Marker key={space.id} position={[lat, lng]} icon={makeIcon(space.status)}
                eventHandlers={{ click: () => { setSelected(space); setBooking(false); } }}>
                <Popup>
                  <div style={{ fontFamily:'var(--font-body)', minWidth:160 }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{space.name}</div>
                    <div style={{ fontSize:12, color:'#666', marginBottom:8 }}>{space.zoneName}</div>
                    <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, background: space.status==='FREE'?'#e8f5e9':'#fff3e0', color: space.status==='FREE'?'#2e7d32':'#e65100', padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{space.status}</span>
                    </div>
                    <div style={{ fontSize:13, marginBottom:8 }}>
                      <strong>€{Number(space.pricePerHour ?? 0).toFixed(2)}/h</strong>
                    </div>
                    {space.status === 'FREE' && (
                      <button
                        onClick={() => { setSelected(space); setBooking(true); }}
                        style={{ width:'100%', padding:'7px', background:'#00d4b8', color:'#0b0f1a', border:'none', borderRadius:6, fontWeight:600, cursor:'pointer', fontSize:13 }}>
                        Reserve Now
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Space count */}
      <div style={{ fontSize:13, color:'var(--text-secondary)', flexShrink:0 }}>
        Showing {filtered.length} space{filtered.length !== 1 ? 's' : ''}
        {filtered.filter(s=>s.status==='FREE').length > 0 &&
          <span style={{ color:'var(--green)', marginLeft:8 }}>
            • {filtered.filter(s=>s.status==='FREE').length} available
          </span>
        }
      </div>

      {/* Booking modal */}
      {booking && selected && (
        <div className="modal-overlay" onClick={() => setBooking(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Reserve Space {selected.name}</h2>
            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              <span className="badge badge-free">FREE</span>
              <span style={{ marginLeft:'auto', fontWeight:700, color:'var(--teal)' }}>
                €{Number(selected.pricePerHour ?? 0).toFixed(2)}/h
              </span>
            </div>
            <form onSubmit={handleReserve} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Date *</label>
                <input className="input" type="date" min={today} value={bookForm.date}
                  onChange={e => setBookForm(f=>({...f, date:e.target.value}))} required />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="input-group">
                  <label className="input-label">Start time *</label>
                  <input className="input" type="time" value={bookForm.startTime}
                    onChange={e => setBookForm(f=>({...f, startTime:e.target.value}))} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Duration (hours)</label>
                  <select className="input" value={bookForm.duration} onChange={e => setBookForm(f=>({...f,duration:Number(e.target.value)}))}>
                    {[1,2,3,4,6,8,12].map(h => <option key={h} value={h}>{h}h</option>)}
                  </select>
                </div>
              </div>
              {/* Estimated cost */}
              <div style={{ padding:'12px 16px', borderRadius:'var(--radius-md)', background:'var(--bg-elevated)', border:'1px solid var(--border)', fontSize:14 }}>
                <span style={{ color:'var(--text-secondary)' }}>Estimated cost: </span>
                <strong style={{ color:'var(--teal)' }}>€{(Number(selected.pricePerHour ?? 0) * bookForm.duration).toFixed(2)}</strong>
                <span style={{ color:'var(--text-muted)', fontSize:12 }}> (excl. charging)</span>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setBooking(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner"/> : <><CalendarCheck size={15}/> Confirm Reservation</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
