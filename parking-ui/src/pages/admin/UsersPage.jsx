import React, { useEffect, useState } from 'react';
import { userApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, Shield, UserCheck, Search } from 'lucide-react';

const EMPTY = { name:'', email:'', password:'', role:'CITIZEN', licensePlate:'' };

const DEMO_USERS = [
  { id:1, name:'Admin User',  email:'admin@city.gov',    role:'ADMIN',   licensePlate:'',          createdAt:'2024-01-15' },
  { id:2, name:'Jane Doe',    email:'jane@example.com',  role:'CITIZEN', licensePlate:'DO-JD-1234', createdAt:'2024-02-01' },
  { id:3, name:'Mark Weber',  email:'mark@example.com',  role:'CITIZEN', licensePlate:'DO-MW-5678', createdAt:'2024-02-10' },
  { id:4, name:'Sara Klein',  email:'sara@example.com',  role:'CITIZEN', licensePlate:'DO-SK-9012', createdAt:'2024-03-05' },
  { id:5, name:'Tom Richter', email:'tom@example.com',   role:'CITIZEN', licensePlate:'',           createdAt:'2024-03-20' },
];

export default function UsersPage() {
  const toast = useToast();
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    userApi.getAll().then(r => setUsers(r.data?.content ?? r.data ?? []))
      .catch(() => setUsers(DEMO_USERS))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (u) => { setForm({ ...u, password:'' }); setModal('edit'); };
  const closeModal = ()  => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') {
        await userApi.create(form); toast.success('User created!');
      } else {
        const { password, ...payload } = form;
        await userApi.update(form.id, password ? form : payload); toast.success('User updated!');
      }
      load(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await userApi.delete(id); toast.success('User deleted'); load(); }
    catch { toast.error('Could not delete user'); }
  };

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'ADMIN' ? 'CITIZEN' : 'ADMIN';
    try {
      await userApi.assignRole(u.id, newRole);
      toast.success(`Role changed to ${newRole}`);
      load();
    } catch { toast.error('Could not change role'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>User Management</h1>
          <p>Manage citizen and administrator accounts</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> New User</button>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Users', value: users.length, color:'var(--teal)' },
          { label:'Citizens',    value: users.filter(u=>u.role==='CITIZEN').length, color:'var(--blue)' },
          { label:'Admins',      value: users.filter(u=>u.role==='ADMIN').length,   color:'var(--purple)' },
        ].map(s => (
          <div key={s.label} className="card card-sm" style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:26, fontFamily:'var(--font-display)', fontWeight:800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:340, marginBottom:20 }}>
        <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
        <input className="input" style={{ paddingLeft:36 }} placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>License Plate</th><th>Joined</th><th style={{ width:120 }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:32, height:32, borderRadius:'50%',
                        background: u.role==='ADMIN' ? 'rgba(139,92,246,0.15)' : 'var(--teal-glow)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'var(--font-display)', fontWeight:700, fontSize:13,
                        color: u.role==='ADMIN' ? 'var(--purple)' : 'var(--teal)',
                        flexShrink:0,
                      }}>{u.name[0]}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td style={{ color:'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role==='ADMIN' ? 'badge-purple' : 'badge-teal'}`}>
                      {u.role==='ADMIN' ? <Shield size={11}/> : <UserCheck size={11}/>}
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color:'var(--text-secondary)', fontFamily:'monospace', fontSize:13 }}>
                    {u.licensePlate || <span style={{ color:'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ color:'var(--text-secondary)', fontSize:13 }}>{u.createdAt?.split('T')[0] ?? '—'}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Toggle role" onClick={() => handleRoleToggle(u)}>
                        <Shield size={13}/>
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(u)}><Pencil size={13}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{modal === 'create' ? 'Create User' : 'Edit User'}</h2>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Full name *</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="Jane Doe" required />
              </div>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" required />
              </div>
              <div className="input-group">
                <label className="input-label">{modal === 'edit' ? 'New password (leave blank to keep)' : 'Password *'}</label>
                <input className="input" type="password" value={form.password} onChange={set('password')} required={modal==='create'} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="input-group">
                  <label className="input-label">Role</label>
                  <select className="input" value={form.role} onChange={set('role')}>
                    <option value="CITIZEN">CITIZEN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">License Plate</label>
                  <input className="input" value={form.licensePlate} onChange={set('licensePlate')} placeholder="DO-XX-1234" />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner"/> : modal === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
