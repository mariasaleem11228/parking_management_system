import React, { useEffect, useState } from 'react';
import { spaceApi, zoneApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, Car } from 'lucide-react';

const STATUS_OPTS = ['FREE', 'RESERVED', 'OCCUPIED'];
const EMPTY = { name:'', zoneId:'', status:'FREE' };

const DEMO_SPACES = [
  { id:1, name:'A-01', zoneId:1, zoneName:'Zone A – Central',  status:'FREE' },
  { id:2, name:'A-02', zoneId:1, zoneName:'Zone A – Central',  status:'OCCUPIED' },
  { id:3, name:'A-03', zoneId:1, zoneName:'Zone A – Central',  status:'RESERVED' },
  { id:4, name:'B-01', zoneId:2, zoneName:'Zone B – Station',  status:'FREE' },
  { id:5, name:'B-02', zoneId:2, zoneName:'Zone B – Station',  status:'FREE' },
  { id:6, name:'C-01', zoneId:3, zoneName:'Zone C – Market',   status:'OCCUPIED' },
  { id:7, name:'C-02', zoneId:3, zoneName:'Zone C – Market',   status:'FREE' },
  { id:8, name:'D-01', zoneId:4, zoneName:'Zone D – Hospital', status:'RESERVED' },
];

function statusClass(s) {
  return s === 'FREE' ? 'badge-free' : s === 'RESERVED' ? 'badge-reserved' : 'badge-occupied';
}

export default function SpacesPage() {
  const toast = useToast();
  const [spaces,  setSpaces]  = useState([]);
  const [zones,   setZones]   = useState([]);
  const [filter,  setFilter]  = useState({ zoneId:'', status:'' });
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      spaceApi.getAll(filter).catch(() => null),
      zoneApi.getAll().catch(() => null),
    ]).then(([sp, zn]) => {
      setSpaces(sp?.data?.content ?? sp?.data ?? DEMO_SPACES);
      setZones(zn?.data?.content ?? zn?.data ?? [
        { id:1, name:'Zone A – Central' }, { id:2, name:'Zone B – Station' },
        { id:3, name:'Zone C – Market' }, { id:4, name:'Zone D – Hospital' },
      ]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setFilter_ = (k) => (e) => setFilter(f => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (s)  => { setForm({ ...s }); setModal('edit'); };
  const closeModal = ()   => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') {
        await spaceApi.create({ ...form, zoneId: Number(form.zoneId) });
        toast.success('Space created!');
      } else {
        await spaceApi.update(form.id, { ...form, zoneId: Number(form.zoneId) });
        toast.success('Space updated!');
      }
      load(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save space');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this parking space?')) return;
    try { await spaceApi.delete(id); toast.success('Space deleted'); load(); }
    catch { toast.error('Could not delete space'); }
  };

  const filtered = spaces.filter(s =>
    (!filter.zoneId || String(s.zoneId) === filter.zoneId) &&
    (!filter.status || s.status === filter.status)
  );

  const counts = { FREE: 0, RESERVED: 0, OCCUPIED: 0 };
  spaces.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>Parking Spaces</h1>
          <p>Manage individual spaces, types and availability</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add Space</button>
      </div>

      {/* Quick stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {Object.entries(counts).map(([k,v]) => (
          <div key={k} className="card card-sm" style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:800,
              color: k==='FREE'?'var(--green)':k==='RESERVED'?'var(--amber)':'var(--red)' }}>{v}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <select className="input" style={{ width:180 }} value={filter.zoneId} onChange={setFilter_('zoneId')}>
          <option value="">All Zones</option>
          {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <select className="input" style={{ width:140 }} value={filter.status} onChange={setFilter_('status')}>
          <option value="">All Status</option>
          {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Spaces grid */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Space</th><th>Zone</th><th>Status</th><th style={{ width:100 }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <Car size={14} color="var(--text-muted)"/>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td style={{ color:'var(--text-secondary)' }}>{s.zoneName ?? zones.find(z=>z.id===s.zoneId)?.name ?? `Zone ${s.zoneId}`}</td>
                  <td><span className={`badge ${statusClass(s.status)}`}>
                    <span className={`dot ${s.status==='FREE'?'dot-green':s.status==='RESERVED'?'dot-amber':'dot-red'}`}/>
                    {s.status}
                  </span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(s)}><Pencil size={13}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No spaces match current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{modal === 'create' ? 'Add Parking Space' : 'Edit Parking Space'}</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Space name / number *</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="A-01" required />
              </div>
              <div className="input-group">
                <label className="input-label">Zone *</label>
                <select className="input" value={form.zoneId} onChange={set('zoneId')} required>
                  <option value="">Select zone…</option>
                  {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="input" value={form.status} onChange={set('status')}>
                    {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner"/> : modal === 'create' ? 'Add Space' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
