import React, { useEffect, useState } from 'react';
import { zoneApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, MapPin, ChevronRight } from 'lucide-react';

const EMPTY = { name:'', description:'', city:'', latitude:'', longitude:'', capacity:'' };

export default function ZonesPage() {
  const toast = useToast();
  const [zones,   setZones]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | 'create' | 'edit'
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [selected,setSelected]= useState(null);

  const load = () => {
    zoneApi.getAll().then(r => setZones(r.data?.content ?? r.data ?? [])).catch(() => {
      // demo fallback
      setZones([
        { id:1, name:'Zone A – Central',  city:'Dortmund', capacity:40, description:'City centre parking', latitude:51.5136, longitude:7.4653 },
        { id:2, name:'Zone B – Station',  city:'Dortmund', capacity:30, description:'Main station area',  latitude:51.5177, longitude:7.4590 },
        { id:3, name:'Zone C – Market',   city:'Dortmund', capacity:25, description:'Market square',      latitude:51.5128, longitude:7.4667 },
        { id:4, name:'Zone D – Hospital', city:'Dortmund', capacity:29, description:'Hospital visitor parking', latitude:51.5050, longitude:7.4550 },
      ]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (z)  => { setForm({ ...z, latitude: z.latitude??'', longitude: z.longitude??'' }); setModal('edit'); };
  const closeModal = ()   => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity), latitude: Number(form.latitude), longitude: Number(form.longitude) };
      if (modal === 'create') {
        await zoneApi.create(payload);
        toast.success('Zone created!');
      } else {
        await zoneApi.update(form.id, payload);
        toast.success('Zone updated!');
      }
      load(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save zone');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this zone? All spaces inside will also be removed.')) return;
    try {
      await zoneApi.delete(id);
      toast.success('Zone deleted');
      load();
    } catch { toast.error('Could not delete zone'); }
  };

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>Parking Zones</h1>
          <p>Define and manage parking zones across the city</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> New Zone</button>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:16 }}>
          {zones.map(z => (
            <div key={z.id} className="card" style={{ cursor:'pointer', transition:'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--teal)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
              onClick={() => setSelected(selected?.id === z.id ? null : z)}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <div style={{ padding:8, borderRadius:'var(--radius-sm)', background:'var(--teal-glow)' }}>
                    <MapPin size={18} color="var(--teal)" />
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>{z.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{z.city}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); openEdit(z); }}><Pencil size={14}/></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={e => { e.stopPropagation(); handleDelete(z.id); }}><Trash2 size={14}/></button>
                </div>
              </div>

              <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:12 }}>{z.description || 'No description'}</p>

              <div style={{ display:'flex', gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Capacity</div>
                  <div style={{ fontWeight:700, color:'var(--teal)' }}>{z.capacity ?? '—'} spaces</div>
                </div>
                {z.latitude && (
                  <div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Coords</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{Number(z.latitude).toFixed(4)}, {Number(z.longitude).toFixed(4)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {zones.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:60, color:'var(--text-muted)' }}>
              No zones yet. <button className="btn btn-ghost" onClick={openCreate}>Create your first zone <ChevronRight size={14}/></button>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{modal === 'create' ? 'Create New Zone' : 'Edit Zone'}</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Zone name *</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="Zone A – Central" required />
              </div>
              <div className="input-group">
                <label className="input-label">City</label>
                <input className="input" value={form.city} onChange={set('city')} placeholder="Dortmund" />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <input className="input" value={form.description} onChange={set('description')} placeholder="Short description…" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="input-group">
                  <label className="input-label">Latitude</label>
                  <input className="input" type="number" step="any" value={form.latitude} onChange={set('latitude')} placeholder="51.5136" />
                </div>
                <div className="input-group">
                  <label className="input-label">Longitude</label>
                  <input className="input" type="number" step="any" value={form.longitude} onChange={set('longitude')} placeholder="7.4653" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Capacity (spaces) *</label>
                <input className="input" type="number" min="1" value={form.capacity} onChange={set('capacity')} required />
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit"  className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner"/> : modal === 'create' ? 'Create Zone' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
