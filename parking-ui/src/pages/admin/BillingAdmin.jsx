import React, { useEffect, useState } from 'react';
import { billingApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { RefreshCw, TrendingUp, Receipt, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const DEMO_INVOICES = [
  { id:201, reservationId:103, userName:'Sara Klein',  amount:6.25,  status:'PAID',    issuedAt:'2024-03-25T09:30:00', paidAt:'2024-03-25T09:32:00' },
  { id:202, reservationId:106, userName:'Tom Richter', amount:12.00, status:'UNPAID',  issuedAt:'2024-03-24T18:00:00', paidAt:null },
  { id:203, reservationId:107, userName:'Mark Weber',  amount:8.50,  status:'PAID',    issuedAt:'2024-03-24T15:00:00', paidAt:'2024-03-24T15:05:00' },
  { id:204, reservationId:108, userName:'Jane Doe',    amount:5.00,  status:'UNPAID',  issuedAt:'2024-03-23T12:00:00', paidAt:null },
  { id:205, reservationId:109, userName:'Jane Doe',    amount:4.50,  status:'PAID',    issuedAt:'2024-03-22T10:00:00', paidAt:'2024-03-22T10:01:00' },
];
const DEMO_CHART = [
  { day:'Mon', revenue:48 }, { day:'Tue', revenue:72 }, { day:'Wed', revenue:65 },
  { day:'Thu', revenue:90 }, { day:'Fri', revenue:110 },{ day:'Sat', revenue:95 },
  { day:'Sun', revenue:58 },
];

export default function BillingAdmin() {
  const toast = useToast();
  const [invoices, setInvoices] = useState([]);
  const [chart,    setChart]    = useState(DEMO_CHART);
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    Promise.all([
      billingApi.getAllInvoices().catch(() => null),
      billingApi.getStats().catch(() => null),
    ]).then(([inv, stats]) => {
      setInvoices(inv?.data?.content ?? inv?.data ?? DEMO_INVOICES);
      if (stats?.data?.daily) setChart(stats.data.daily);
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (dt) => { try { return format(new Date(dt), 'dd MMM, HH:mm'); } catch { return '—'; } };

  const totalPaid   = invoices.filter(i=>i.status==='PAID').reduce((a,i)=>a+Number(i.amount),0);
  const totalUnpaid = invoices.filter(i=>i.status==='UNPAID').reduce((a,i)=>a+Number(i.amount),0);

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>Billing & Invoices</h1>
          <p>Track payments and revenue across all parking zones</p>
        </div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15}/> Refresh</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        {[
          { label:'Total Collected',   value:`€${totalPaid.toFixed(2)}`,   icon: TrendingUp, color:'var(--green)' },
          { label:'Outstanding',       value:`€${totalUnpaid.toFixed(2)}`, icon: Receipt,    color:'var(--amber)' },
          { label:'Total Invoices',    value: invoices.length,             icon: Receipt,    color:'var(--teal)' },
          { label:'Paid Invoices',     value: invoices.filter(i=>i.status==='PAID').length, icon: CheckCircle, color:'var(--blue)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="stat-label">{label}</span>
              <div style={{ padding:7, borderRadius:'var(--radius-sm)', background:`${color}18` }}>
                <Icon size={16} color={color}/>
              </div>
            </div>
            <div className="stat-value" style={{ fontSize:26, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card" style={{ marginBottom:28 }}>
        <h3 style={{ fontSize:15, marginBottom:20 }}>Weekly Revenue (€)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chart} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} tickLine={false} unit="€" />
            <Tooltip contentStyle={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:8, fontSize:13 }} />
            <Bar dataKey="revenue" fill="var(--teal)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Invoices table */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Invoice #</th><th>Reservation</th><th>Citizen</th><th>Amount</th><th>Status</th><th>Issued</th><th>Paid At</th></tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>INV-{inv.id}</td>
                  <td style={{ color:'var(--text-secondary)' }}>#{inv.reservationId}</td>
                  <td>{inv.userName ?? '—'}</td>
                  <td style={{ fontWeight:600, color: inv.status==='PAID' ? 'var(--green)' : 'var(--amber)' }}>
                    €{Number(inv.amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${inv.status==='PAID' ? 'badge-free' : 'badge-reserved'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{fmt(inv.issuedAt)}</td>
                  <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{inv.paidAt ? fmt(inv.paidAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
