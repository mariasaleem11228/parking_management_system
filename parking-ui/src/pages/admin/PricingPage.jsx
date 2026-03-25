import React, { useEffect, useState } from 'react';
import { pricingApi, zoneApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react';

const EMPTY = { zoneId:'', pricePerHour:'', currency:'EUR' };

const DEMO_PRICING = [
  { id:1, zoneId:1, zoneName:'Zone A – Central',  pricePerHour:2.50, currency:'EUR' },
  { id:2, zoneId:2, zoneName:'Zone B – Station',  pricePerHour:2.00, currency:'EUR' },
  { id:3, zoneId:3, zoneName:'Zone C – Market',   pricePerHour:1.00, currency:'EUR' },
  { id:4, zoneId:4, zoneName:'Zone D – Hospital', pricePerHour:0.00, currency:'EUR' },
];

export default function PricingPage() {
  const toast = useToast();
  const [pricing,  setPricing]  = useState([]);
  const [zones,    setZones]    = useState([]);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    Promise.all([
      pricingApi.getAll().catch(() => null),
      zoneApi.getAll().catch(() => null),
    ]).then(([pr, zn]) => {
      setPricing(pr?.data?.content ?? pr?.data ?? DEMO_PRICING);
      setZones(zn?.data?.content ?? zn?.data ?? [
        { id:1, name:'Zone A – Central' }, { id:2, name:'Zone B – Station' },
        { id:3, name:'Zone C – Market' }, { id:4, name:'Zone D – Hospital' },
      ]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (p)  => { setForm({ ...p }); setModal('edit'); };
  const closeModal = ()   => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        zoneId: Number(form.zoneId),
        pricePerHour: parseFloat(form.pricePerHour),
      };
      if (modal === 'create') {
        await pricingApi.create(payload); toast.success('Pricing rule created!');
      } else {
        await pricingApi.update(form.id, payload); toast.success('Pricing rule updated!');
      }
      load(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save pricing');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pricing rule?')) return;
    try { await pricingApi.delete(id); toast.success('Pricing rule deleted'); load(); }
    catch { toast.error('Could not delete pricing rule'); }
  };

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>Pricing Policies</h1>
          <p>Set parking rates per zone</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add Rule</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14, marginBottom:24 }}>
        <div className="card card-sm" style={{ borderColor:'rgba(0,212,184,0.3)' }}>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>Avg Rate</div>
          <div style={{ fontSize:24, fontWeight:800, fontFamily:'var(--font-display)', color:'var(--teal)' }}>
            €{pricing.length ? (pricing.reduce((a,p)=> a + p.pricePerHour, 0) / pricing.length).toFixed(2) : '0.00'}/h
          </div>
        </div>
        <div className="card card-sm">
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>Total Rules</div>
          <div style={{ fontSize:24, fontWeight:800, fontFamily:'var(--font-display)' }}>{pricing.length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Zone</th><th>Rate / Hour</th><th>Currency</th><th style={{ width:100 }}>Actions</th></tr>
            </thead>
            <tbody>
              {pricing.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.zoneName ?? zones.find(z=>z.id===p.zoneId)?.name ?? `Zone ${p.zoneId}`}</strong></td>
                  <td style={{ fontWeight:600, color:'var(--green)' }}>
                    {p.pricePerHour === 0 ? <span style={{ color:'var(--text-muted)' }}>Free</span> : `€${Number(p.pricePerHour).toFixed(2)}`}
                  </td>
                  <td style={{ color:'var(--text-secondary)' }}>{p.currency}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={13}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pricing.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No pricing rules yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{modal === 'create' ? 'Create Pricing Rule' : 'Edit Pricing Rule'}</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Zone *</label>
                <select className="input" value={form.zoneId} onChange={set('zoneId')} required>
                  <option value="">Select zone…</option>
                  {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="input-group">
                  <label className="input-label">Price per hour (€) *</label>
                  <input className="input" type="number" step="0.01" min="0" value={form.pricePerHour} onChange={set('pricePerHour')} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Currency</label>
                  <select className="input" value={form.currency} onChange={set('currency')}>
                    <option>EUR</option><option>USD</option><option>GBP</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner"/> : modal === 'create' ? 'Create Rule' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
