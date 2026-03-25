import React, { useEffect, useState } from 'react';
import { billingApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CreditCard, Receipt, CheckCircle, Clock, Download } from 'lucide-react';
import { format } from 'date-fns';

const DEMO_INVOICES = [
  { id:201, reservationId:99,  spaceName:'B-04', zoneName:'Zone B – Station',  amount:8.50, status:'PAID',   issuedAt:'2024-03-24T14:05:00', paidAt:'2024-03-24T14:06:00' },
  { id:202, reservationId:98,  spaceName:'C-01', zoneName:'Zone C – Market',   amount:6.00, status:'PAID',   issuedAt:'2024-03-23T11:02:00', paidAt:'2024-03-23T11:02:30' },
  { id:203, reservationId:100, spaceName:'B-01', zoneName:'Zone B – Station',  amount:4.00, status:'UNPAID', issuedAt:'2024-03-25T00:00:00', paidAt:null },
];

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'];

export default function MyBilling() {
  const toast = useToast();
  const [invoices,  setInvoices]  = useState([]);
  const [payModal,  setPayModal]  = useState(null);
  const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);
  const [paying,    setPaying]    = useState(false);
  const [loading,   setLoading]   = useState(true);

  const load = () => {
    billingApi.getMyInvoices()
      .then(r => setInvoices(r.data?.content ?? r.data ?? []))
      .catch(() => setInvoices(DEMO_INVOICES))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handlePay = async (e) => {
    e.preventDefault(); setPaying(true);
    try {
      await billingApi.payInvoice(payModal.id, { method: payMethod });
      toast.success('Payment successful!');
      setPayModal(null); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setPaying(false); }
  };

  const fmt = (dt) => { try { return format(new Date(dt), 'dd MMM yyyy, HH:mm'); } catch { return '—'; } };

  const totalPaid   = invoices.filter(i=>i.status==='PAID').reduce((a,i)=>a+Number(i.amount),0);
  const totalUnpaid = invoices.filter(i=>i.status==='UNPAID').reduce((a,i)=>a+Number(i.amount),0);

  return (
    <div className="animate-in" style={{ maxWidth:680, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontFamily:'var(--font-display)' }}>Billing</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Your parking invoices and payment history</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }}>
        <div className="card card-sm" style={{ borderColor:'rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
            <CheckCircle size={13} color="var(--green)"/> Total Paid
          </div>
          <div style={{ fontSize:28, fontFamily:'var(--font-display)', fontWeight:800, color:'var(--green)' }}>
            €{totalPaid.toFixed(2)}
          </div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{invoices.filter(i=>i.status==='PAID').length} invoice(s)</div>
        </div>
        <div className="card card-sm" style={{ borderColor: totalUnpaid > 0 ? 'rgba(245,158,11,0.3)' : 'var(--border)' }}>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
            <Clock size={13} color="var(--amber)"/> Outstanding
          </div>
          <div style={{ fontSize:28, fontFamily:'var(--font-display)', fontWeight:800, color: totalUnpaid > 0 ? 'var(--amber)' : 'var(--text-muted)' }}>
            €{totalUnpaid.toFixed(2)}
          </div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{invoices.filter(i=>i.status==='UNPAID').length} pending</div>
        </div>
      </div>

      {/* Outstanding alert */}
      {totalUnpaid > 0 && (
        <div style={{ padding:'14px 18px', borderRadius:'var(--radius-md)', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', marginBottom:20, fontSize:14 }}>
          ⚠️ You have <strong>€{totalUnpaid.toFixed(2)}</strong> in outstanding invoices. Please pay to keep your account active.
        </div>
      )}

      {/* Invoices */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><span className="spinner"/></div>
      ) : invoices.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60, color:'var(--text-muted)' }}>
          <Receipt size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <div>No invoices yet</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {invoices.map(inv => (
            <div key={inv.id} className="card" style={{ borderColor: inv.status==='UNPAID' ? 'rgba(245,158,11,0.3)' : 'var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <Receipt size={15} color="var(--text-muted)"/>
                    <strong>INV-{inv.id}</strong>
                    <span style={{ color:'var(--text-muted)', fontSize:12 }}>· Reservation #{inv.reservationId}</span>
                  </div>
                  {inv.spaceName && (
                    <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:8 }}>
                      {inv.spaceName} — {inv.zoneName}
                    </div>
                  )}
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                    Issued: {fmt(inv.issuedAt)}
                    {inv.paidAt && <> · Paid: {fmt(inv.paidAt)}</>}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:22, fontFamily:'var(--font-display)', fontWeight:800,
                    color: inv.status==='PAID' ? 'var(--green)' : 'var(--amber)' }}>
                    €{Number(inv.amount).toFixed(2)}
                  </div>
                  <span className={`badge ${inv.status==='PAID' ? 'badge-free' : 'badge-reserved'}`} style={{ fontSize:11 }}>
                    {inv.status}
                  </span>
                  {inv.status === 'UNPAID' && (
                    <div style={{ marginTop:8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setPayModal(inv)}>
                        <CreditCard size={13}/> Pay Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment modal */}
      {payModal && (
        <div className="modal-overlay" onClick={() => setPayModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Pay Invoice INV-{payModal.id}</h2>
            <div style={{ padding:'14px 16px', borderRadius:'var(--radius-md)', background:'var(--bg-elevated)', marginBottom:20 }}>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:4 }}>Amount due</div>
              <div style={{ fontSize:28, fontFamily:'var(--font-display)', fontWeight:800, color:'var(--amber)' }}>
                €{Number(payModal.amount).toFixed(2)}
              </div>
            </div>
            <form onSubmit={handlePay} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="input-group">
                <label className="input-label">Payment method</label>
                <select className="input" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)', padding:'10px 14px', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)' }}>
                🔒 Payment is processed securely via the city payment gateway
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPayModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={paying}>
                  {paying ? <span className="spinner"/> : <><CreditCard size={14}/> Pay €{Number(payModal.amount).toFixed(2)}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
